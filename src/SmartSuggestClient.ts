import {isTenantValidOrThrow} from "./util";

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
 * by interacting with the SmartSuggest API.
 *
 * @class SmartSuggestClient
 */
export class SmartSuggestClient {
    private readonly tenant: string;
    private readonly customer: string;
    private readonly channel: string;
    private readonly apiKey: string | undefined;

    /**
     * Creates an instance of SmartSuggestClient.
     *
     * @param {SmartSuggestClientConfig} config - Configuration object for SmartSuggestClient.
     * @throws {Error} - Throws an error if the tenant is invalid.
     */
    constructor(config: SmartSuggestClientConfig) {
        isTenantValidOrThrow(config.tenant);
        // Parse the tenant to retrieve the customer and channel
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
    }

    /**
     * Fetches search suggestions based on the user's query by interacting with the SmartSuggest API.
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

        // Fetch suggestions from the SmartSuggest API
        return fetch(`https://saas.searchhub.io/smartsuggest/v4/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`
            } : undefined
        }).then(res => res.json())
            .then(data => {
                // TODO pre-cache mapping

                // Map the API response to the Suggestion interface
                return data.suggestions.map((s: any) => ({
                    suggestion: s.suggestion,
                    searchQuery: s.payload["mappingTarget.searchQuery"],
                    redirect: s.payload["mappingTarget.redirect"] || null,
                }));
            });
    }
}
