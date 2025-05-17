import { withTransactionFor } from '@ddd-video-club-v2/database';
import { Model } from 'objection';

import type { Account, Entry } from '../../domainmodel/Account';
import { createEntryForAccount, updateBalanceInAccount } from '../../domainmodel/Account';
import type { AccountRepository } from '../../domainmodel/AccountRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AccountModel extends Account {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EntryModel extends Entry {}

class EntryModel extends Model {
    static get tableName() {
        return 'dddvc.account_entries';
    }
}

class AccountModel extends Model {
    static get tableName() {
        return 'dddvc.accounts';
    }

    static get idColumn() {
        return 'id';
    }

    static relationMappings = {
        entries: {
            relation: Model.HasManyRelation,
            modelClass: EntryModel,
            join: {
                from: 'dddvc.accounts.id',
                to: 'dddvc.account_entries.accountId',
            },
        },
    };

    constructor() {
        super();
        this.createEntry = createEntryForAccount(this);
        this.updateBalance = updateBalanceInAccount(this);
    }
}

export const AccountRepositoryImpl = withTransactionFor<AccountRepository>((trx) => ({
    async addEntryToAccount(entry) {
        return EntryModel.query(trx).insert(entry).returning('*');
    },

    async getAccountByCustomerId(customerId) {
        return AccountModel.query(trx).findOne({ customerId }).withGraphFetched('entries');
    },

    async updateAccount(accountId, accountInput) {
        return AccountModel.query(trx).updateAndFetchById(accountId, accountInput);
    },

    async createAccount(accountInput) {
        return AccountModel.query(trx).insert(accountInput).returning('*');
    },

    async findAccounts() {
        return AccountModel.query(trx);
    },

    async getAccountById(accountId) {
        return AccountModel.query(trx).findById(accountId);
    },
}));
