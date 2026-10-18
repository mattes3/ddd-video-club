import { getLogger } from '@logtape/logtape';
import { CURRENT_CUSTOMER_ID, nocache } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';

import type { RentalAppService } from '../../domainmodel/RentalAppService';
import { validateRentMovieCommand } from './validation';

const logger = getLogger(['rental', 'pages']);

type MovieToRent = { movieId: string; movieTitle: string; movieCategoryName: string };

// HTML fragments of the rental context: the rent dialog and its form submission
export function pages(appService: RentalAppService) {
    const r = new Hono();

    r.use(nocache());

    // the dialog that asks until when the movie shall be rented (swapped in by htmx)
    r.get('/new', c => {
        const { movieId, movieTitle, movieCategoryName } = c.req.query();

        if (!movieId || !movieTitle || !movieCategoryName) {
            return c.text('incomplete request', 400);
        }

        return c.html(<RentDialog movie={{ movieId, movieTitle, movieCategoryName }} />);
    });

    // the form submission of the rent dialog
    r.post('/', async c => {
        const body = await c.req.parseBody();
        const movie = {
            movieId: String(body.movieId ?? ''),
            movieTitle: String(body.movieTitle ?? ''),
            movieCategoryName: String(body.movieCategoryName ?? ''),
        };

        const command = validateRentMovieCommand({
            ...movie,
            customerId: CURRENT_CUSTOMER_ID,
            startOfRental: new Date().toISOString(),
            endOfRental: body.endOfRental,
        });

        if (!command || command.endOfRental <= command.startOfRental) {
            return c.html(
                <RentDialog movie={movie} error="Please choose a date in the future." />,
                422,
            );
        }

        try {
            await appService.rentMovie(command);
        } catch (error: unknown) {
            logger.error('internal error while renting a movie: {error}', { error });
            return c.html(
                <RentDialog movie={movie} error="Sorry, renting failed. Please try again." />,
                500,
            );
        }

        const viewingUrl = `/movie/${encodeURIComponent(command.movieId)}/viewing`;

        if (c.req.header('HX-Request')) {
            c.header('HX-Redirect', viewingUrl);
            return c.body(null, 200);
        }

        return c.redirect(viewingUrl, 303);
    });

    return r;
}

function RentDialog({ movie, error }: { movie: MovieToRent; error?: string }) {
    const tomorrow = isoDate(daysFromToday(1));

    return (
        <dialog id="rent-dialog" aria-labelledby="rent-dialog-title">
            <form method="post" action="/rentals" hx-post="/rentals" hx-target="#dialog-slot">
                <h2 id="rent-dialog-title">Watch "{movie.movieTitle}"</h2>
                <p id="rent-dialog-question">Until when do you want to rent this movie?</p>

                {/* Cally calendar (https://wicky.nillia.ms/cally). It does not take part
                    in forms, so it copies the chosen date into the hidden input. */}
                <calendar-date
                    class="calendar"
                    value={tomorrow}
                    min={tomorrow}
                    aria-labelledby="rent-dialog-question"
                    onchange="this.closest('form').endOfRental.value = this.value"
                >
                    <svg aria-label="Previous" slot="previous" viewBox="0 0 24 24">
                        <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                    </svg>
                    <svg aria-label="Next" slot="next" viewBox="0 0 24 24">
                        <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                    </svg>
                    <calendar-month></calendar-month>
                </calendar-date>
                <input type="hidden" name="endOfRental" value={tomorrow} />

                {error && <p class="dialog-error">{error}</p>}
                <input type="hidden" name="movieId" value={movie.movieId} />
                <input type="hidden" name="movieTitle" value={movie.movieTitle} />
                <input type="hidden" name="movieCategoryName" value={movie.movieCategoryName} />
                <div class="dialog-buttons">
                    <button
                        type="button"
                        class="btn-primary-outline"
                        onclick="this.closest('dialog').close()"
                    >
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                        Rent now
                    </button>
                </div>
            </form>
        </dialog>
    );
}

function daysFromToday(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

function isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}
