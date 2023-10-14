import type { Rental } from './Rental';
import type { Transaction } from 'objection';

export type CreateRentalData = Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRentalData = Partial<Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>>;

// @Repository
export interface RentalRepository {
	createRental(trx: Transaction, rentalInput: CreateRentalData): Promise<Rental>;
	findRentals(trx: Transaction): Promise<Rental[]>;
	getRentalById(trx: Transaction, rentalId: string): Promise<Rental | undefined>;
}
