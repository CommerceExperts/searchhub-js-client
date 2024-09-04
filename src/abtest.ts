const fiftyTwo = Math.pow(2, -52);
const twenty = Math.pow(2, 20);

/**
 * Create a random number between 0 and 1 using crypto api or Math.random as a fallback
 */
const random = () => {
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

export enum AbSegment {
    SEARCHHUB = "SH",
    CONTROL = "C",
}

/**
 * Generates randomly a segment
 */
export const generateRandomSegment = (): AbSegment => {
    if (random() < 0.5) {
        return AbSegment.SEARCHHUB;
    } else {
        return AbSegment.CONTROL;
    }
}