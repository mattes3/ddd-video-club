import axios from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { MovieViewingReadModel } from '@ddd-video-club-v2/movies';
import { Master } from './Master';

const MOVIE_VIEWING_QUERY = (movieId: string | undefined) => [
    'movie-viewing',
    { movieId: String(movieId) },
];

export const MovieViewing: React.FC = () => {
    const { movieId } = useParams();

    const { isLoading, data: movie } = useQuery(MOVIE_VIEWING_QUERY(movieId), async () =>
        axios.get<MovieViewingReadModel>(`/api/movies/${movieId}`).then(({ data }) => data),
    );

    return (
        <Master title={movie?.title ?? ''}>
            {!isLoading && movie && (
                <div className="max-w-[960px]">
                    <p className="leading-8">{movie.description}</p>
                    <div className="mt-2 w-full rounded-lg shadow-lg">
                        <div className="aspect-h-9 aspect-w-16">
                            <iframe
                                className="rounded-md"
                                src={movie.videoUrl}
                                title={movie.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </Master>
    );
};
