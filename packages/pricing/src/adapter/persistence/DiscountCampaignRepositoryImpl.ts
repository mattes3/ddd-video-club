import {
    fromRow,
    fromRowOrUndefined,
    toSnakeCase,
    toUpsertColumns,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { DiscountCampaign } from '../../domainmodel/DiscountCampaign';
import type { DiscountCampaignRepository } from '../../domainmodel/DiscountCampaignRepository';

export const DiscountCampaignRepositoryImpl = withTransactionFor<DiscountCampaignRepository>(
    (tx) => ({
        async add(discountCampaign) {
            await tx`
                INSERT INTO dddvc.discount_campaigns ${tx(toSnakeCase(discountCampaign))}
                ON CONFLICT (id) DO UPDATE SET ${tx(toUpsertColumns(discountCampaign))}`;
        },

        async remove(discountCampaign) {
            await tx`DELETE FROM dddvc.discount_campaigns WHERE id = ${discountCampaign.id}`;
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
