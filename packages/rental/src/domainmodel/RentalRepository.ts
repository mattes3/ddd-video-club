import type { Rental } from './Rental';
import type { Transaction } from 'objection';

export type CreateRentalData = Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRentalData = Partial<Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>>;

// @Repository
export interface RentalRepository {
    createRental(rentalInput: CreateRentalData): Promise<Rental>;
    findRentals(): Promise<Rental[]>;
    getRentalById(rentalId: string): Promise<Rental | undefined>;
}
