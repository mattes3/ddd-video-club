import {
    fromRow,
    fromRowOrUndefined,
    toSnakeCase,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { Rental } from '../../domainmodel/Rental';
import type { RentalRepository } from '../../domainmodel/RentalRepository';

export const RentalRepositoryImpl = withTransactionFor<RentalRepository>((tx) => ({
    async createRental(rentalInput) {
        const [row] = await tx`INSERT INTO dddvc.rentals ${tx(toSnakeCase(rentalInput))} RETURNING *`;
        return fromRow<Rental>(row);
    },

    async findRentals() {
        const rows = await tx`SELECT * FROM dddvc.rentals`;
        return rows.map((row: Record<string, unknown>) => fromRow<Rental>(row));
    },

    async getRentalById(rentalId) {
        const [row] = await tx`SELECT * FROM dddvc.rentals WHERE id = ${rentalId}`;
        return fromRowOrUndefined<Rental>(row);
    },
}));
