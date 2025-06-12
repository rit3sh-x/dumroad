declare namespace NodeJS {
    interface ProcessEnv {
        PAYLOAD_SECRET: string;
        DATABASE_URI: string;
        NEXT_PUBLIC_APP_URL: string;
        PAYLOAD_CONFIG_PATH: string;
        STRIPE_SECRET_KEY: string;
        STRIPE_WEBHOOK_KEY: string;
    }
}