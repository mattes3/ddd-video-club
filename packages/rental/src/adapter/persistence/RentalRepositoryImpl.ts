import {
    fromRow,
    fromRowOrUndefined,
    toSnakeCase,
    toUpsertColumns,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { Rental } from '../../domainmodel/Rental';
import type { RentalRepository } from '../../domainmodel/RentalRepository';

export const RentalRepositoryImpl = withTransactionFor<RentalRepository>((tx) => ({
    async add(rental) {
        await tx`
            INSERT INTO dddvc.rentals ${tx(toSnakeCase(rental))}
            ON CONFLICT (id) DO UPDATE SET ${tx(toUpsertColumns(rental))}`;
    },

    async remove(rental) {
        await tx`DELETE FROM dddvc.rentals WHERE id = ${rental.id}`;
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
