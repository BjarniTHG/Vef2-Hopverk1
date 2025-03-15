import { Context, Next } from 'hono';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (limit: number = 100, windowMs: number = 60000) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    store[ip].count++;
    
    c.header('X-RateLimit-Limit', limit.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, limit - store[ip].count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(store[ip].resetTime / 1000).toString());
    
    if (store[ip].count > limit) {
      return c.json({ error: 'Rate limit exceeded. Try again later.' }, 429);
    }
    
    await next();
  };
};
