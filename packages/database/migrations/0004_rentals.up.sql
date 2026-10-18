CREATE TABLE dddvc.rentals (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT rentals_pkey PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    customer_id uuid NOT NULL,
    movie_id uuid NOT NULL,
    movie_category_name text NOT NULL,
    movie_title text NOT NULL,
    rental_start timestamptz NOT NULL,
    rental_days integer NOT NULL
);

CREATE OR REPLACE FUNCTION dddvc.trigger_set_rentals_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON dddvc.rentals
    FOR EACH ROW
EXECUTE PROCEDURE dddvc.trigger_set_rentals_updated_at();
