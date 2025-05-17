import express, { Router } from 'express';
import { logger } from 'express-wolox-logger';
import nocache from 'nocache';
import type { RentMovieCommand, RentalAppService } from '../../domainmodel/RentalAppService';

export function router(appService: RentalAppService): Router {
    const r = Router();

    // Parse URL-encoded bodies (as sent by HTML forms)
    r.use(express.urlencoded({ extended: true }));

    // Parse JSON bodies (as sent by API clients)
    r.use(express.json());

    // a test endpoint
    r.get('/ping', nocache(), (_req, res) => res.type('text/plain').send('Pong!'));

    // endpoint that rents a movie
    r.post('/', nocache(), async (req, res) => {
        const serializeError = await import('serialize-error').then(
            ({ serializeError }) => serializeError,
        );

        try {
            const command = validateRentMovieCommand(req.body as Record<string, any>);

            if (command) {
                const newRentalId = await appService.rentMovie(command);
                res.status(201).location(`/api/rentals/${newRentalId}`).json({
                    id: newRentalId,
                    message: 'Movie rented successfully',
                });
            } else {
                res.status(400).send('incomplete request');
            }
        } catch (error: unknown) {
            logger.error('internal error while renting a movie', serializeError(error));
            res.status(500).send('internal error');
        }
    });

    // endpoint that allows viewing rental data
    r.get('/:id', nocache(), async (req, res) => {
        const rental = await appService.viewRental(req.params.id);

        if (rental) {
            res.json(rental);
        } else {
            res.status(404).send('no such rental');
        }
    });

    return r;
}

function validateRentMovieCommand(requestBody: Record<string, any>): RentMovieCommand | undefined {
    const { customerId, movieId, movieCategoryName, movieTitle, startOfRental, endOfRental } =
        requestBody;

    if (customerId && movieId && movieCategoryName && movieTitle && startOfRental && endOfRental) {
        return {
            customerId,
            movieId,
            movieCategoryName,
            movieTitle,
            startOfRental: new Date(startOfRental as string),
            endOfRental: new Date(endOfRental as string),
        };
    }

    return undefined;
}
