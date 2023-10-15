import type { DiscountCampaign } from './DiscountCampaign';
import type { Transaction } from 'objection';

export type CreateDiscountCampaignData = Omit<DiscountCampaign, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDiscountCampaignData = Partial<
	Omit<DiscountCampaign, 'id' | 'createdAt' | 'updatedAt'>
>;

// @Repository
export interface DiscountCampaignRepository {
	createDiscountCampaign(
		trx: Transaction,
		discountCampaignInput: CreateDiscountCampaignData,
	): Promise<DiscountCampaign>;

	findDiscountCampaignsByMovieCategoryAndDate(
		trx: Transaction,
		movieCategoryName: string,
		startOfRentalPeriod: Date,
	): Promise<DiscountCampaign[]>;

	getDiscountCampaignById(
		trx: Transaction,
		discountCampaignId: string,
	): Promise<DiscountCampaign | undefined>;
}
