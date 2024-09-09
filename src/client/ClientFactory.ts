import {BrowserCookieAccess, CookieAccess} from "../cookies";
import {MappingTarget, SmartQueryClient} from "./SmartQueryClient";
import {SimpleMemoryCache} from "../cache/SimpleMemoryCache";
import {AbTestSegmentManager} from "../abtest/AbTestSegmentManager";
import {SmartSuggestClient} from "./SmartSuggestClient";


export const BrowserClientFactory = ({tenant, apiKey, abTestActive}: { tenant: string, abTestActive: boolean, apiKey?: string }) => {
    const cache = new SimpleMemoryCache<MappingTarget>(360, 360);
    const abTestSegmentManager = new AbTestSegmentManager({cookieAccess: new BrowserCookieAccess()});

    const smartQueryClient = new SmartQueryClient({
        tenant,
        apiKey,
        isAbTestActive: abTestActive,
        abTestManager: abTestSegmentManager
    }, cache);

    const smartSuggestClient = new SmartSuggestClient({tenant, apiKey}, cache);
    return {
        smartQueryClient, smartSuggestClient, abTestManager: abTestSegmentManager
    };
}


export const ExpressJsClientFactory = ({tenant, cookieAccess, apiKey, abTestActive}: { tenant: string, abTestActive: boolean, cookieAccess: CookieAccess, apiKey?: string }) => {
    const abTestSegmentManager = new AbTestSegmentManager({cookieAccess});

    const smartQueryClient = new SmartQueryClient({
        tenant,
        apiKey,
        isAbTestActive: abTestActive,
        abTestManager: abTestSegmentManager
    });

    const smartSuggestClient = new SmartSuggestClient({tenant, apiKey});
    return {
        smartQueryClient, smartSuggestClient, abTestManager: abTestSegmentManager
    };
}