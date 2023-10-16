import type { TransactionProvider } from '@ddd-video-club-v2/database';
import type { EventBus } from '@ddd-video-club-v2/event-bus';
import { MOVIE_RENTED, type MovieRentedEvent } from '@ddd-video-club-v2/event-types';
import type { Rental } from './Rental';
import type { CreateRentalData, RentalRepository } from './RentalRepository';
import type { RentalViewingReadModel } from './RentalReadModelTypes';

export type RentMovieCommand = {
    customerId: string;
    movieId: string;
    movieCategoryName: string;
    movieTitle: string;
    startOfRental: Date;
    endOfRental: Date;
};

// @ApplicationService
export interface RentalAppService {
    rentMovie(command: RentMovieCommand): Promise<string>;
    viewRental(rentalId: string): Promise<RentalViewingReadModel | undefined>;
}

// @Factory
function buildEntityFromCommand(command: RentMovieCommand): CreateRentalData {
    const { customerId, movieCategoryName, movieId, movieTitle, startOfRental, endOfRental } =
        command;

    const timeDifference = endOfRental.getTime() - startOfRental.getTime();
    const rentalDays = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));

    return {
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
    repo,
    transact,
    eventBus,
}: {
    repo: RentalRepository;
    transact: TransactionProvider;
    eventBus: EventBus;
}): RentalAppService {
    return {
        async rentMovie(command) {
            const rental = await transact(async (trx) =>
                repo.createRental(trx, buildEntityFromCommand(command)),
            );

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
            return transact(async (trx) =>
                repo.getRentalById(trx, rentalId).then(buildViewingReadModel),
            );
        },
    };
}
