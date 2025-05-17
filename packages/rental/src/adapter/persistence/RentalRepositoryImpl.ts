import { withTransactionFor } from '@ddd-video-club-v2/database';
import { Model } from 'objection';

import type { Rental } from '../../domainmodel/Rental';
import type { RentalRepository } from '../../domainmodel/RentalRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RentalModel extends Rental {}

class RentalModel extends Model {
    static get tableName() {
        return 'dddvc.rentals';
    }

    static get idColumn() {
        return 'id';
    }
}

export const RentalRepositoryImpl = withTransactionFor<RentalRepository>((trx) => ({
    async createRental(rentalInput) {
        return RentalModel.query(trx).insert(rentalInput).returning('*');
    },

    async findRentals() {
        return RentalModel.query(trx);
    },

    async getRentalById(rentalId) {
        return RentalModel.query(trx).findById(rentalId);
    },
}));
