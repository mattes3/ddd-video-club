const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Our primary keys are uuid columns, and PostgreSQL rejects a malformed uuid with an error.
 * Repositories check IDs with this first, so that a bad ID means "not found", not a crash.
 */
export function isUuid(value: unknown): value is string {
    return typeof value === 'string' && UUID_PATTERN.test(value);
}
