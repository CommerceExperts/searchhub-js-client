import {isTenantValidOrThrow} from "./util";

export interface SmartSuggestClientConfig {
    tenant: string;
    apiKey?: string;
}

export interface Suggestion {
    suggestion: string;
    searchQuery: string;
    redirect: string | null;
}

export class SmartSuggestClient {
    private readonly tenant: string;
    private readonly customer: string;
    private readonly channel: string;
    private readonly apiKey: string | undefined;

    constructor(config: SmartSuggestClientConfig) {
        isTenantValidOrThrow(config.tenant);
        // Parse the tenant to retrieve the customer and channel
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
    }

    getSuggestions(userQuery: string): Promise<Suggestion[]> {
        // Prepare authorization header if API key is available
        let base64Credentials: string | undefined;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }

        // Fetch the mapping from the SmartQuery API
        return fetch(`https://saas.searchhub.io/smartsuggest/v4/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`
            } : undefined
        }).then(res => res.json())
            .then(data => {
                // TODO pre-cache mapping

                return data.suggestions.map((s: any) => ({
                    suggestion: s.suggestion,
                    searchQuery: s.payload["mappingTarget.searchQuery"],
                    redirect: s.payload["mappingTarget.redirect"] || null,
                }))
            });
    }

}