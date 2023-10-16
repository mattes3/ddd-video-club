// @ValueObject
export type Entry = {
    // no ID because it's a value object
    createdAt: Date;
    updatedAt: Date;

    accountId: string;
    title: string;
    amount: number; // in cents
};

// @Aggregate
export type Account = {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    /**
     * ID of customer who rented the movie.
     */
    customerId: string;

    /**
     * account balance in cents.
     */
    balance: number;

    /**
     * entries in that account.
     */
    entries: Entry[];

    /**
     * Create a new entry for this account – but do not update the balance
     * because this is a query, not a command (in the sense of CQS)!
     *
     * @param title  purpose of the entry, reason for the money flow
     * @param amount how much money
     * @return the entry itself
     */
    createEntry(title: string, amount: number): Entry;

    /**
     * Update the balance of the account (this is a command in the sense of CQS).
     *
     * @param entry the entry that causes the balance to be updated
     */
    updateBalance(entry: Entry): void;
};

// implementation of Account.createEntry()
export const createEntryForAccount = (account: Account) =>
    function (title: string, amount: number): Entry {
        const now = new Date();

        return {
            accountId: account.id,
            title,
            amount,
            createdAt: now,
            updatedAt: now,
        };
    };

// implementation of Account.updateBalance()
export const updateBalanceInAccount = (account: Account) =>
    function (entry: Entry): void {
        account.balance += entry.amount;
    };
