/**
 * Cache with TTL and force-refresh support.
 * Supports ?refresh=true to bypass cache.
 */

const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value, ttlMs) {
  cache.set(key, { value, timestamp: Date.now(), ttl: ttlMs });
}

function clearCache(key) {
  cache.delete(key);
}

function clearAllCache() {
  cache.clear();
}

// Auto-cleanup every 10 min
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) cache.delete(key);
  }
}, 10 * 60 * 1000);

module.exports = { getCache, setCache, clearCache, clearAllCache };
