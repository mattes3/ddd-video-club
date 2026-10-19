import {
    fromRow,
    fromRowOrUndefined,
    isUuid,
    toSnakeCase,
    toUpsertColumns,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { Movie } from '../../domainmodel/Movie';
import type { MovieRepository } from '../../domainmodel/MovieRepository';

export const MovieRepositoryImpl = withTransactionFor<MovieRepository>((tx) => ({
    async add(movie) {
        await tx`
            INSERT INTO dddvc.movies ${tx(toSnakeCase(movie))}
            ON CONFLICT (id) DO UPDATE SET ${tx(toUpsertColumns(movie))}`;
    },

    async remove(movie) {
        await tx`DELETE FROM dddvc.movies WHERE id = ${movie.id}`;
    },

    async findMovies() {
        const rows = await tx`SELECT * FROM dddvc.movies`;
        return rows.map((row: Record<string, unknown>) => fromRow<Movie>(row));
    },

    async getMovieById(movieId) {
        if (!isUuid(movieId)) {
            return undefined;
        }
        const [row] = await tx`SELECT * FROM dddvc.movies WHERE id = ${movieId}`;
        return fromRowOrUndefined<Movie>(row);
    },
}));
