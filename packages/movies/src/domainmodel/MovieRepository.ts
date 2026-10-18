import type { Movie } from './Movie';

// @Repository
export interface MovieRepository {
    /**
     * Idempotent: adds the movie, or overwrites the stored state if a movie with that ID exists.
     */
    add(movie: Movie): Promise<void>;

    /**
     * Idempotent: removes the movie, does nothing if it is not there.
     */
    remove(movie: Movie): Promise<void>;

    findMovies(): Promise<Movie[]>;

    getMovieById(movieId: string): Promise<Movie | undefined>;
}
