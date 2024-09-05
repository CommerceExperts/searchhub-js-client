import {isTenantValidOrThrow} from "./util";
import {Cache} from "./cache/Cache";

/**
 * Configuration interface for SmartSuggestClient.
 *
 * @interface SmartSuggestClientConfig
 * @property {string} tenant - The tenant identifier in the format "customer.channel".
 * @property {string} [apiKey] - Optional API key used for authorization.
 */
export interface SmartSuggestClientConfig {
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
export interface Suggestion {
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
export class SmartSuggestClient {
    private readonly tenant: string;
    private readonly customer: string;
    private readonly channel: string;
    private readonly apiKey: string | undefined;
    private readonly cache?: Cache;

    /**
     * Creates an instance of SmartSuggestClient.
     *
     * @param {SmartSuggestClientConfig} config - Configuration object for SmartSuggestClient.
     * @param {Cache} [cache] - Optional cache to store `userQuery` to `searchQuery` mappings.
     * @throws {Error} - Throws an error if the tenant is invalid.
     */
    constructor(config: SmartSuggestClientConfig, cache?: Cache) {
        isTenantValidOrThrow(config.tenant);
        // Parse the tenant to retrieve the customer and channel
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
        this.cache = cache;  // Optional cache initialization
    }

    /**
     * Fetches search suggestions based on the user's query by interacting with the SmartSuggest API.
     * Optionally stores the `userQuery` to `searchQuery` mapping in the cache.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<Suggestion[]>} - A promise that resolves to an array of suggestions.
     */
    getSuggestions(userQuery: string): Promise<Suggestion[]> {
        // Prepare authorization header if API key is available
        let base64Credentials: string | undefined;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }

        return fetch(`https://saas.searchhub.io/smartsuggest/v4/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`
            } : undefined
        }).then(res => res.json())
            .then(data => {
                const {userQuery, searchQuery} = data.mappingTarget;

                // Cache-Eintrag, wenn der Cache existiert
                if (this.cache) {
                    this.cache.set(userQuery, searchQuery); // Cache für SmartQueryClient
                }

                // Map the API response to the Suggestion interface
                return data.suggestions.map((s: any) => ({
                    suggestion: s.suggestion,
                    searchQuery: s.payload["mappingTarget.searchQuery"],
                    redirect: s.payload["mappingTarget.redirect"] || null,
                }));
            });
    }
}
