import {AbTestSegmentManager} from "./AbTestSegmentManager";
import {isTenantValidOrThrow} from "./util";

export interface SmartQueryClientConfig {
    abTestManager?: AbTestSegmentManager;
    tenant: string;
    apiKey?: string;
    isAbTestActive: boolean;
}

export interface MappingTarget {
    searchQuery: string;
    redirect: string | null;
}

export class SmartQueryClient {
    private readonly abTestManager: AbTestSegmentManager | undefined;
    private readonly tenant: string;
    private readonly customer: string;
    private readonly channel: string;
    private readonly apiKey: string | undefined;
    private readonly isAbTestActive: boolean;

    constructor(config: SmartQueryClientConfig) {
        isTenantValidOrThrow(config.tenant);

        if (config.isAbTestActive && !this.abTestManager) {
            throw new Error("you need to specify a cookieAccess when abTestActive flag is set to true");
        }

        this.isAbTestActive = config.isAbTestActive;
        this.abTestManager = config.abTestManager;

        this.tenant = config.tenant;
        const split = this.tenant.split(".");

        this.customer = split[0];
        this.channel = split[1]
        this.apiKey = config.apiKey;
    }

    getMapping(userQuery: string): Promise<MappingTarget> {
        if (this.isAbTestActive && this.abTestManager && !this.abTestManager.isSearchhubActive()) {
            return new Promise(res => res({
                redirect: null,
                searchQuery: userQuery
            }));
        }

        let base64Credentials: string | undefined;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }

        return fetch(`https://saas.searchhub.io/smartquery/v2/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`
            } : undefined
        }).then(res => res.json());
    }

}

