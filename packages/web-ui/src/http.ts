import { getLogger } from '@logtape/logtape';
import type { MiddlewareHandler } from 'hono';

// There is no login yet, so every request acts on behalf of this customer.
export const CURRENT_CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';

// Same headers as the `nocache` npm package that we used with Express.
export function nocache(): MiddlewareHandler {
    return async (c, next) => {
        await next();
        c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        c.header('Pragma', 'no-cache');
        c.header('Expires', '0');
        c.header('Surrogate-Control', 'no-store');
    };
}

// Writes the same access log line as our former morgan configuration.
export function accessLog(category: string): MiddlewareHandler {
    const logger = getLogger([category, 'access']);

    return async (c, next) => {
        const start = performance.now();
        await next();
        const ms = (performance.now() - start).toFixed(3);
        const length = c.res.headers.get('content-length') ?? '-';
        logger.info(
            `ACCESS ${c.req.method} ${c.req.path}  ${c.res.status}  ${ms} ms - ${length}`,
        );
    };
}
