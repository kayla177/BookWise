import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import redis from "@/database/redis";

const ratelimit = new Ratelimit({
  // sets the Redis instance used to store and track API requests(Redis stores the request count per user/IP for rate limiting).
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  // tracks rate limit usage and statistics
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
