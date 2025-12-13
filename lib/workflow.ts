import { Client } from "@upstash/workflow";
import config from "@/lib/config";

export const workflowClient = new Client({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
});