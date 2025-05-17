import { withTransactionFor } from '@ddd-video-club-v2/database';
import { Model } from 'objection';

import type { Movie } from '../../domainmodel/Movie';
import type { MovieRepository } from '../../domainmodel/MovieRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MovieModel extends Movie {}

class MovieModel extends Model {
    static get tableName() {
        return 'dddvc.movies';
    }

    static get idColumn() {
        return 'id';
    }
}

export const MovieRepositoryImpl = withTransactionFor<MovieRepository>((trx) => ({
    async createMovie(movieInput) {
        return MovieModel.query(trx).insert(movieInput).returning('*');
    },

    async findMovies() {
        return MovieModel.query(trx);
    },

    async getMovieById(movieId) {
        return MovieModel.query(trx).findById(movieId);
    },

    async updateMovie(movieId, movieInput) {
        return MovieModel.query(trx).updateAndFetchById(movieId, movieInput);
    },

    async deleteMovie(movieId) {
        return MovieModel.query(trx).deleteById(movieId);
    },
}));
