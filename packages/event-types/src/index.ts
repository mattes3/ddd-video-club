export const MOVIE_RENTED = 'MOVIE_RENTED';
export type MovieRentedEvent = {
	rentalId: string;
	movieId: string;
	movieCategoryName: string;
	movieTitle: string;
	customerId: string;
	startOfRentalPeriod: Date;
	daysRented: number;
};

export const MOVIE_RENTAL_PRICED = 'MOVIE_RENTAL_PRICED';
export type MovieRentalPricedEvent = {
	rentalId: string;
	movieId: string;
	movieCategoryName: string;
	movieTitle: string;
	customerId: string;
	startOfRentalPeriod: Date;
	daysRented: number;
	price: number;
};
