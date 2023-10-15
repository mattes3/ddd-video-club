import type { TransactionProvider } from '@ddd-video-club-v2/database';
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
    repo,
    transact,
    eventBus,
}: {
    repo: AccountRepository;
    transact: TransactionProvider;
    eventBus: EventBus;
}): AccountAppService {
    return {
        async consumeMovieRentalPriced() {
            await eventBus.consumeEvents(
                MOVIE_RENTAL_PRICED,
                async (movieRentalPriced: MovieRentalPricedEvent) => {
                    await transact(async (trx) => {
                        const account = await repo.getAccountByCustomerId(
                            trx,
                            movieRentalPriced.customerId,
                        );
                        if (!account) {
                            return;
                        }

                        const { movieTitle, movieCategoryName, daysRented } = movieRentalPriced;

                        const title = `${movieTitle} (${movieCategoryName}), ${daysRented} days`;
                        return internalCreateEntry(trx, account, title, -movieRentalPriced.price);
                    });
                },
            );
        },

        async accountOverviewForCustomer(customerId) {
            return transact(async (trx) =>
                repo.getAccountByCustomerId(trx, customerId).then(buildOverviewReadModel),
            );
        },

        async createAccount(customerId) {
            return transact(async (trx) => repo.createAccount(trx, { customerId, balance: 0 }));
        },

        async findAccount(accountId) {
            return transact(async (trx) => repo.getAccountById(trx, accountId));
        },

        async enter(accountId, title, amount) {
            return transact(async (trx) => {
                const account = await repo.getAccountById(trx, accountId);
                if (!account) {
                    throw new Error('invalid accountId');
                }

                let entry = account.createEntry(title, amount);
                entry = await repo.addEntryToAccount(trx, entry);

                account.updateBalance(entry);
                await repo.updateAccount(trx, account.id, { balance: account.balance });
            });
        },
    };

    async function internalCreateEntry(
        trx: Transaction,
        account: Account,
        title: string,
        amount: number,
    ) {
        let entry = account.createEntry(title, amount);
        entry = await repo.addEntryToAccount(trx, entry);

        account.updateBalance(entry);
        await repo.updateAccount(trx, account.id, { balance: account.balance });
    }
}
