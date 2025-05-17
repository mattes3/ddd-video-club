import { Model, type Transaction } from 'objection';

export type TransactionOnRepoProvider<RepositoryType> = <T>(
    work: (trx: RepositoryType) => Promise<T>,
) => Promise<T>;

export const withTransactionFor =
    <R>(createRepository: (trx: Transaction) => R): TransactionOnRepoProvider<R> =>
    async (work) =>
        Model.transaction(async (trx) => work(createRepository(trx)));
