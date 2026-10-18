import type { Rental } from './Rental';

// @Repository
export interface RentalRepository {
    /**
     * Idempotent: adds the rental, or overwrites the stored state if a rental with that ID exists.
     */
    add(rental: Rental): Promise<void>;

    /**
     * Idempotent: removes the rental, does nothing if it is not there.
     */
    remove(rental: Rental): Promise<void>;

    findRentals(): Promise<Rental[]>;

    getRentalById(rentalId: string): Promise<Rental | undefined>;
}
