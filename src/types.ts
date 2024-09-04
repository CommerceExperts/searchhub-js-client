export interface MappedResult {
    /**
     * The query the user typed in
     */
    userQuery: string;
    /**
     * The refined query
     */
    masterQuery: string | null;
    /**
     * A redirect url
     */
    redirect: string | null;
    /**
     * The query you should search for
     */
    searchQuery: string;
    /**
     * Indicates if the result could sucessfully be mapped
     */
    successful: boolean;
}

export interface SearchhubConfig {
    tenant: string;
    apiKey: string;
}

export interface RequestOptions {
    tenant?: string;
}