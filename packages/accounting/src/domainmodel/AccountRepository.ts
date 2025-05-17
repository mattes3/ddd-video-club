import type { Account, Entry } from './Account';

export type CreateAccountData = Omit<
    Account,
    'id' | 'createdAt' | 'updatedAt' | 'entries' | 'createEntry' | 'updateBalance'
>;
export type UpdateAccountData = Partial<
    Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'entries' | 'createEntry' | 'updateBalance'>
>;

// @Repository
export interface AccountRepository {
    createAccount(accountInput: CreateAccountData): Promise<Account>;

    addEntryToAccount(entry: Entry): Promise<Entry>;

    updateAccount(accountId: string, accountInput: UpdateAccountData): Promise<Account>;

    findAccounts(): Promise<Account[]>;

    getAccountById(accountId: string): Promise<Account | undefined>;
    getAccountByCustomerId(customerId: string): Promise<Account | undefined>;
}
