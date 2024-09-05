import {SmartSuggestClient, SmartSuggestClientConfig} from './SmartSuggestClient';
import {Cache} from './cache/Cache';

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
            get: jest.fn() // Mocked headers.get() function if needed
        },
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: ''
    })
);

global.fetch = mockFetch as any;

describe('SmartSuggestClient', () => {
    let cache: Cache;
    let suggestClient: SmartSuggestClient;

    beforeEach(() => {
        cache = {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn(),
            size: jest.fn(),
            dispose: jest.fn()
        };
        suggestClient = new SmartSuggestClient({tenant: 'customer.channel'} as SmartSuggestClientConfig, cache);
    });

    test('should store userQuery and searchQuery in cache', async () => {
        await suggestClient.getSuggestions('test query');
        expect(cache.set).toHaveBeenCalledWith('test query', 'mapped query');
    });

    test('should fetch suggestions without cache', async () => {
        suggestClient = new SmartSuggestClient({tenant: 'customer.channel'} as SmartSuggestClientConfig);
        const suggestions = await suggestClient.getSuggestions('test query');
        expect(suggestions[0].suggestion).toBe('suggestion1');
    });
});
