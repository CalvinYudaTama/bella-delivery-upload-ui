// Image cache management utility
interface ImageCacheItem {
  loaded: boolean;
  base64?: string;
  timestamp: number;
}

class ImageCacheManager {
  private cache = new Map<string, ImageCacheItem>();
  private maxAge = 20 * 60 * 1000; // 20 minutes
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Regular cleanup of expired cache
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Clean up every minute
  }

  // Set cache item
  set(key: string, loaded: boolean, base64?: string): void {
    this.cache.set(key, {
      loaded,
      base64,
      timestamp: Date.now()
    });
  }

  // Get cache item
  get(key: string): ImageCacheItem | undefined {
    return this.cache.get(key);
  }

  // Check if image is loaded
  isLoaded(key: string): boolean {
    const item = this.cache.get(key);
    return item?.loaded || false;
  }

  // Check if exists
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Clean up expired cache
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  // Manually clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): { size: number; maxAge: number } {
    return {
      size: this.cache.size,
      maxAge: this.maxAge
    };
  }

  // Destroy cleanup timer
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Export singleton instance
export const imageCache = new ImageCacheManager();

// Clean up when page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    imageCache.destroy();
  });
} 