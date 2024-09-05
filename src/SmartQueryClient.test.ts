import {SmartQueryClient, SmartQueryClientConfig} from './SmartQueryClient';
import {ICache} from './cache/ICache';


const mockFetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            searchQuery: 'mapped query',
            redirect: null
        })
    })
);

global.fetch = mockFetch as any;

describe('SmartQueryClient', () => {
    let cache: ICache;
    let queryClient: SmartQueryClient;

    beforeEach(() => {
        cache = {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn(),
            size: jest.fn(),
            dispose: jest.fn()
        };
        queryClient = new SmartQueryClient({tenant: 'customer.channel', isAbTestActive: false} as SmartQueryClientConfig, cache);
    });

    test('should return cache hit if available', async () => {
        cache.get = jest.fn(() => 'cached query');
        const result = await queryClient.getMapping('test query');
        expect(result.searchQuery).toBe('cached query');
    });

    test('should fetch new mapping if cache is empty', async () => {
        cache.get = jest.fn(() => undefined);
        const result = await queryClient.getMapping('test query');
        expect(result.searchQuery).toBe('mapped query');
        expect(mockFetch).toHaveBeenCalled();
    });

    test('should work without cache', async () => {
        queryClient = new SmartQueryClient({tenant: 'customer.channel', isAbTestActive: false} as SmartQueryClientConfig);
        const result = await queryClient.getMapping('test query');
        expect(result.searchQuery).toBe('mapped query');
        expect(mockFetch).toHaveBeenCalled();
    });
});
