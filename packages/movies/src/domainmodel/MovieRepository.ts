import type { Movie } from './Movie';
import type { Transaction } from 'objection';

export type CreateMovieData = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMovieData = Partial<Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>>;

// @Repository
export interface MovieRepository {
	createMovie(trx: Transaction, movieInput: CreateMovieData): Promise<Movie>;

	findMovies(trx: Transaction): Promise<Movie[]>;

	getMovieById(trx: Transaction, movieId: string): Promise<Movie | undefined>;

	updateMovie(trx: Transaction, movieId: string, movieInput: UpdateMovieData): Promise<Movie>;

	deleteMovie(trx: Transaction, movieId: string): Promise<number | undefined>;
}
