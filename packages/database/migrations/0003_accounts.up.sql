CREATE TABLE dddvc.accounts (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT accounts_pkey PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    customer_id uuid NOT NULL,
    balance integer NOT NULL
);

CREATE OR REPLACE FUNCTION dddvc.trigger_set_accounts_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON dddvc.accounts
    FOR EACH ROW
EXECUTE PROCEDURE dddvc.trigger_set_accounts_updated_at();

INSERT INTO dddvc.accounts (id, customer_id, balance)
VALUES ('7489141D-8F58-4AEC-A4E6-96EAE9DFF4A0', '11111111-1111-1111-1111-111111111111', 0);

CREATE TABLE dddvc.account_entries (
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    account_id uuid NOT NULL REFERENCES dddvc.accounts (id) ON DELETE CASCADE,
    title text NOT NULL,
    amount integer NOT NULL
);

CREATE OR REPLACE FUNCTION dddvc.trigger_set_account_entries_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON dddvc.account_entries
    FOR EACH ROW
EXECUTE PROCEDURE dddvc.trigger_set_account_entries_updated_at();
