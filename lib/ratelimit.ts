import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
 
// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
 
// Use a constant string to limit all requests with a single ratelimit
// Or use a userID, apiKey or ip address for individual limits.
export async function checkRateLimit() {
  const identifier = "api";
  const { success } = await ratelimit.limit(identifier);
 
  if (!success) {
    return "Unable to process at this time";
  }
  doExpensiveCalculation();
  return "Here you go!";
}

function doExpensiveCalculation() {
    throw new Error("Function not implemented.");
}
