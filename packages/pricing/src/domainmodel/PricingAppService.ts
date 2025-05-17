import type { TransactionOnRepoProvider } from '@ddd-video-club-v2/database';
import type { EventBus } from '@ddd-video-club-v2/event-bus';

import {
    MOVIE_RENTAL_PRICED,
    MOVIE_RENTED,
    type MovieRentalPricedEvent,
    type MovieRentedEvent,
} from '@ddd-video-club-v2/event-types';
import type { DiscountCampaignRepository } from './DiscountCampaignRepository';
import type { PricingService } from './PricingService';

// @ApplicationService
export interface PricingAppService {
    consumeMovieRented(): Promise<void>;
}

/**
 * Inject the necessary dependencies and return a fully usable application service.
 */
export function getPricingAppService({
    transact,
    eventBus,
    pricingService,
}: {
    transact: TransactionOnRepoProvider<DiscountCampaignRepository>;
    eventBus: EventBus;
    pricingService: PricingService;
}): PricingAppService {
    return {
        async consumeMovieRented() {
            await eventBus.consumeEvents(MOVIE_RENTED, async (movieRented: MovieRentedEvent) => {
                const campaignsForMovieCategory = await transact(async (repo) =>
                    repo.findDiscountCampaignsByMovieCategoryAndDate(
                        movieRented.movieCategoryName,
                        movieRented.startOfRentalPeriod,
                    ),
                );

                const price = pricingService.calculateMovieRentalPrice(
                    movieRented.daysRented,
                    campaignsForMovieCategory,
                );

                const movieRentalPriced: MovieRentalPricedEvent = {
                    rentalId: movieRented.rentalId,
                    movieId: movieRented.movieId,
                    customerId: movieRented.customerId,

                    movieCategoryName: movieRented.movieCategoryName,
                    movieTitle: movieRented.movieTitle,

                    daysRented: movieRented.daysRented,
                    startOfRentalPeriod: movieRented.startOfRentalPeriod,

                    price,
                };

                await eventBus.sendEvent(MOVIE_RENTAL_PRICED, movieRentalPriced);
            });
        },
    };
}
