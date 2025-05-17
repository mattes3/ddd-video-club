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

export const DiscountCampaignRepositoryImpl: DiscountCampaignRepository = {
    async createDiscountCampaign(trx, discountCampaignInput) {
        return DiscountCampaignModel.query(trx).insert(discountCampaignInput).returning('*');
    },

    async findDiscountCampaignsByMovieCategoryAndDate(trx, movieCategoryName, startOfRentalPeriod) {
        return DiscountCampaignModel.query(trx)
            .where({
                movieCategoryName,
            })
            .andWhere('startingFrom', '<=', startOfRentalPeriod)
            .andWhere('validThru', '>=', startOfRentalPeriod);
    },

    async getDiscountCampaignById(trx, discountCampaignId) {
        return DiscountCampaignModel.query(trx).findById(discountCampaignId);
    },
};
