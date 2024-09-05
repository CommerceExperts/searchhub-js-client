export interface ICache {
    /**
     * Stores a key-value pair in the cache.
     *
     * @param {string} key - The key to store the value under.
     * @param {any} value - The value to store.
     */
    set(key: string, value: any): void;

    /**
     * Retrieves a value from the cache by its key.
     * If the item has expired, it will be removed and undefined is returned.
     *
     * @param {string} key - The key to retrieve the value for.
     * @returns {any | undefined} - The value if it exists and is not expired, or undefined if not found or expired.
     */
    get(key: string): any | undefined;

    /**
     * Deletes a key-value pair from the cache.
     *
     * @param {string} key - The key to remove from the cache.
     */
    delete(key: string): void;

    /**
     * Clears all items from the cache.
     */
    clear(): void;

    /**
     * Returns the number of items currently stored in the cache.
     *
     * @returns {number} - The number of items in the cache.
     */
    size(): number;

    /**
     * Disposes of the cache by stopping the cleanup process and clearing all items from the cache.
     * This method should be called when the cache is no longer needed.
     */
    dispose(): void;
}
