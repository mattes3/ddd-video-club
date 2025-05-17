import { Model, type Transaction } from 'objection';

export type TransactionProvider = <T>(callback: (trx: Transaction) => Promise<T>) => Promise<T>;

export type TransactionOnRepoProvider<RepositoryType> = <T>(
    callback: (trx: RepositoryType) => Promise<T>,
) => Promise<T>;

export const withTransactionFor =
    <R>(createRepository: (trx: Transaction) => R): TransactionOnRepoProvider<R> =>
    async <T>(work: (repo: R) => Promise<T>): Promise<T> =>
        Model.transaction(async (trx) => work(createRepository(trx)));
