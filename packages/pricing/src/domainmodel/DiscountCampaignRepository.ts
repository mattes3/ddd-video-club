import type { DiscountCampaign } from './DiscountCampaign';

// @Repository
export interface DiscountCampaignRepository {
    /**
     * Idempotent: adds the campaign, or overwrites the stored state if one with that ID exists.
     */
    add(discountCampaign: DiscountCampaign): Promise<void>;

    /**
     * Idempotent: removes the campaign, does nothing if it is not there.
     */
    remove(discountCampaign: DiscountCampaign): Promise<void>;

    findDiscountCampaignsByMovieCategoryAndDate(
        movieCategoryName: string,
        startOfRentalPeriod: Date,
    ): Promise<DiscountCampaign[]>;

    getDiscountCampaignById(discountCampaignId: string): Promise<DiscountCampaign | undefined>;
}
