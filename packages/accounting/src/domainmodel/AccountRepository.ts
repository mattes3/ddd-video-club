import type { Account, Entry } from './Account';

// @Repository
export interface AccountRepository {
    /**
     * Idempotent: adds the account, or overwrites the stored state if an account with that ID
     * exists. Persists the account's own fields only, not its entries (see addEntryToAccount).
     */
    add(account: Account): Promise<void>;

    /**
     * Idempotent: removes the account (and its entries), does nothing if it is not there.
     */
    remove(account: Account): Promise<void>;

    addEntryToAccount(entry: Entry): Promise<Entry>;

    findAccounts(): Promise<Account[]>;

    getAccountById(accountId: string): Promise<Account | undefined>;
    getAccountByCustomerId(customerId: string): Promise<Account | undefined>;
}
