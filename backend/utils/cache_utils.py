import time

class InMemoryCache:
    def __init__(self, default_ttl=3600):
        self.cache = {}
        self.default_ttl = default_ttl

    def get(self, key):
        if key in self.cache:
            value, expiry = self.cache[key]
            if time.time() < expiry:
                print(f"Cache HIT: {key}")
                return value
            else:
                print(f"Cache EXPIRED: {key}")
                del self.cache[key]
        return None

    def set(self, key, value, ttl=None):
        ttl = ttl or self.default_ttl
        expiry = time.time() + ttl
        self.cache[key] = (value, expiry)
        print(f"Cache SET: {key} (TTL: {ttl}s)")

# Global cache instance
app_cache = InMemoryCache()
