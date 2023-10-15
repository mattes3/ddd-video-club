declare module "express-wolox-logger" {
    type Logger = {
        error: (...args: unknown[]) => void;
        info: (...args: unknown[]) => void;
    };

    export const logger: Logger;
}
