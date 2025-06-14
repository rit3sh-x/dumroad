declare namespace NodeJS {
    interface ProcessEnv {
        PAYLOAD_SECRET: string;
        DATABASE_URI: string;
        NEXT_PUBLIC_APP_URL: string;
        NEXT_PUBLIC_ROOT_DOMAIN: string;
        PAYLOAD_CONFIG_PATH: string;
        STRIPE_SECRET_KEY: string;
        STRIPE_WEBHOOK_KEY: string;
        NEXT_PUBLIC_SUBDOMAIN_ROUTING_ENABLED: string;
        BLOB_READ_WRITE_TOKEN: string;
    }
}