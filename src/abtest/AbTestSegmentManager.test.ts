import {AbTestSegmentManager, AbTestSegment, generateRandomSegment, random} from './AbTestSegmentManager';
import {CookieAccess} from '../cookies';

describe('AbTestSegmentManager Tests', () => {

    let mockCookieAccess: CookieAccess;

    beforeEach(() => {
        jest.restoreAllMocks();

        mockCookieAccess = {
            getCookie: jest.fn().mockReturnValue(''),
            setCookie: jest.fn(),
        };
    });

    it('should assign a random segment', () => {
        const manager = new AbTestSegmentManager({
            cookieAccess: mockCookieAccess
        });

        const segment = manager.assignSegment();

        expect([AbTestSegment.SEARCHHUB, AbTestSegment.CONTROL]).toContain(segment);
        expect(mockCookieAccess.setCookie).toHaveBeenCalledWith('_shabT___', expect.any(String));
    });

    it('should correctly check if searchHub is active', () => {
        mockCookieAccess.getCookie = jest.fn().mockReturnValue('SH');
        const manager = new AbTestSegmentManager({
            cookieAccess: mockCookieAccess
        });

        const isSearchHubActive = manager.isSearchhubActive();
        expect(isSearchHubActive).toBe(true);
    });

    it('should fallback to control if no cookie is set', () => {
        mockCookieAccess.getCookie = jest.fn().mockReturnValue('');
        const manager = new AbTestSegmentManager({
            cookieAccess: mockCookieAccess
        });

        const isSearchHubActive = manager.isSearchhubActive();
        expect(isSearchHubActive).toBeDefined();
        expect(false).toBe(isSearchHubActive);
    });

    it('should ensure even distribution of random segment assignment', () => {
        const iterations = 100000;  // Large number for sampling
        let searchHubCount = 0;
        let controlCount = 0;

        for (let i = 0; i < iterations; i++) {
            const segment = generateRandomSegment();
            if (segment === AbTestSegment.SEARCHHUB) {
                searchHubCount++;
            } else {
                controlCount++;
            }
        }

        const searchHubRatio = searchHubCount / iterations;
        const controlRatio = controlCount / iterations;

        expect(searchHubRatio).toBeCloseTo(0.5, 2);
        expect(controlRatio).toBeCloseTo(0.5, 2);
    });

    it('should use crypto for random generation in browser environment', () => {
        // Define the global window with the correct typing
        const mockCrypto = {
            getRandomValues: (array: Uint32Array) => {
                array[0] = Math.floor(Math.random() * 0xFFFFFFFF);
                array[1] = Math.floor(Math.random() * 0xFFFFFFFF);
            }
        };

        Object.defineProperty(global, 'window', {
            value: {crypto: mockCrypto},
            writable: true
        });

        const randomValue = random();

        expect(randomValue).toBeGreaterThanOrEqual(0);
        expect(randomValue).toBeLessThan(1);
    });

    it('should use crypto for random generation in Node.js environment', () => {
        const crypto = require('crypto');
        jest.spyOn(crypto, 'randomInt').mockImplementation((min: any, max: any) => Math.floor(Math.random() * (max - min) + min));

        const randomValue = random();

        expect(randomValue).toBeGreaterThanOrEqual(0);
        expect(randomValue).toBeLessThan(1);
    });

    it('should fallback to Math.random if crypto is unavailable', () => {
        // Backup the original global crypto object
        const originalCrypto = global.crypto;

        // Delete or undefined the global crypto to simulate no crypto availability
        Object.defineProperty(global, 'crypto', {
            value: undefined,
            writable: true
        });

        const randomValue = random();
        expect(randomValue).toBeGreaterThanOrEqual(0);
        expect(randomValue).toBeLessThan(1);

        // Restore the original crypto object
        Object.defineProperty(global, 'crypto', {
            value: originalCrypto,
            writable: true
        });
    });
});
