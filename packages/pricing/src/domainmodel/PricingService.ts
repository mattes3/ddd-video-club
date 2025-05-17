import type { DiscountCampaign } from './DiscountCampaign';

// @DomainService
export type PricingService = {
    calculateMovieRentalPrice(daysRented: number, discountCampaigns: DiscountCampaign[]): number;
};

export const PricingServiceImpl: PricingService = {
    calculateMovieRentalPrice(daysRented, discountCampaigns) {
        const CENTS_PER_DAY = 350;

        return Math.floor(
            discountCampaigns.reduce(
                (acc, campaign) => acc * (1.0 - campaign.percentage / 100),
                daysRented * CENTS_PER_DAY,
            ),
        );
    },
};
