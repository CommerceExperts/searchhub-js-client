import {CookieAccess} from "./cookies";

const fiftyTwo = Math.pow(2, -52);
const twenty = Math.pow(2, 20);

/**
 * Create a random number between 0 and 1 using crypto api or Math.random as a fallback
 */
export const random = () => {
    try {
        let cryptoModule;

        // Check if we are in the browser or Node.js
        if (typeof window !== 'undefined' && window.crypto) {
            cryptoModule = window.crypto; // Browser environment
        } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            cryptoModule = globalThis.crypto; // Global browser environment
        } else if (typeof require === 'function') {
            // Node.js environment: require crypto module
            try {
                cryptoModule = require('crypto');
            } catch (e) {
                console.error("Failed to load Node.js crypto module, falling back to Math.random()");
                return Math.random(); // Fallback to Math.random if crypto module is not available
            }
        }

        if (cryptoModule && cryptoModule.getRandomValues) {
            // Browser: use crypto.getRandomValues
            const arr = new Uint32Array(2);
            cryptoModule.getRandomValues(arr);

            // Make a 54-bit random number -> max safe number in JS
            const mantissa = (arr[0] * twenty) + (arr[1] >>> 12);
            // Convert it to a number between 0 and 1
            return mantissa * fiftyTwo;
        } else if (cryptoModule && cryptoModule.randomInt) {
            // Node.js: use crypto.randomInt
            const arr = new Uint32Array(2);
            arr[0] = cryptoModule.randomInt(0, 0xFFFFFFFF);
            arr[1] = cryptoModule.randomInt(0, 0xFFFFFFFF);

            // Make a 54-bit random number -> max safe number in JS
            const mantissa = (arr[0] * twenty) + (arr[1] >>> 12);
            // Convert it to a number between 0 and 1
            return mantissa * fiftyTwo;

        } else if (cryptoModule && cryptoModule.randomBytes) {
            // Fallback for older Node.js versions
            const buffer = cryptoModule.randomBytes(8);
            const arr = new Uint32Array(buffer.buffer);

            // Make a 54-bit random number -> max safe number in JS
            const mantissa = (arr[0] * twenty) + (arr[1] >>> 12);
            // Convert it to a number between 0 and 1
            return mantissa * fiftyTwo;
        } else {
            // Fallback to Math.random if no secure crypto API is available
            return Math.random();
        }

    } catch (e) {
        console.error("Could not create a random number by using a secure crypto API, falling back to Math.random()", e);
        return Math.random();
    }
};

export enum AbTestSegment {
    SEARCHHUB = "SH",
    CONTROL = "C",
}

/**
 * Generates randomly a segment
 */
export const generateRandomSegment = (): AbTestSegment => {
    if (random() < 0.5) {
        return AbTestSegment.SEARCHHUB;
    } else {
        return AbTestSegment.CONTROL;
    }
}

export interface AbTestSegmentManagerConfig {
    cookieAccess: CookieAccess;
    abTestCookieName?: string;
    searchHubSegmentName?: string;
    controlSegmentName?: string;
}


/**
 * AbTestSegmentManager is responsible for managing A/B test segments using cookies.
 * It assigns users to different segments and retrieves the assigned segment from cookies.
 */
export class AbTestSegmentManager {
    private readonly cookieAccess: CookieAccess;
    private readonly abTestCookieName: string;
    private readonly searchHubSegmentName: string;
    private readonly controlSegmentName: string;

    /**
     * Creates an instance of AbTestSegmentManager.
     *
     * @param {CookieAccess} cookieAccess - The interface to access browser cookies.
     * @param {string} [abTestCookieName="_shabT___"] - The name of the cookie used to store the A/B test segment.
     * @param {string} [searchHubSegmentName="sh"] - The name representing the "SearchHub" segment.
     * @param {string} [controlSegmentName="c"] - The name representing the control segment.
     */
    constructor({
                    cookieAccess,
                    abTestCookieName,
                    controlSegmentName,
                    searchHubSegmentName,
                }: AbTestSegmentManagerConfig) {
        this.cookieAccess = cookieAccess;
        this.abTestCookieName = abTestCookieName || "_shabT___";
        this.searchHubSegmentName = searchHubSegmentName || AbTestSegment.SEARCHHUB;
        this.controlSegmentName = controlSegmentName || AbTestSegment.CONTROL;
    }

    /**
     * Updates the user's segment if the A/B test cookie already exists.
     * If the A/B test cookie is set, the function assigns a new segment (either "SearchHub" or control)
     * and updates the value in the cookie. Otherwise, no action is taken.
     *
     * @returns {AbTestSegment | undefined} - Returns {AbTestSegment} if the segment was successfully assigned, otherwise undefined.
     */
    assignSegment(): AbTestSegment | undefined {
        const segment = generateRandomSegment();
        if (this.cookieAccess.getCookie(this.abTestCookieName) === "") {
            this.cookieAccess.setCookie(
                this.abTestCookieName,
                segment === AbTestSegment.SEARCHHUB ? this.searchHubSegmentName : this.controlSegmentName
            );
            return segment;
        } else {
            return undefined;
        }
    }

    /**
     * Checks if the user is assigned to the "SearchHub" segment by reading the value from the A/B test cookie.
     *
     * @returns {boolean} - Returns `true` if the user is in the "SearchHub" segment, otherwise `false`.
     */
    isSearchhubActive(): boolean {
        let abTestSegment = this.cookieAccess.getCookie(this.abTestCookieName);
        if (!abTestSegment) {
            abTestSegment = this.assignSegment() as AbTestSegment;
        }

        return abTestSegment === this.searchHubSegmentName;
    }
}