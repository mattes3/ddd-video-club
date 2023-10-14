import { Model } from "objection";
import type { Movie } from "../../domainmodel/Movie";
import type { MovieRepository } from "../../domainmodel/MovieRepository";

interface MovieModel extends Movie {}

class MovieModel extends Model {
	static get tableName() {
		return "dddvc.movies";
	}

	static get idColumn() {
		return "id";
	}
}

export const MovieRepositoryImpl: MovieRepository = {
	async createMovie(trx, movieInput) {
		return MovieModel.query(trx).insert(movieInput).returning("*");
	},

	async findMovies(trx) {
		return MovieModel.query(trx);
	},

	async getMovieById(trx, movieId) {
		return MovieModel.query(trx).findById(movieId);
	},

	async updateMovie(trx, movieId, movieInput) {
		return MovieModel.query(trx).updateAndFetchById(movieId, movieInput);
	},

	async deleteMovie(trx, movieId) {
		return MovieModel.query(trx).deleteById(movieId);
	},
};
