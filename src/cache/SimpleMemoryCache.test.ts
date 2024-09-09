import {SimpleMemoryCache} from './SimpleMemoryCache';

jest.useFakeTimers(); // Mocking timers to simulate the TTL expiration behavior


describe('SimpleMemoryCache', () => {
    let cache: SimpleMemoryCache<string>;

    beforeEach(() => {
        cache = new SimpleMemoryCache(1, 2); // TTL set to 1 second, Cleanup Interval set to 2 seconds
    });

    afterEach(() => {
        cache.dispose(); // Ensure cache is disposed after each test
        jest.restoreAllMocks();
    });

    test('should store and retrieve values correctly', () => {
        cache.set('key1', 'value1');
        const result = cache.get('key1');
        expect(result).toBe('value1');
    });

    test('should return undefined for non-existent keys', () => {
        const result = cache.get('nonExistentKey');
        expect(result).toBeUndefined();
    });

    test('should remove expired items based on TTL', () => {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        jest.advanceTimersByTime(2000); // Fast-forward 2 seconds (TTL = 1s)

        expect(cache.get('key1')).toBeUndefined(); // Should be undefined after TTL expiration
    });

    test('should not retrieve expired values', () => {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        jest.advanceTimersByTime(2000); // Fast-forward 2 seconds (TTL = 1s)

        expect(cache.get('key1')).toBeUndefined(); // Should be undefined after TTL
    });

    test('should delete values manually', () => {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        cache.delete('key1');
        expect(cache.get('key1')).toBeUndefined(); // Key should be deleted
    });

    test('should clear all values', () => {
        cache.set('key1', 'value1');
        cache.set('key2', 'value2');
        expect(cache.size()).toBe(2); // Both keys should be in the cache

        cache.clear();
        expect(cache.size()).toBe(0); // ICache should be empty
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.get('key2')).toBeUndefined();
    });

    test('should respect custom TTL for individual items', () => {
        cache.set('key1', 'value1', 2); // Custom TTL of 2 seconds
        expect(cache.get('key1')).toBe('value1');

        jest.advanceTimersByTime(1500); // 1.5 seconds later
        expect(cache.get('key1')).toBe('value1'); // Not yet expired

        jest.advanceTimersByTime(1000); // 2.5 seconds later
        expect(cache.get('key1')).toBeUndefined(); // Should expire after 2 seconds
    });

    test('should handle expired items during cleanup', () => {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        jest.advanceTimersByTime(2000); // TTL = 1 second, key1 should expire after 2 seconds (cleanup)

        expect(cache.get('key1')).toBeUndefined(); // key1 should be undefined after cleanup
    });
});


describe('SimpleMemoryCache dispose functionality', () => {
    let cache: SimpleMemoryCache<string>;

    beforeEach(() => {
        cache = new SimpleMemoryCache(1); // 1 second TTL for easier testing
    });

    test('should throw error when using set after dispose', () => {
        cache.dispose(); // Dispose the cache
        expect(() => cache.set('key1', 'value1')).toThrow('This cache has been disposed and can no longer be used.');
    });

    test('should throw error when using get after dispose', () => {
        cache.dispose(); // Dispose the cache
        expect(() => cache.get('key1')).toThrow('This cache has been disposed and can no longer be used.');
    });

    test('should throw error when using delete after dispose', () => {
        cache.dispose(); // Dispose the cache
        expect(() => cache.delete('key1')).toThrow('This cache has been disposed and can no longer be used.');
    });

    test('should throw error when using clear after dispose', () => {
        cache.dispose(); // Dispose the cache
        expect(() => cache.clear()).toThrow('This cache has been disposed and can no longer be used.');
    });

    test('should throw error when using size after dispose', () => {
        cache.dispose(); // Dispose the cache
        expect(() => cache.size()).toThrow('This cache has been disposed and can no longer be used.');
    });

    test('should not allow multiple dispose calls', () => {
        cache.dispose();
        expect(() => cache.dispose()).toThrow('This cache has already been disposed.');
    });
});