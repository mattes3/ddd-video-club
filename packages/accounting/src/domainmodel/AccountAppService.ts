import { type TransactionOnRepoProvider } from '@ddd-video-club-v2/database';
import type { EventBus } from '@ddd-video-club-v2/event-bus';
import { MOVIE_RENTAL_PRICED, type MovieRentalPricedEvent } from '@ddd-video-club-v2/event-types';
import type { Transaction } from 'objection';

import type { Account } from './Account';
import { buildOverviewReadModel, type AccountOverviewReadModel } from './AccountOverviewReadModel';
import type { AccountRepository } from './AccountRepository';

// @ReadModel
export type AccountViewingReadModel = Omit<
    Account,
    'createdAt' | 'updatedAt' | 'createEntry' | 'updateBalance'
>;

// @ApplicationService
export interface AccountAppService {
    /**
     * Create a new account for a given customer.
     *
     * @param customerId the customer's ID
     * @return the created account
     */
    createAccount(customerId: string): Promise<Account>;

    /**
     * Add an entry to an account and update the balance. Only for tests.
     *
     * @param accountId    ID of the account to which the entry shall be added
     * @param creationDate date when the entry was created
     * @param title        purpose of the entry, reason for the money flow
     * @param amount       how much money
     */
    enter(accountId: string, title: string, amount: number): Promise<void>;

    /**
     * Gives an overview about the account an its entries
     *
     * @param customerId ID of the customer to whom that account belongs
     * @return the account and the entries within it
     */
    accountOverviewForCustomer(customerId: string): Promise<AccountOverviewReadModel | undefined>;

    /**
     * Find an account with a certain ID. Only for tests.
     *
     * @param accountId ID of the account
     * @return the account found
     */
    findAccount(accountId: string): Promise<Account | undefined>;

    /**
     * Consume MovieRentalPriced events.
     */
    consumeMovieRentalPriced(): Promise<void>;
}

/**
 * Inject the necessary dependencies and return a fully usable application service.
 */
export function getAccountAppService({
    transact,
    eventBus,
}: {
    transact: TransactionOnRepoProvider<AccountRepository>;
    eventBus: EventBus;
}): AccountAppService {
    return {
        async consumeMovieRentalPriced() {
            await eventBus.consumeEvents(
                MOVIE_RENTAL_PRICED,
                async (movieRentalPriced: MovieRentalPricedEvent) => {
                    await transact(async (repo) => {
                        const account = await repo.getAccountByCustomerId(
                            movieRentalPriced.customerId,
                        );
                        if (!account) {
                            return;
                        }

                        const { movieTitle, movieCategoryName, daysRented } = movieRentalPriced;

                        const title = `${movieTitle} (${movieCategoryName}), ${daysRented} days`;
                        return internalCreateEntry(repo, account, title, -movieRentalPriced.price);
                    });
                },
            );
        },

        async accountOverviewForCustomer(customerId) {
            return transact(async (repo) =>
                repo.getAccountByCustomerId(customerId).then(buildOverviewReadModel),
            );
        },

        async createAccount(customerId) {
            return transact(async (repo) => repo.createAccount({ customerId, balance: 0 }));
        },

        async findAccount(accountId) {
            return transact(async (repo) => repo.getAccountById(accountId));
        },

        async enter(accountId, title, amount) {
            return transact(async (repo) => {
                const account = await repo.getAccountById(accountId);
                if (!account) {
                    throw new Error('invalid accountId');
                }

                let entry = account.createEntry(title, amount);
                entry = await repo.addEntryToAccount(entry);

                account.updateBalance(entry);
                await repo.updateAccount(account.id, { balance: account.balance });
            });
        },
    };

    async function internalCreateEntry(
        repo: AccountRepository,
        account: Account,
        title: string,
        amount: number,
    ) {
        let entry = account.createEntry(title, amount);
        entry = await repo.addEntryToAccount(entry);

        account.updateBalance(entry);
        await repo.updateAccount(account.id, { balance: account.balance });
    }
}
