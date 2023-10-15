import type { Account } from './Account';

// @ValueObject
export type EntryData = {
    createdAt: Date;
    title: string;
    amount: number;
};

// @ReadModel
// @ValueObject
export type AccountOverviewReadModel = {
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
    entries: EntryData[];
};

// @Factory
export function buildOverviewReadModel(
    account: Account | undefined,
): AccountOverviewReadModel | undefined {
    if (!account) {
        return undefined;
    }

    const { id, createdAt, updatedAt, customerId, balance } = account;

    return {
        id,
        createdAt,
        updatedAt,
        customerId,
        balance,
        entries: account.entries.map(({ createdAt, title, amount }) => ({
            createdAt,
            title,
            amount,
        })),
    };
}
