import {MappedResult, RequestOptions, SearchhubConfig} from "./types";
import {configs} from "./internal";

export const initializeTenant = ({tenant, apiKey}: SearchhubConfig) => {
    isTenantValidOrThrow(tenant);

    const split = tenant.split(".");
    const conf = {
        customer: split[0],
        channel: split[1],
        apiKey
    };


    configs.set('searchhub', conf);
    configs.set(tenant, conf);
}
export const getMapping = (userQuery: string, {tenant}: RequestOptions = {}): Promise<MappedResult> => {
    const conf = getConfOrThrow(tenant);


    let base64Credentials: string | undefined;
    if (conf.apiKey) {
        base64Credentials = btoa(conf.customer + ":" + conf.apiKey);
    }

    return fetch(`https://saas.searchhub.io/smartquery/v2/${conf.customer}/${conf.channel}?userQuery=${userQuery}`, {
        method: "GET",
        headers: base64Credentials ? {
            'Authorization': `Basic ${base64Credentials}`
        } : undefined
    })
        .then(res => res.json());
}
export const getSuggestions = (userQuery: string, {tenant}: RequestOptions = {}) => {
    const conf = getConfOrThrow(tenant);

    return fetch(`https://saas.searchhub.io/smartsuggest/v4/${conf.customer}/${conf.channel}?userQuery=${userQuery}`, {
        method: "GET"
    })
        .then(res => res.json());
}

function getConfOrThrow(tenant: string | undefined) {
    const conf = configs.get(tenant || "searchhub");
    if (!conf) {
        if (tenant === "searchhub") {
            throw new Error("the client has never been initialized, please call the initializeTenant method first");
        } else {
            throw new Error(`no config available for tenant ${tenant}, please call the initializeTenant method first`);
        }
    }
    return conf;
}

function isTenantValidOrThrow(tenant: string) {
    const errMsg = "invalid tenant string '" + tenant + "'. "
        + "Must be in format '<name>.<channel>' where each part matches the regular exp: '^[a-zA-Z0-9_-]$'";

    if (tenant.includes(".")) {
        const parts = tenant.split(".");
        const regex = /^[a-zA-Z0-9_-]+$/;
        if (parts.length != 2) {
            throw new Error(errMsg);
        }

        if (!regex.exec(parts[0]) || !regex.exec(parts[1])) {
            throw new Error(errMsg);
        }

        return true;
    } else {
        throw new Error(errMsg);
    }
}