import type { DiscountCampaign } from './DiscountCampaign';

export type CreateDiscountCampaignData = Omit<DiscountCampaign, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDiscountCampaignData = Partial<
    Omit<DiscountCampaign, 'id' | 'createdAt' | 'updatedAt'>
>;

// @Repository
export interface DiscountCampaignRepository {
    createDiscountCampaign(
        discountCampaignInput: CreateDiscountCampaignData,
    ): Promise<DiscountCampaign>;

    findDiscountCampaignsByMovieCategoryAndDate(
        movieCategoryName: string,
        startOfRentalPeriod: Date,
    ): Promise<DiscountCampaign[]>;

    getDiscountCampaignById(discountCampaignId: string): Promise<DiscountCampaign | undefined>;
}
