import type { Movie } from './Movie';

export type CreateMovieData = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMovieData = Partial<Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>>;

// @Repository
export interface MovieRepository {
    createMovie(movieInput: CreateMovieData): Promise<Movie>;

    findMovies(): Promise<Movie[]>;

    getMovieById(movieId: string): Promise<Movie | undefined>;

    updateMovie(movieId: string, movieInput: UpdateMovieData): Promise<Movie>;

    deleteMovie(movieId: string): Promise<number | undefined>;
}
