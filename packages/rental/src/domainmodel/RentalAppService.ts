import { randomUUID } from 'node:crypto';

import type { EventBus } from '@ddd-video-club-v2/event-bus';
import { MOVIE_RENTED, type MovieRentedEvent } from '@ddd-video-club-v2/event-types';
import type { TransactionOnRepoProvider } from '@ddd-video-club-v2/database';
import type { Rental } from './Rental';
import type { RentMovieCommand } from './RentalCommandTypes';
import type { RentalRepository } from './RentalRepository';
import type { RentalViewingReadModel } from './RentalReadModelTypes';

export type { RentMovieCommand };

// @ApplicationService
export interface RentalAppService {
    rentMovie(command: RentMovieCommand): Promise<string>;
    viewRental(rentalId: string): Promise<RentalViewingReadModel | undefined>;
}

// @Factory
function buildEntityFromCommand(command: RentMovieCommand): Rental {
    const { customerId, movieCategoryName, movieId, movieTitle, startOfRental, endOfRental } =
        command;

    const timeDifference = endOfRental.getTime() - startOfRental.getTime();
    const rentalDays = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));

    const now = new Date();

    return {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        customerId,
        movieCategoryName,
        movieId,
        movieTitle,
        rentalStart: startOfRental,
        rentalDays,
    };
}

// @Factory
function buildViewingReadModel(rental: Rental | undefined): RentalViewingReadModel | undefined {
    if (!rental) {
        return undefined;
    }

    const { id, customerId, movieCategoryName, movieTitle, movieId, rentalDays, rentalStart } =
        rental;

    return { id, customerId, movieId, movieTitle, movieCategoryName, rentalStart, rentalDays };
}

/**
 * Inject the necessary dependencies and return a fully usable application service.
 */
export function getRentalAppService({
    transact,
    eventBus,
}: {
    transact: TransactionOnRepoProvider<RentalRepository>;
    eventBus: EventBus;
}): RentalAppService {
    return {
        async rentMovie(command) {
            const rental = buildEntityFromCommand(command);
            await transact(async (repo) => repo.add(rental));

            const event: MovieRentedEvent = {
                rentalId: rental.id,
                movieId: rental.movieId,
                movieCategoryName: rental.movieCategoryName,
                movieTitle: rental.movieTitle,
                customerId: rental.customerId,
                startOfRentalPeriod: rental.rentalStart,
                daysRented: rental.rentalDays,
            };

            await eventBus.sendEvent(MOVIE_RENTED, event);

            return rental.id;
        },

        async viewRental(rentalId) {
            return transact(async (repo) =>
                repo.getRentalById(rentalId).then(buildViewingReadModel),
            );
        },
    };
}
