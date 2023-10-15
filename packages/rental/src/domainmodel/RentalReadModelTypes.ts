// @ReadModel
// @ValueObject
export type RentalViewingReadModel = {
    id: string;

    customerId: string;
    movieId: string;
    movieCategoryName: string;
    movieTitle: string;
    rentalStart: Date;
    rentalDays: number;
};
