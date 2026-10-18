import { Layout } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';

import type { MovieAppService } from '../../domainmodel/MovieAppService';
import type { MovieSelectionReadModel } from '../../domainmodel/MovieReadModelTypes';

// HTML pages of the movies context: movie selection and movie viewing
export function pages(appService: MovieAppService) {
    const r = new Hono();

    r.get('/', c => c.redirect('/movie-selection'));

    r.get('/movie-selection', async c => {
        const movies = await appService.findMoviesToSelectFrom();

        return c.html(
            <Layout title="Which movie would you like to watch?" active="select">
                <div class="movie-grid">
                    {movies.map(movie => (
                        <MovieCard movie={movie} />
                    ))}
                </div>
            </Layout>,
        );
    });

    r.get('/movie/:id/viewing', async c => {
        const movie = await appService.findMovieForViewing(c.req.param('id'));

        if (!movie) {
            return c.html(
                <Layout title="Movie not found" active="watch">
                    <p class="empty-state">
                        There is no such movie. <a href="/movie-selection">Select another one.</a>
                    </p>
                </Layout>,
                404,
            );
        }

        return c.html(
            <Layout title={movie.title} active="watch">
                <div class="viewing">
                    <p>{movie.description}</p>
                    <div class="video-frame">
                        <iframe
                            src={movie.videoUrl}
                            title={movie.title}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </Layout>,
        );
    });

    return r;
}

function MovieCard({ movie }: { movie: MovieSelectionReadModel }) {
    // the rental context owns the rent dialog, so we ask it to render one for us
    const rentDialogUrl =
        '/rentals/new?' +
        new URLSearchParams({
            movieId: movie.id,
            movieTitle: movie.title,
            movieCategoryName: movie.categoryName,
        }).toString();

    return (
        <div class="movie">
            <p class="movie-heading">
                <strong>{movie.title}</strong> ({movie.categoryName})
            </p>
            <div class="poster">
                <p class="poster-description">{movie.description}</p>
                <img alt={movie.title} src={movie.posterUrl} />
            </div>
            <button class="btn-primary" hx-get={rentDialogUrl} hx-target="#dialog-slot">
                Rent now
            </button>
        </div>
    );
}
