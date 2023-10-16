import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MovieSelection } from './MovieSelection';
import { MovieViewing } from './MovieViewing';
import { MyAccount } from './MyAccount';

import './index.css';

const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root')!);

root.render(
    <div>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/movie-selection" />} />
                    <Route path="/movie-selection" element={<MovieSelection />} />
                    <Route path="/movie/:movieId/viewing" element={<MovieViewing />} />
                    <Route path="/account" element={<MyAccount />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </div>,
);
