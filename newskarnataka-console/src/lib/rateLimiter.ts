/**
 * Client-side rate limiter to prevent excessive API calls
 * This is a basic implementation. For production, use server-side rate limiting
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

interface RequestLog {
  timestamp: number;
}

class RateLimiter {
  private requests: Map<string, RequestLog[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 15 * 60 * 1000 }) {
    this.config = config;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    let requests = this.requests.get(key) || [];

    // Filter out old requests outside the window
    requests = requests.filter((req) => req.timestamp > windowStart);

    // Update the map
    this.requests.set(key, requests);

    // Check if we've exceeded the limit
    if (requests.length >= this.config.maxRequests) {
      return false;
    }

    // Add this request
    requests.push({ timestamp: now });
    this.requests.set(key, requests);

    return true;
  }

  /**
   * Get remaining requests for key
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const requests = this.requests.get(key) || [];
    const activeRequests = requests.filter((req) => req.timestamp > windowStart);

    return Math.max(0, this.config.maxRequests - activeRequests.length);
  }

  /**
   * Get time until next request is allowed (in milliseconds)
   */
  getResetTime(key: string): number {
    const requests = this.requests.get(key);

    if (!requests || requests.length === 0) {
      return 0;
    }

    const oldestRequest = requests[0];
    const resetTime = oldestRequest.timestamp + this.config.windowMs;
    const now = Date.now();

    return Math.max(0, resetTime - now);
  }

  /**
   * Reset all requests
   */
  reset(): void {
    this.requests.clear();
  }

  /**
   * Reset specific key
   */
  resetKey(key: string): void {
    this.requests.delete(key);
  }
}

// Export singleton instances for different endpoints
export const apiLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 100 requests per 15 minutes
});

export const authLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 login attempts per 15 minutes
});

export const submitLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 submissions per minute
});

/**
 * Check if API request is allowed
 */
export const checkRateLimit = (
  limiter: RateLimiter,
  key: string
): { allowed: boolean; remaining: number; resetTimeMs: number } => {
  const allowed = limiter.isAllowed(key);
  const remaining = limiter.getRemaining(key);
  const resetTimeMs = limiter.getResetTime(key);

  return { allowed, remaining, resetTimeMs };
};

/**
 * Format reset time for display
 */
export const formatResetTime = (resetTimeMs: number): string => {
  if (resetTimeMs === 0) {
    return 'immediately';
  }

  const seconds = Math.ceil(resetTimeMs / 1000);

  if (seconds < 60) {
    return `in ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};
