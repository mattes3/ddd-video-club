import type { SQL } from 'bun';

import { getSql } from './initPersistence';

/**
 * The SQL handle that repositories use inside a transaction.
 */
export type Tx = SQL;

export type TransactionOnRepoProvider<RepositoryType> = <T>(
    work: (trx: RepositoryType) => Promise<T>,
) => Promise<T>;

export const withTransactionFor =
    <R>(createRepository: (tx: Tx) => R): TransactionOnRepoProvider<R> =>
    async (work) =>
        getSql().begin(async (tx) => work(createRepository(tx)));
