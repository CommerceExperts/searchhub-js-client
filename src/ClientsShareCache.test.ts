import {SmartSuggestClient, SmartSuggestClientConfig} from './SmartSuggestClient';
import {SmartQueryClient, SmartQueryClientConfig} from './SmartQueryClient';
import {ICache} from './cache/ICache';

const mockFetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
            mappingTarget: {
                userQuery: 'test query',
                searchQuery: 'mapped query'
            },
            suggestions: [
                {
                    suggestion: 'suggestion1',
                    payload: {
                        "mappingTarget.searchQuery": 'mapped query',
                        "mappingTarget.redirect": null
                    }
                }
            ]
        }),
        headers: {
            get: jest.fn()
        },
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: ''
    })
);

global.fetch = mockFetch as any;

describe('Integration test between SmartSuggestClient and SmartQueryClient', () => {
    let cache: ICache;
    let suggestClient: SmartSuggestClient;
    let queryClient: SmartQueryClient;

    beforeEach(() => {
        jest.clearAllMocks();

        cache = {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn(),
            size: jest.fn(),
            dispose: jest.fn()
        };

        // Initialize both clients with the same cache
        suggestClient = new SmartSuggestClient({tenant: 'customer.channel'} as SmartSuggestClientConfig, cache);
        queryClient = new SmartQueryClient({tenant: 'customer.channel', isAbTestActive: false} as SmartQueryClientConfig, cache);
    });

    test('SmartQueryClient should use the cache entry from SmartSuggestClient', async () => {
        // Simulate calling SmartSuggestClient, which should store an entry in the cache
        await suggestClient.getSuggestions('test query');
        expect(cache.set).toHaveBeenCalledWith('test query', 'mapped query');

        // Simulate a cache hit in SmartQueryClient
        cache.get = jest.fn(() => 'mapped query');

        // Ensure SmartQueryClient uses the cache entry
        const result = await queryClient.getMapping('test query');
        expect(result.searchQuery).toBe('mapped query');

        // Ensure fetch is not called again because the cache was used
        expect(mockFetch).toHaveBeenCalledTimes(1); // only once by SmartSuggestClient
    });

    test('SmartQueryClient should fetch a new mapping if cache is empty', async () => {
        // Simulate an empty cache
        cache.get = jest.fn(() => undefined);

        const result = await queryClient.getMapping('test query');
        expect(mockFetch).toHaveBeenCalledTimes(1);  // only once by SmartQueryClient
    });
});
