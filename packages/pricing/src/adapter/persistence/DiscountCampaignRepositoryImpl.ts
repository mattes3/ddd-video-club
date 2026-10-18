import {
    fromRow,
    fromRowOrUndefined,
    toSnakeCase,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { DiscountCampaign } from '../../domainmodel/DiscountCampaign';
import type { DiscountCampaignRepository } from '../../domainmodel/DiscountCampaignRepository';

export const DiscountCampaignRepositoryImpl = withTransactionFor<DiscountCampaignRepository>(
    (tx) => ({
        async createDiscountCampaign(discountCampaignInput) {
            const [row] = await tx`
                INSERT INTO dddvc.discount_campaigns ${tx(toSnakeCase(discountCampaignInput))}
                RETURNING *`;
            return fromRow<DiscountCampaign>(row);
        },

        async findDiscountCampaignsByMovieCategoryAndDate(movieCategoryName, startOfRentalPeriod) {
            const rows = await tx`
                SELECT * FROM dddvc.discount_campaigns
                WHERE movie_category_name = ${movieCategoryName}
                  AND starting_from <= ${startOfRentalPeriod}
                  AND valid_thru >= ${startOfRentalPeriod}`;
            return rows.map((row: Record<string, unknown>) => fromRow<DiscountCampaign>(row));
        },

        async getDiscountCampaignById(discountCampaignId) {
            const [row] = await tx`
                SELECT * FROM dddvc.discount_campaigns WHERE id = ${discountCampaignId}`;
            return fromRowOrUndefined<DiscountCampaign>(row);
        },
    }),
);
