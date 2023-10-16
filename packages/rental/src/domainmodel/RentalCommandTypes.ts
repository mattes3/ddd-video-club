// @Command
// @ValueObject
export type RentMovieCommand = {
    customerId: string;
    movieId: string;
    movieCategoryName: string;
    movieTitle: string;
    startOfRental: Date;
    endOfRental: Date;
};
