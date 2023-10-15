// @Entity
export type Movie = {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    /**
     * What the movie is named
     */
    title: string;

    /**
     * Contents and actors
     */
    description: string;

    /**
     * URL of the poster image (artwork)
     */
    posterUrl: string;

    /**
     * URL of the video itself
     */
    videoUrl: string;

    /**
     * When the movie hit the cinemas
     */
    publicationDate: Date;

    /**
     * Category, e.g. "Science Fiction", "Romance", "Action", ...
     */
    categoryName: string;
};
