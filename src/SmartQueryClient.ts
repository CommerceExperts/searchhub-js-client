import {AbTestSegmentManager} from "./AbTestSegmentManager";
import {isTenantValidOrThrow} from "./util";

/**
 * SmartQueryClientConfig is used to configure the SmartQueryClient.
 *
 * @interface SmartQueryClientConfig
 * @property {AbTestSegmentManager} [abTestManager] - Optional. Manages A/B test segments for the client.
 * @property {string} tenant - The tenant identifier in the format "customer.channel".
 * @property {string} [apiKey] - Optional. API key used for authorization.
 * @property {boolean} isAbTestActive - Indicates whether the A/B test is active.
 */
export interface SmartQueryClientConfig {
    abTestManager?: AbTestSegmentManager;
    tenant: string;
    apiKey?: string;
    isAbTestActive: boolean;
}

/**
 * Represents the target of the mapping result returned by the SmartQueryClient.
 *
 * @interface MappingTarget
 * @property {string} searchQuery - The mapped query to search for
 * @property {string | null} redirect - The redirect URL if the query requires redirection, otherwise null.
 */
export interface MappingTarget {
    searchQuery: string;
    redirect: string | null;
}

/**
 * SmartQueryClient handles user queries by interacting with a remote smart query service.
 * It supports A/B testing to redirect or modify queries based on user segments.
 *
 * @class SmartQueryClient
 */
export class SmartQueryClient {
    private readonly abTestManager: AbTestSegmentManager | undefined;
    private readonly tenant: string;
    private readonly customer: string;
    private readonly channel: string;
    private readonly apiKey: string | undefined;
    private readonly isAbTestActive: boolean;

    /**
     * Creates an instance of SmartQueryClient.
     *
     * @param {SmartQueryClientConfig} config - Configuration object for SmartQueryClient.
     * @throws {Error} - Throws an error if A/B test is active and no AbTestSegmentManager is provided.
     */
    constructor(config: SmartQueryClientConfig) {
        isTenantValidOrThrow(config.tenant);

        // Ensure that if A/B testing is active, abTestManager is provided.
        if (config.isAbTestActive && !config.abTestManager) {
            throw new Error("you need to specify a cookieAccess when abTestActive flag is set to true");
        }

        this.isAbTestActive = config.isAbTestActive;
        this.abTestManager = config.abTestManager;

        // Parse the tenant to retrieve the customer and channel
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
    }

    /**
     * Retrieves a mapping result for a user's search query by interacting with the SmartQuery API.
     * If A/B testing is active and the user is not in the "SearchHub" segment, the provided user query is returned instead.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<MappingTarget>} - A promise resolving to the search mapping target, including a possible redirect.
     */
    getMapping(userQuery: string): Promise<MappingTarget> {
        // Check if A/B testing is active and the user is not in the SearchHub segment
        if (this.isAbTestActive && this.abTestManager && !this.abTestManager.isSearchhubActive()) {
            // Return default behavior (no redirect) if the user is not in the SearchHub segment
            return new Promise(res => res({
                redirect: null,
                searchQuery: userQuery
            }));
        }

        // Prepare authorization header if API key is available
        let base64Credentials: string | undefined;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }

        // Fetch the mapping from the SmartQuery API
        return fetch(`https://saas.searchhub.io/smartquery/v2/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`
            } : undefined
        }).then(res => res.json());
    }
}


