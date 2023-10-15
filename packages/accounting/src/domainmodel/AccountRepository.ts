import type { Account, Entry } from './Account';
import type { Transaction } from 'objection';

export type CreateAccountData = Omit<
	Account,
	'id' | 'createdAt' | 'updatedAt' | 'entries' | 'createEntry' | 'updateBalance'
>;
export type UpdateAccountData = Partial<
	Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'entries' | 'createEntry' | 'updateBalance'>
>;

// @Repository
export interface AccountRepository {
	createAccount(trx: Transaction, accountInput: CreateAccountData): Promise<Account>;

	addEntryToAccount(trx: Transaction, entry: Entry): Promise<Entry>;

	updateAccount(
		trx: Transaction,
		accountId: string,
		accountInput: UpdateAccountData,
	): Promise<Account>;

	findAccounts(trx: Transaction): Promise<Account[]>;

	getAccountById(trx: Transaction, accountId: string): Promise<Account | undefined>;
	getAccountByCustomerId(trx: Transaction, customerId: string): Promise<Account | undefined>;
}
