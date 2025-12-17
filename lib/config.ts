const config = {
    env: {
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,

        databaseUrl: process.env.DATABASE_URL!,
        authSecret: process.env.AUTH_SECRET!,

        upstash:{
            redisRestUrl: process.env.UPSTASH_REDIS_REST_URL!,
            redisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
            qstashUrl: process.env.QSTASH_URL!,
            qstashToken: process.env.QSTASH_TOKEN!,
            qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
            qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
        }
    }
}

export default config;