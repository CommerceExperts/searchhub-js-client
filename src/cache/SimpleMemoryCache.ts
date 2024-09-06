import {ICache} from "./ICache";

interface CacheItem<T> {
    value: T;
    expiresAt: number; // The timestamp when the item should expire
}

/**
 * InMemoryCache provides an in-memory key-value store with a TTL (Time-To-Live)
 * for each entry and an optional periodic cleanup process to remove expired items.
 *
 * @class
 */
export class SimpleMemoryCache<T> implements ICache<T> {
    private cache: Map<string, CacheItem<T>>;
    private readonly defaultTTL: number; // TTL in milliseconds
    private cleanupInterval: NodeJS.Timeout | null = null;
    private isDisposed: boolean = false;
    private isCleaningUp: boolean = false; // Lock to ensure only one cleanup process runs at a time
    private readonly cleanupIntervalTime: number; // Time between cleanups in milliseconds

    /**
     * Creates an instance of InMemoryCache.
     *
     * @param {number} defaultTTLInSeconds - The default time-to-live (TTL) for cache items in seconds.
     * @param {number} [cleanupIntervalInSeconds=60] - Optional. Time interval for cleaning up expired items in seconds. Defaults to 60 seconds.
     */
    constructor(defaultTTLInSeconds: number, cleanupIntervalInSeconds: number = 60) {
        this.cache = new Map();
        this.defaultTTL = defaultTTLInSeconds * 1000; // Convert TTL to milliseconds
        this.cleanupIntervalTime = cleanupIntervalInSeconds * 1000; // Convert cleanup interval to milliseconds

        // Automatically start the cleanup process
        this.startCleanupProcess();
    }

    /**
     * Stores a key-value pair in the cache with an optional custom TTL.
     *
     * @param {string} key - The key to store the value under.
     * @param {any} value - The value to store.
     * @param {number} [customTTLInSeconds] - Optional. A custom TTL for the specific item in seconds.
     */
    set(key: string, value: T, customTTLInSeconds?: number): void {
        this.ensureNotDisposed(); // Check if the cache is disposed

        const ttl = customTTLInSeconds ? customTTLInSeconds * 1000 : this.defaultTTL;
        const expiresAt = Date.now() + ttl;

        const item: CacheItem<T> = {
            value,
            expiresAt,
        };

        this.cache.set(key, item);
    }

    /**
     * Retrieves a value from the cache by its key.
     * If the item has expired, it will be removed and undefined is returned.
     *
     * @param {string} key - The key to retrieve the value for.
     * @returns {any | undefined} - The value if it exists and is not expired, or undefined if not found or expired.
     */
    get(key: string): T | undefined {
        this.ensureNotDisposed(); // Check if the cache is disposed

        const item = this.cache.get(key);

        if (!item) {
            return undefined;
        }

        // Check if the item is expired and remove it if so
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    /**
     * Deletes a key-value pair from the cache.
     *
     * @param {string} key - The key to remove from the cache.
     */
    delete(key: string): void {
        this.ensureNotDisposed(); // Check if the cache is disposed
        this.cache.delete(key);
    }

    /**
     * Clears all items from the cache.
     */
    clear(): void {
        this.ensureNotDisposed(); // Check if the cache is disposed
        this.cache.clear();
    }

    /**
     * Returns the number of items currently stored in the cache.
     *
     * @returns {number} - The number of items in the cache.
     */
    size(): number {
        this.ensureNotDisposed(); // Check if the cache is disposed
        return this.cache.size;
    }

    /**
     * Disposes of the cache by stopping the cleanup process and clearing all items from the cache.
     * This method should be called when the cache is no longer needed.
     */
    dispose(): void {
        if (this.isDisposed) {
            throw new Error('This cache has already been disposed.');
        }

        this.clear();

        if (this.cleanupInterval) {
            clearTimeout(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.isDisposed = true;
    }

    /**
     * Ensures the cache is not disposed before performing any operations.
     * Throws an error if the cache has been disposed.
     */
    private ensureNotDisposed(): void {
        if (this.isDisposed) {
            throw new Error('This cache has been disposed and can no longer be used.');
        }
    }

    /**
     * Starts the periodic cleanup process to remove expired items.
     * This function ensures that only one cleanup process runs at a time.
     */
    private startCleanupProcess(): void {
        if (this.cleanupInterval || this.isCleaningUp) {
            return;
        }

        const cleanup = async () => {
            if (this.isDisposed || this.isCleaningUp) return;

            this.isCleaningUp = true; // Lock the cleanup

            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now > item.expiresAt) {
                    await new Promise((resolve) => setTimeout(() => {
                        this.cache.delete(key);
                        resolve(null);
                    }, 0)); // Defer the deletion to make it non-blocking
                }
            }

            this.isCleaningUp = false; // Unlock after cleanup

            if (!this.isDisposed) {
                this.cleanupInterval = setTimeout(cleanup, this.cleanupIntervalTime); // Reschedule after configured interval
            }
        };

        // Start the cleanup process
        this.cleanupInterval = setTimeout(cleanup, this.cleanupIntervalTime);
    }
}
