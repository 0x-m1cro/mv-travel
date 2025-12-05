interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class LiteApiCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton cache instance
export const liteApiCache = new LiteApiCache();

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SEARCH: 5 * 60 * 1000, // 5 minutes
  AVAILABILITY: 2 * 60 * 1000, // 2 minutes (availability changes frequently)
  HOTEL_DETAILS: 30 * 60 * 1000, // 30 minutes
  STATIC_DATA: 60 * 60 * 1000, // 1 hour
};
