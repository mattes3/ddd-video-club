import type { Transaction } from "objection";

export type TransactionProvider = <T>(
	callback: (trx: Transaction) => Promise<T>,
) => Promise<T>;
