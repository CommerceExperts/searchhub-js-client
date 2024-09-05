import {CookieAccess} from "./cookies";
import {SmartQueryClient} from "./SmartQueryClient";
import {SimpleMemoryCache} from "./cache/SimpleMemoryCache";
import {AbTestSegmentManager} from "./AbTestSegmentManager";
import {SmartSuggestClient} from "./SmartSuggestClient";

export const ClientFactory = ({tenant, cookieAccess, apiKey, abTestActive}: { tenant: string, abTestActive: boolean, cookieAccess: CookieAccess, apiKey?: string }) => {
    const cache = new SimpleMemoryCache(360, 360);
    const abTestSegmentManager = new AbTestSegmentManager({cookieAccess});

    const smartQueryClient = new SmartQueryClient({
        tenant, apiKey, isAbTestActive: abTestActive, abTestManager: abTestSegmentManager
    }, cache);

    const smartSuggestClient = new SmartSuggestClient({tenant, apiKey}, cache);
    return {
        smartQueryClient, smartSuggestClient, abTestManager: abTestSegmentManager
    };
}