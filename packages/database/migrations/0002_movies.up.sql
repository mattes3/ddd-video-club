CREATE TABLE dddvc.movies (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT movies_pkey PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    category_name text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    poster_url text NOT NULL,
    video_url text NOT NULL
);

CREATE OR REPLACE FUNCTION dddvc.trigger_set_movies_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON dddvc.movies
    FOR EACH ROW
EXECUTE PROCEDURE dddvc.trigger_set_movies_updated_at();

INSERT INTO dddvc.movies (id, category_name, title, description, poster_url, video_url) VALUES ('2596c2c6-58da-4066-befc-7c17b9a1cafe', 'Science Fiction', 'Matrix', 'The hacker Neo is contacted via the Internet by a mysterious underground organization. The head of the group - the wanted terrorist Morpheus - inaugurates him into a horrible secret: The reality, as we experience it, is only an illusory world. In truth, humans have long been ruled by a sinister virtual power - the "Matrix" whose agents are already targeting Neo ...', '/images/matrix.jpeg', 'https://www.youtube.com/embed/gDadfh0ZdBM');
INSERT INTO dddvc.movies (id, category_name, title, description, poster_url, video_url) VALUES ('b66a6306-076b-430b-a8d0-ce5255f4c3f8', 'Romance', 'Notting Hill', 'William Thacker is the owner of a bookstore in the heart of London''s trendy Notting Hill district. One day, by chance, the world''s most famous actress walks into his shop. Speechless, he stares after her and is convinced that he will never see her again. But fate has other plans - because only minutes later, William and Anna collide on the Portobello Road, the fairy tale begins ...', '/images/notting-hill.jpeg', 'https://www.youtube.com/embed/hZ8PfLIc8MI');
INSERT INTO dddvc.movies (id, category_name, title, description, poster_url, video_url) VALUES ('ece79e3c-2079-4173-b59d-f2d27e6cabb3', 'Action', 'The Bourne Identity', 'When CIA agent Jason Bourne is fished half-dead out of the sea with two bullets in his back and a laser implant under his skin, he realizes that he has completely lost his memory. After several attacks on his life, he soon realizes that he must come to terms with his true origins in order to survive. For yet he does not suspect that he is in the middle of the crosshairs of his own organization ...', '/images/bourne-identity.jpeg', 'https://www.youtube.com/embed/HSckms_rfwY');
