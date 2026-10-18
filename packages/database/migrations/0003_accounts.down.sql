DROP TRIGGER set_updated_at ON dddvc.account_entries;
DROP FUNCTION dddvc.trigger_set_account_entries_updated_at;
DROP TABLE dddvc.account_entries;

DROP TRIGGER set_updated_at ON dddvc.accounts;
DROP FUNCTION dddvc.trigger_set_accounts_updated_at;
DROP TABLE dddvc.accounts;
