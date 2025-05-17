import { withTransactionFor } from '@ddd-video-club-v2/database';
import { Model } from 'objection';

import type { DiscountCampaign } from '../../domainmodel/DiscountCampaign';
import type { DiscountCampaignRepository } from '../../domainmodel/DiscountCampaignRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DiscountCampaignModel extends DiscountCampaign {}

class DiscountCampaignModel extends Model {
    static get tableName() {
        return 'dddvc.discount_campaigns';
    }

    static get idColumn() {
        return 'id';
    }
}

export const DiscountCampaignRepositoryImpl = withTransactionFor<DiscountCampaignRepository>(
    (trx) => ({
        async createDiscountCampaign(discountCampaignInput) {
            return DiscountCampaignModel.query(trx).insert(discountCampaignInput).returning('*');
        },

        async findDiscountCampaignsByMovieCategoryAndDate(movieCategoryName, startOfRentalPeriod) {
            return DiscountCampaignModel.query(trx)
                .where({
                    movieCategoryName,
                })
                .andWhere('startingFrom', '<=', startOfRentalPeriod)
                .andWhere('validThru', '>=', startOfRentalPeriod);
        },

        async getDiscountCampaignById(discountCampaignId) {
            return DiscountCampaignModel.query(trx).findById(discountCampaignId);
        },
    }),
);
