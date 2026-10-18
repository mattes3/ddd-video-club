import { getLogger } from '@logtape/logtape';
import { nocache } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import type { RentalAppService } from '../../domainmodel/RentalAppService';
import { readBody, validateRentMovieCommand } from './validation';

const logger = getLogger(['rental', 'http']);

export function router(appService: RentalAppService) {
    const r = new Hono();

    r.use(nocache());

    // a test endpoint
    r.get('/ping', c => c.text('Pong!'));

    // endpoint that rents a movie
    r.post('/', async c => {
        try {
            const command = validateRentMovieCommand(await readBody(c));

            if (command) {
                const newRentalId = await appService.rentMovie(command);
                c.header('Location', `/api/rentals/${newRentalId}`);
                return c.json({ id: newRentalId, message: 'Movie rented successfully' }, 201);
            } else {
                return c.text('incomplete request', 400);
            }
        } catch (error: unknown) {
            logger.error('internal error while renting a movie: {error}', { error });
            return c.text('internal error', 500);
        }
    });

    // endpoint that allows viewing rental data
    r.get('/:id', async c => {
        const rental = await appService.viewRental(c.req.param('id'));

        if (rental) {
            return c.json(rental);
        } else {
            return c.text('no such rental', 404);
        }
    });

    return r;
}
