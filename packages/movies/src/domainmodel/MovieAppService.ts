import type { MovieRepository } from './MovieRepository';
import type { TransactionProvider } from './TransactionProvider';
import type { Movie } from './Movie';

// @ApplicationService
export interface MovieAppService {
    movies(): Promise<Movie[]>;
    findMovie(movieId: string): Promise<Movie | undefined>;
}

export function getMovieAppService(
    repo: MovieRepository,
    transact: TransactionProvider,
): MovieAppService {
    return {
        async movies() {
            return transact(async (trx) => repo.findMovies(trx));
        },

        async findMovie(movieId) {
            return transact(async (trx) => repo.getMovieById(trx, movieId));
        },
    };
}
