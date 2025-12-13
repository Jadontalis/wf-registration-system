import {Redis} from "@upstash/redis";
import config from "@/lib/config";

const redis = new Redis({
    url: config.env.upstash.redisRestUrl,
    token: config.env.upstash.redisRestToken,
});

export default redis;