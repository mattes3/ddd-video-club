import type { TransactionOnRepoProvider } from '@ddd-video-club-v2/database';
import type { Movie } from './Movie';
import type { MovieRepository } from './MovieRepository';
import type { MovieSelectionReadModel, MovieViewingReadModel } from './MovieReadModelTypes';

// @Factory
function buildSelectionReadModels(movies: Movie[]): MovieSelectionReadModel[] {
    return movies.map(({ id, title, description, posterUrl, publicationDate, categoryName }) => ({
        id,
        title,
        description,
        posterUrl,
        publicationDate,
        categoryName,
    }));
}

// @Factory
function buildViewingReadModel(movie: Movie | undefined): MovieViewingReadModel | undefined {
    if (!movie) {
        return undefined;
    }

    const { id, title, description, videoUrl, publicationDate, categoryName } = movie;
    return { id, title, description, videoUrl, publicationDate, categoryName };
}

// @ApplicationService
export interface MovieAppService {
    findMoviesToSelectFrom(): Promise<MovieSelectionReadModel[]>;
    findMovieForViewing(movieId: string): Promise<MovieViewingReadModel | undefined>;
}

/**
 * Inject the necessary dependencies and return a fully usable application service.
 */
export function getMovieAppService(
    transact: TransactionOnRepoProvider<MovieRepository>,
): MovieAppService {
    return {
        async findMoviesToSelectFrom() {
            return transact(async (repo) => repo.findMovies().then(buildSelectionReadModels));
        },

        async findMovieForViewing(movieId) {
            return transact(async (repo) => repo.getMovieById(movieId).then(buildViewingReadModel));
        },
    };
}
