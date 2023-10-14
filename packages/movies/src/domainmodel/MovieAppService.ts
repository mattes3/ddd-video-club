import type { MovieRepository } from './MovieRepository';
import type { TransactionProvider } from './TransactionProvider';
import type { Movie } from './Movie';

// @ReadModel
export type MovieSelectionReadModel = {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    publicationDate: Date;
    category: string;
};

// @ReadModel
export type MovieViewingReadModel = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    publicationDate: Date;
    category: string;
};

// @Factory
function buildSelectionReadModels(movies: Movie[]): MovieSelectionReadModel[] {
    return movies.map(({ id, title, description, posterUrl, publicationDate, category }) => ({
        id,
        title,
        description,
        posterUrl,
        publicationDate,
        category,
    }));
}

// @Factory
function buildViewingReadModel(movie: Movie | undefined): MovieViewingReadModel | undefined {
    if (!movie) {
        return undefined;
    }

    const { id, title, description, videoUrl, publicationDate, category } = movie;
    return { id, title, description, videoUrl, publicationDate, category };
}

// @ApplicationService
export interface MovieAppService {
    movies(): Promise<MovieSelectionReadModel[]>;
    findMovie(movieId: string): Promise<MovieViewingReadModel | undefined>;
}

/**
 * Inject the necessary dependencies and return a fully usable application service.
 */
export function getMovieAppService(
    repo: MovieRepository,
    transact: TransactionProvider,
): MovieAppService {
    return {
        async movies() {
            return transact(async (trx) => repo.findMovies(trx).then(buildSelectionReadModels));
        },

        async findMovie(movieId) {
            return transact(async (trx) =>
                repo.getMovieById(trx, movieId).then(buildViewingReadModel),
            );
        },
    };
}
