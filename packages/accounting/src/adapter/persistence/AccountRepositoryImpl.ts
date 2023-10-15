import { Model } from 'objection';
import type { Account, Entry } from '../../domainmodel/Account';
import { createEntryForAccount, updateBalanceInAccount } from '../../domainmodel/Account';
import type { AccountRepository } from '../../domainmodel/AccountRepository';

interface AccountModel extends Account {}
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

export const AccountRepositoryImpl: AccountRepository = {
	async addEntryToAccount(trx, entry) {
		return EntryModel.query(trx).insert(entry).returning('*').debug();
	},

	async getAccountByCustomerId(trx, customerId) {
		return AccountModel.query(trx).findOne({ customerId }).withGraphFetched('entries').debug();
	},

	async updateAccount(trx, accountId, accountInput) {
		return AccountModel.query(trx).updateAndFetchById(accountId, accountInput).debug();
	},

	async createAccount(trx, accountInput) {
		return AccountModel.query(trx).insert(accountInput).returning('*').debug();
	},

	async findAccounts(trx) {
		return AccountModel.query(trx).debug();
	},

	async getAccountById(trx, accountId) {
		return AccountModel.query(trx).findById(accountId).debug();
	},
};
