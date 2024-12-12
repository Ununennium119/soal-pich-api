declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: string;
        PORT?: string;
        JWT_SECRET?: string;
        JWT_EXPIRATION?: string;
        DB_HOST?: string;
        DB_PORT?: string;
        DB_DATABASE?: string;
        DB_USERNAME?: string;
        DB_PASSWORD?: string;
        DB_SYNC?: string;
        DB_LOGGING?: string;
    }
}
