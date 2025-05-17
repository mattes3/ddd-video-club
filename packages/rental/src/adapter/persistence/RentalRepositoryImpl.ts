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

export const RentalRepositoryImpl: RentalRepository = {
    async createRental(trx, rentalInput) {
        return RentalModel.query(trx).insert(rentalInput).returning('*');
    },

    async findRentals(trx) {
        return RentalModel.query(trx);
    },

    async getRentalById(trx, rentalId) {
        return RentalModel.query(trx).findById(rentalId);
    },
};
