/**
 * Simple in-memory cache with TTL (time-to-live).
 * Vercel serverless functions reuse instances for a period,
 * so in-memory cache works across requests on the same instance.
 */

const cache = new Map();

/**
 * Get cached data if not expired.
 * @param {string} key
 * @returns {*} cached value or null
 */
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Set cache entry with TTL.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs - Time to live in milliseconds
 */
function setCache(key, value, ttlMs) {
  cache.set(key, {
    value,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

/**
 * Clear expired entries (call periodically to free memory).
 */
function clearExpired() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(clearExpired, 10 * 60 * 1000);

module.exports = { getCache, setCache, clearExpired };
