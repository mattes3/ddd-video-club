import {
    fromRow,
    fromRowOrUndefined,
    toSnakeCase,
    withTransactionFor,
} from '@ddd-video-club-v2/database';

import type { Movie } from '../../domainmodel/Movie';
import type { MovieRepository } from '../../domainmodel/MovieRepository';

export const MovieRepositoryImpl = withTransactionFor<MovieRepository>((tx) => ({
    async createMovie(movieInput) {
        const [row] = await tx`INSERT INTO dddvc.movies ${tx(toSnakeCase(movieInput))} RETURNING *`;
        return fromRow<Movie>(row);
    },

    async findMovies() {
        const rows = await tx`SELECT * FROM dddvc.movies`;
        return rows.map((row: Record<string, unknown>) => fromRow<Movie>(row));
    },

    async getMovieById(movieId) {
        const [row] = await tx`SELECT * FROM dddvc.movies WHERE id = ${movieId}`;
        return fromRowOrUndefined<Movie>(row);
    },

    async updateMovie(movieId, movieInput) {
        const [row] = await tx`
            UPDATE dddvc.movies SET ${tx(toSnakeCase(movieInput))}
            WHERE id = ${movieId} RETURNING *`;
        return fromRow<Movie>(row);
    },

    async deleteMovie(movieId) {
        const rows = await tx`DELETE FROM dddvc.movies WHERE id = ${movieId} RETURNING id`;
        return rows.length;
    },
}));
