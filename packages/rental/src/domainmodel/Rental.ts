// @Entity
export type Rental = {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    /**
     * ID of customer who rented the movie.
     */
    customerId: string;

    /**
     * ID of the rented movie.
     */
    movieId: string;

    /**
     * category of the rented movie.
     */
    movieCategoryName: string;

    /**
     * title of the rented movie.
     */
    movieTitle: string;

    /**
     * date on which the user rented the movie.
     */
    rentalStart: Date;

    /**
     * number of days the user wanted to keep the movie.
     */
    rentalDays: number;
};
