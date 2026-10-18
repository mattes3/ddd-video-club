CREATE TABLE dddvc.discount_campaigns (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT discount_campaigns_pkey PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    campaign_title text NOT NULL,
    starting_from timestamptz NOT NULL,
    valid_thru timestamptz NOT NULL,
    movie_category_name text NOT NULL,
    percentage integer NOT NULL
);

CREATE OR REPLACE FUNCTION dddvc.trigger_set_discount_campaigns_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON dddvc.discount_campaigns
    FOR EACH ROW
EXECUTE PROCEDURE dddvc.trigger_set_discount_campaigns_updated_at();
