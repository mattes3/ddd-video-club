const camelToSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const snakeToCamel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

/**
 * Converts the keys of a domain object to snake_case column names
 * and drops properties that are undefined or functions.
 */
export function toSnakeCase(obj: object): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([, value]) => value !== undefined && typeof value !== 'function')
            .map(([key, value]) => [camelToSnake(key), value]),
    );
}

/**
 * Converts the snake_case columns of a database row to camelCase properties.
 */
export function fromRow<T>(row: Record<string, unknown>): T {
    return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [snakeToCamel(key), value]),
    ) as T;
}

export function fromRowOrUndefined<T>(row: Record<string, unknown> | undefined): T | undefined {
    return row ? fromRow<T>(row) : undefined;
}
