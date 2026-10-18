import type { Context } from 'hono';
import type { RentMovieCommand } from '../../domainmodel/RentalAppService';

// Reads a JSON body (API clients) or a form body (HTML forms).
export async function readBody(c: Context): Promise<Record<string, any>> {
    const contentType = c.req.header('content-type') ?? '';
    return contentType.includes('application/json') ? await c.req.json() : await c.req.parseBody();
}

export function validateRentMovieCommand(
    requestBody: Record<string, any>,
): RentMovieCommand | undefined {
    const { customerId, movieId, movieCategoryName, movieTitle, startOfRental, endOfRental } =
        requestBody;

    if (customerId && movieId && movieCategoryName && movieTitle && startOfRental && endOfRental) {
        const command = {
            customerId,
            movieId,
            movieCategoryName,
            movieTitle,
            startOfRental: new Date(startOfRental as string),
            endOfRental: new Date(endOfRental as string),
        };

        if (!isNaN(command.startOfRental.getTime()) && !isNaN(command.endOfRental.getTime())) {
            return command;
        }
    }

    return undefined;
}
