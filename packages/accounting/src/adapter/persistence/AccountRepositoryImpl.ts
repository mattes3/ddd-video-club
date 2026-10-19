import {
    fromRow,
    isUuid,
    toSnakeCase,
    toUpsertColumns,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { Account, Entry } from '../../domainmodel/Account';
import { createEntryForAccount, updateBalanceInAccount } from '../../domainmodel/Account';
import type { AccountRepository } from '../../domainmodel/AccountRepository';

type Row = Record<string, unknown>;

function hydrateAccount(row: Row, entries: Entry[] = []): Account {
    const account = fromRow<Account>(row);
    account.entries = entries;
    account.createEntry = createEntryForAccount(account);
    account.updateBalance = updateBalanceInAccount(account);
    return account;
}

export const AccountRepositoryImpl = withTransactionFor<AccountRepository>((tx) => ({
    async addEntryToAccount(entry) {
        const [row] = await tx`
            INSERT INTO dddvc.account_entries ${tx(toSnakeCase(entry))} RETURNING *`;
        return fromRow<Entry>(row);
    },

    async getAccountByCustomerId(customerId) {
        if (!isUuid(customerId)) {
            return undefined;
        }
        const [row] = await tx`SELECT * FROM dddvc.accounts WHERE customer_id = ${customerId}`;
        if (!row) {
            return undefined;
        }
        const entryRows = await tx`
            SELECT * FROM dddvc.account_entries WHERE account_id = ${row.id}
            ORDER BY created_at`;
        return hydrateAccount(
            row,
            entryRows.map((entryRow: Row) => fromRow<Entry>(entryRow)),
        );
    },

    async add(account) {
        const { entries: _entries, ...ownFields } = account;
        await tx`
            INSERT INTO dddvc.accounts ${tx(toSnakeCase(ownFields))}
            ON CONFLICT (id) DO UPDATE SET ${tx(toUpsertColumns(ownFields))}`;
    },

    async remove(account) {
        await tx`DELETE FROM dddvc.accounts WHERE id = ${account.id}`;
    },

    async findAccounts() {
        const rows = await tx`SELECT * FROM dddvc.accounts`;
        return rows.map((row: Row) => hydrateAccount(row));
    },

    async getAccountById(accountId) {
        if (!isUuid(accountId)) {
            return undefined;
        }
        const [row] = await tx`SELECT * FROM dddvc.accounts WHERE id = ${accountId}`;
        return row ? hydrateAccount(row) : undefined;
    },
}));
