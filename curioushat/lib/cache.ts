/** Simple in-memory TTL cache (no Redis dependency). */
const store = new Map<string, { data: string; expiresAt: number }>()

export const cache = {
  get(key: string): string | null {
    const entry = store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      store.delete(key)
      return null
    }
    return entry.data
  },

  set(key: string, value: string, ttlSeconds = 3600) {
    store.set(key, { data: value, expiresAt: Date.now() + ttlSeconds * 1000 })
  },

  /** Evict expired entries (called periodically). */
  prune() {
    const now = Date.now()
    store.forEach((v, k) => {
      if (now > v.expiresAt) store.delete(k)
    })
  },
}

// Auto-prune every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => cache.prune(), 600_000)
}
