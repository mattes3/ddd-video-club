import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { MovieSelectionReadModel } from '@ddd-video-club-v2/movies';
import type { RentMovieCommand, RentalViewingReadModel } from '@ddd-video-club-v2/rental';

import { Master } from './Master';
import { MovieRentalDialog } from './MovieRentalDialog';

type MovieRentalDialogState = {
    movie: MovieSelectionReadModel | undefined;
    dialogIsOpen: boolean;
};

const emptyDialogState = {
    movie: undefined,
    dialogIsOpen: false,
};

const MOVIE_SELECTION_QUERY = ['movie-viewing'];

export const MovieSelection: React.FC = (props) => {
    const navigate = useNavigate();

    const { isLoading, data: movies } = useQuery(MOVIE_SELECTION_QUERY, async () =>
        axios.get<MovieSelectionReadModel[]>(`/api/movies`).then(({ data }) => data),
    );

    const [movieRentalDialogState, setMovieRentalDialogState] =
        useState<MovieRentalDialogState>(emptyDialogState);

    async function rentMovie(endOfRental: Date) {
        const { movie } = movieRentalDialogState;

        if (!movie) {
            return;
        }

        try {
            const DUMMY_CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';
            const request: RentMovieCommand = {
                customerId: DUMMY_CUSTOMER_ID,
                movieId: movie.id,
                movieCategoryName: movie.categoryName,
                movieTitle: movie.title,
                startOfRental: new Date(),
                endOfRental,
            };

            const response = await axios.post('/api/rentals', request);

            if (response.status !== 201 /* created */) {
                throw new Error(response.statusText);
            }

            const rental = await axios
                .get<RentalViewingReadModel>(response.headers.location as string)
                .then(({ data }) => data);

            navigate(`/movie/${rental.movieId}/viewing`);
        } catch (error) {
            console.log('request failed', error);
        }
    }

    return (
        <Master title="Which movie would you like to watch?">
            <div className="mt-6 grid grid-cols-3 gap-12">
                {!isLoading &&
                    movies &&
                    movies.map((movie) => {
                        return (
                            <div key={'Movie-poster-' + movie.id}>
                                <p className="text-sm">
                                    <strong>{movie.title}</strong> ({movie.categoryName})
                                </p>
                                <div className="mt-2 relative">
                                    <div className="absolute bottom-0 bg-black opacity-40">
                                        <p className="text-sm text-white p-4">
                                            {movie.description}
                                        </p>
                                    </div>
                                    <img alt={movie.title} src={movie.posterUrl} />
                                </div>
                                <div>
                                    <button
                                        className="mt-4 btn-primary"
                                        onClick={() => {
                                            setMovieRentalDialogState({
                                                movie,
                                                dialogIsOpen: true,
                                            });
                                        }}
                                    >
                                        Rent now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                {movieRentalDialogState.movie && (
                    <MovieRentalDialog
                        title={movieRentalDialogState.movie.title}
                        open={movieRentalDialogState.dialogIsOpen}
                        onMovieRental={async (endOfRental) => {
                            await rentMovie(endOfRental);
                            setMovieRentalDialogState(emptyDialogState);
                        }}
                        onClose={() => {
                            setMovieRentalDialogState(emptyDialogState);
                        }}
                    />
                )}
            </div>
        </Master>
    );
};
