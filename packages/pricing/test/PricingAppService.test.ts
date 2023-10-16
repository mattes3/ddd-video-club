import type { TransactionProvider } from '@ddd-video-club-v2/database';
import type { Transaction } from 'objection';

import type { EventBus } from '@ddd-video-club-v2/event-bus';
import type { MovieRentedEvent } from '@ddd-video-club-v2/event-types';

import type { DiscountCampaign } from '../src/domainmodel/DiscountCampaign';
import type { DiscountCampaignRepository } from '../src/domainmodel/DiscountCampaignRepository';
import { getPricingAppService } from '../src/domainmodel/PricingAppService';
import { PricingServiceImpl } from '../src/domainmodel/PricingService';

/**
 * This shows how dependency injection keeps everything testable
 * via mock objects.
 */
describe('Price calculation for a movie rental', () => {
	it('should discount SF movies by 20%', async () => {
		const PRICE_PER_DAY = 350;
		const DAYS_RENTED = 5;
		const DISCOUNT_PERCENT = 20;

		const testEvent1: MovieRentedEvent = {
			customerId: 'customer1234',
			daysRented: DAYS_RENTED,
			movieCategoryName: 'Science Fiction',
			movieId: 'movie1234',
			movieTitle: 'Matrix',
			rentalId: 'rental1234',
			startOfRentalPeriod: new Date(),
		};

		const mockEventBus: EventBus = {
			async sendEvent(eventTypeName, payload) {
				expect(payload.price).toBe(350 * DAYS_RENTED * ((100 - DISCOUNT_PERCENT) / 100));
			},
			async consumeEvents(eventTypeName, callback) {
				await callback(testEvent1);
			},
		};

		const mockRepo: DiscountCampaignRepository = {
			async createDiscountCampaign(trx, discountCampaignInput) {
				throw new Error('should not be called');
			},

			async findDiscountCampaignsByMovieCategoryAndDate(
				trx,
				movieCategoryName,
				startOfRentalPeriod,
			) {
				const result: DiscountCampaign[] = [
					{
						campaignTitle: 'Test campaign',
						createdAt: new Date(),
						movieCategoryName: 'Science Fiction',
						id: 'campaign1234',
						percentage: DISCOUNT_PERCENT,
						startingFrom: new Date(),
						updatedAt: new Date(),
						validThru: new Date(Date.now() + 10000),
					},
				];
				return result;
			},

			async getDiscountCampaignById(trx, discountCampaignId) {
				throw new Error('should not be called');
			},
		};

		const mockTransact: TransactionProvider = async function (callback) {
			return callback({} as Transaction);
		};

		const pricingAppService = getPricingAppService({
			eventBus: mockEventBus,
			pricingService: PricingServiceImpl,
			repo: mockRepo,
			transact: mockTransact,
		});

		await pricingAppService.consumeMovieRented();
	});
});
