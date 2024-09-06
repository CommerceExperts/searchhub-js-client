import { Request, Response } from 'express';
import { CookieOptions } from 'express-serve-static-core';
import { ICache as ICache$1 } from 'src/cache/ICache';

declare const SEARCH_COLLECTOR_SESSION_COOKIE_NAME = "SearchCollectorSession";
declare const setBrowserCookie: (name: string, value: string, ttlMinutes?: number) => string;
declare const getBrowserCookie: (cname: string) => string | "";
declare class BrowserCookieAccess implements CookieAccess {
    setCookie(name: string, value: string): void;
    getCookie(name: string): string;
}
declare class ExpressCookieAccess implements CookieAccess {
    private readonly request;
    private readonly response;
    /**
     * without this store the cookie wont be available after using setCookie
     * @private
     */
    private readonly cookieStore;
    constructor(request: Request, response: Response);
    setCookie(name: string, value: string): void;
    getCookieOptions(): CookieOptions;
    getCookie(name: string): string;
}
interface CookieAccess {
    setCookie(name: string, value: string): void;
    getCookie(name: string): string;
}

declare enum AbTestSegment {
    SEARCHHUB = "SH",
    CONTROL = "C"
}
/**
 * Generates randomly a segment
 */
declare const generateRandomSegment: () => AbTestSegment;
interface AbTestSegmentManagerConfig {
    cookieAccess: CookieAccess;
    abTestCookieName?: string;
    searchHubSegmentName?: string;
    controlSegmentName?: string;
}
/**
 * AbTestSegmentManager is responsible for managing A/B test segments using cookies.
 * It assigns users to different segments and retrieves the assigned segment from cookies.
 */
declare class AbTestSegmentManager {
    private readonly cookieAccess;
    private readonly abTestCookieName;
    private readonly searchHubSegmentName;
    private readonly controlSegmentName;
    /**
     * Creates an instance of AbTestSegmentManager.
     *
     * @param {CookieAccess} cookieAccess - The interface to access browser cookies.
     * @param {string} [abTestCookieName="_shabT___"] - The name of the cookie used to store the A/B test segment.
     * @param {string} [searchHubSegmentName="sh"] - The name representing the "SearchHub" segment.
     * @param {string} [controlSegmentName="c"] - The name representing the control segment.
     */
    constructor({ cookieAccess, abTestCookieName, controlSegmentName, searchHubSegmentName, }: AbTestSegmentManagerConfig);
    /**
     * Updates the user's segment if the A/B test cookie already exists.
     * If the A/B test cookie is set, the function assigns a new segment (either "SearchHub" or control)
     * and updates the value in the cookie. Otherwise, no action is taken.
     *
     * @returns {AbTestSegment | undefined} - Returns {AbTestSegment} if the segment was successfully assigned, otherwise undefined.
     */
    assignSegment(): AbTestSegment | undefined;
    /**
     * Checks if the user is assigned to the "SearchHub" segment by reading the value from the A/B test cookie.
     *
     * @returns {boolean} - Returns `true` if the user is in the "SearchHub" segment, otherwise `false`.
     */
    isSearchhubActive(): boolean;
}

/**
 * SmartQueryClientConfig is used to configure the SmartQueryClient.
 *
 * @interface SmartQueryClientConfig
 * @property {AbTestSegmentManager} [abTestManager] - Optional. Manages A/B test segments for the client.
 * @property {string} tenant - The tenant identifier in the format "customer.channel".
 * @property {string} [apiKey] - Optional. API key used for authorization.
 * @property {boolean} isAbTestActive - Indicates whether the A/B test is active.
 */
interface SmartQueryClientConfig {
    abTestManager?: AbTestSegmentManager;
    tenant: string;
    apiKey?: string;
    isAbTestActive: boolean;
}
/**
 * Represents the target of the mapping result returned by the SmartQueryClient.
 *
 * @interface MappingTarget
 * @property {string} searchQuery - The mapped query to search for.
 * @property {string | null} redirect - The redirect URL if the query requires redirection, otherwise null.
 */
interface MappingTarget {
    searchQuery: string;
    redirect: string | null;
}
/**
 * SmartQueryClient handles user queries by interacting with a remote smart query service.
 * It supports A/B testing to redirect or modify queries based on user segments. The client
 * can also retrieve cached mapping results if available.
 *
 * @class SmartQueryClient
 */
declare class SmartQueryClient {
    private readonly abTestManager;
    private readonly tenant;
    private readonly customer;
    private readonly channel;
    private readonly apiKey;
    private readonly isAbTestActive;
    private readonly cache?;
    /**
     * Creates an instance of SmartQueryClient.
     *
     * @param {SmartQueryClientConfig} config - Configuration object for SmartQueryClient.
     * @param {ICache} [cache] - Optional cache to retrieve `userQuery` to `searchQuery` mappings.
     * @throws {Error} - Throws an error if A/B test is active and no AbTestSegmentManager is provided.
     */
    constructor(config: SmartQueryClientConfig, cache?: ICache$1<MappingTarget>);
    /**
     * Retrieves a mapping result for a user's search query by interacting with the SmartQuery API.
     * If A/B testing is active and the user is not in the "SearchHub" segment, the provided user query is returned instead.
     * If a cached mapping exists for the `userQuery`, it will be returned without making an API call.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<MappingTarget>} - A promise resolving to the search mapping target, including a possible redirect.
     */
    getMapping(userQuery: string): Promise<MappingTarget>;
}

interface ICache<T> {
    /**
     * Stores a key-value pair in the cache.
     *
     * @param {string} key - The key to store the value under.
     * @param {any} value - The value to store.
     */
    set(key: string, value: T): void;
    /**
     * Retrieves a value from the cache by its key.
     * If the item has expired, it will be removed and undefined is returned.
     *
     * @param {string} key - The key to retrieve the value for.
     * @returns {any | undefined} - The value if it exists and is not expired, or undefined if not found or expired.
     */
    get(key: string): T | undefined;
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

/**
 * Configuration interface for SmartSuggestClient.
 *
 * @interface SmartSuggestClientConfig
 * @property {string} tenant - The tenant identifier in the format "customer.channel".
 * @property {string} [apiKey] - Optional API key used for authorization.
 */
interface SmartSuggestClientConfig {
    tenant: string;
    apiKey?: string;
}
/**
 * Represents a search suggestion returned by the SmartSuggestClient.
 *
 * @interface Suggestion
 * @property {string} suggestion - The suggestion text to display to the user.
 * @property {string} searchQuery - The actual search query associated with the suggestion.
 * @property {string | null} redirect - The redirect URL if the suggestion requires redirection, otherwise null.
 */
interface Suggestion {
    suggestion: string;
    searchQuery: string;
    redirect: string | null;
}
/**
 * SmartSuggestClient handles user queries and provides search suggestions
 * by interacting with the SmartSuggest API. It can optionally cache the
 * mapping of `userQuery` to `searchQuery` for future use in SmartQueryClient.
 *
 * @class SmartSuggestClient
 */
declare class SmartSuggestClient {
    private readonly tenant;
    private readonly customer;
    private readonly channel;
    private readonly apiKey;
    private readonly cache?;
    /**
     * Creates an instance of SmartSuggestClient.
     *
     * @param {SmartSuggestClientConfig} config - Configuration object for SmartSuggestClient.
     * @param {ICache} [cache] - Optional cache to store `userQuery` to `searchQuery` mappings.
     * @throws {Error} - Throws an error if the tenant is invalid.
     */
    constructor(config: SmartSuggestClientConfig, cache?: ICache<MappingTarget>);
    /**
     * Fetches search suggestions based on the user's query by interacting with the SmartSuggest API.
     * Optionally stores the `userQuery` to `searchQuery` mapping in the cache.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<Suggestion[]>} - A promise that resolves to an array of suggestions.
     */
    getSuggestions(userQuery: string): Promise<Suggestion[]>;
}

/**
 * InMemoryCache provides an in-memory key-value store with a TTL (Time-To-Live)
 * for each entry and an optional periodic cleanup process to remove expired items.
 *
 * @class
 */
declare class SimpleMemoryCache<T> implements ICache<T> {
    private cache;
    private readonly defaultTTL;
    private cleanupInterval;
    private isDisposed;
    private isCleaningUp;
    private readonly cleanupIntervalTime;
    /**
     * Creates an instance of InMemoryCache.
     *
     * @param {number} defaultTTLInSeconds - The default time-to-live (TTL) for cache items in seconds.
     * @param {number} [cleanupIntervalInSeconds=60] - Optional. Time interval for cleaning up expired items in seconds. Defaults to 60 seconds.
     */
    constructor(defaultTTLInSeconds: number, cleanupIntervalInSeconds?: number);
    /**
     * Stores a key-value pair in the cache with an optional custom TTL.
     *
     * @param {string} key - The key to store the value under.
     * @param {any} value - The value to store.
     * @param {number} [customTTLInSeconds] - Optional. A custom TTL for the specific item in seconds.
     */
    set(key: string, value: T, customTTLInSeconds?: number): void;
    /**
     * Retrieves a value from the cache by its key.
     * If the item has expired, it will be removed and undefined is returned.
     *
     * @param {string} key - The key to retrieve the value for.
     * @returns {any | undefined} - The value if it exists and is not expired, or undefined if not found or expired.
     */
    get(key: string): T | undefined;
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
    /**
     * Ensures the cache is not disposed before performing any operations.
     * Throws an error if the cache has been disposed.
     */
    private ensureNotDisposed;
    /**
     * Starts the periodic cleanup process to remove expired items.
     * This function ensures that only one cleanup process runs at a time.
     */
    private startCleanupProcess;
}

declare const BrowserClientFactory: ({ tenant, apiKey, abTestActive }: {
    tenant: string;
    abTestActive: boolean;
    apiKey?: string;
}) => {
    smartQueryClient: SmartQueryClient;
    smartSuggestClient: SmartSuggestClient;
    abTestManager: AbTestSegmentManager;
};
declare const ExpressJsClientFactory: ({ tenant, cookieAccess, apiKey, abTestActive }: {
    tenant: string;
    abTestActive: boolean;
    cookieAccess: CookieAccess;
    apiKey?: string;
}) => {
    smartQueryClient: SmartQueryClient;
    smartSuggestClient: SmartSuggestClient;
    abTestManager: AbTestSegmentManager;
};

export { AbTestSegment, AbTestSegmentManager, type AbTestSegmentManagerConfig, BrowserClientFactory, BrowserCookieAccess, type CookieAccess, ExpressCookieAccess, ExpressJsClientFactory, type ICache, type MappingTarget, SEARCH_COLLECTOR_SESSION_COOKIE_NAME, SimpleMemoryCache, SmartQueryClient, type SmartQueryClientConfig, SmartSuggestClient, type SmartSuggestClientConfig, type Suggestion, generateRandomSegment, getBrowserCookie, setBrowserCookie };
