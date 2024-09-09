(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["searchHubClient"] = factory();
	else
		root["searchHubClient"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/abtest/AbTestSegmentManager.ts":
/*!********************************************!*\
  !*** ./src/abtest/AbTestSegmentManager.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbTestSegment: () => (/* binding */ AbTestSegment),
/* harmony export */   AbTestSegmentManager: () => (/* binding */ AbTestSegmentManager),
/* harmony export */   generateRandomSegment: () => (/* binding */ generateRandomSegment),
/* harmony export */   random: () => (/* binding */ random)
/* harmony export */ });
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
        }
        else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            cryptoModule = globalThis.crypto; // Global browser environment
        }
        else if (true) {
            // Node.js environment: require crypto module
            try {
                cryptoModule = __webpack_require__(/*! crypto */ "?ab08");
            }
            catch (e) {
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
        }
        else if (cryptoModule && cryptoModule.randomInt) {
            // Node.js: use crypto.randomInt
            const arr = new Uint32Array(2);
            arr[0] = cryptoModule.randomInt(0, 0xFFFFFFFF);
            arr[1] = cryptoModule.randomInt(0, 0xFFFFFFFF);
            // Make a 54-bit random number -> max safe number in JS
            const mantissa = (arr[0] * twenty) + (arr[1] >>> 12);
            // Convert it to a number between 0 and 1
            return mantissa * fiftyTwo;
        }
        else if (cryptoModule && cryptoModule.randomBytes) {
            // Fallback for older Node.js versions
            const buffer = cryptoModule.randomBytes(8);
            const arr = new Uint32Array(buffer.buffer);
            // Make a 54-bit random number -> max safe number in JS
            const mantissa = (arr[0] * twenty) + (arr[1] >>> 12);
            // Convert it to a number between 0 and 1
            return mantissa * fiftyTwo;
        }
        else {
            // Fallback to Math.random if no secure crypto API is available
            return Math.random();
        }
    }
    catch (e) {
        console.error("Could not create a random number by using a secure crypto API, falling back to Math.random()", e);
        return Math.random();
    }
};
var AbTestSegment;
(function (AbTestSegment) {
    AbTestSegment["SEARCHHUB"] = "SH";
    AbTestSegment["CONTROL"] = "C";
})(AbTestSegment || (AbTestSegment = {}));
/**
 * Generates randomly a segment
 */
const generateRandomSegment = () => {
    if (random() < 0.5) {
        return AbTestSegment.SEARCHHUB;
    }
    else {
        return AbTestSegment.CONTROL;
    }
};
/**
 * AbTestSegmentManager is responsible for managing A/B test segments using cookies.
 * It assigns users to different segments and retrieves the assigned segment from cookies.
 */
class AbTestSegmentManager {
    /**
     * Creates an instance of AbTestSegmentManager.
     *
     * @param {CookieAccess} cookieAccess - The interface to access browser cookies.
     * @param {string} [abTestCookieName="_shabT___"] - The name of the cookie used to store the A/B test segment.
     * @param {string} [searchHubSegmentName="sh"] - The name representing the "SearchHub" segment.
     * @param {string} [controlSegmentName="c"] - The name representing the control segment.
     */
    constructor({ cookieAccess, abTestCookieName, controlSegmentName, searchHubSegmentName, }) {
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
    assignSegment() {
        const segment = generateRandomSegment();
        if (this.cookieAccess.getCookie(this.abTestCookieName) === "") {
            this.cookieAccess.setCookie(this.abTestCookieName, segment === AbTestSegment.SEARCHHUB ? this.searchHubSegmentName : this.controlSegmentName);
            return segment;
        }
        else {
            return undefined;
        }
    }
    /**
     * Checks if the user is assigned to the "SearchHub" segment by reading the value from the A/B test cookie.
     *
     * @returns {boolean} - Returns `true` if the user is in the "SearchHub" segment, otherwise `false`.
     */
    isSearchhubActive() {
        let abTestSegment = this.cookieAccess.getCookie(this.abTestCookieName);
        if (!abTestSegment) {
            abTestSegment = this.assignSegment();
        }
        return abTestSegment === this.searchHubSegmentName;
    }
}


/***/ }),

/***/ "./src/cache/SimpleMemoryCache.ts":
/*!****************************************!*\
  !*** ./src/cache/SimpleMemoryCache.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimpleMemoryCache: () => (/* binding */ SimpleMemoryCache)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * SimpleMemoryCache provides an in-memory key-value store with a TTL (Time-To-Live)
 * for each entry and an optional periodic cleanup process to remove expired items.
 *
 * @class
 */
class SimpleMemoryCache {
    /**
     * Creates an instance of InMemoryCache.
     *
     * @param {number} defaultTTLInSeconds - The default time-to-live (TTL) for cache items in seconds.
     * @param {number} [cleanupIntervalInSeconds=60] - Optional. Time interval for cleaning up expired items in seconds. Defaults to 60 seconds.
     */
    constructor(defaultTTLInSeconds, cleanupIntervalInSeconds = 60) {
        this.cleanupInterval = null;
        this.isDisposed = false;
        this.isCleaningUp = false; // Lock to ensure only one cleanup process runs at a time
        this.cache = new Map();
        this.defaultTTL = defaultTTLInSeconds * 1000; // Convert TTL to milliseconds
        this.cleanupIntervalTime = cleanupIntervalInSeconds * 1000; // Convert cleanup interval to milliseconds
        // Automatically start the cleanup process
        this.startCleanupProcess();
    }
    /**
     * Stores a key-value pair in the cache with an optional custom TTL.
     *
     * @param {string} key - The key to store the value under.
     * @param {any} value - The value to store.
     * @param {number} [customTTLInSeconds] - Optional. A custom TTL for the specific item in seconds.
     */
    set(key, value, customTTLInSeconds) {
        this.ensureNotDisposed(); // Check if the cache is disposed
        const ttl = customTTLInSeconds ? customTTLInSeconds * 1000 : this.defaultTTL;
        const expiresAt = Date.now() + ttl;
        const item = {
            value,
            expiresAt,
        };
        this.cache.set(key, item);
    }
    /**
     * Retrieves a value from the cache by its key.
     * If the item has expired, it will be removed and undefined is returned.
     *
     * @param {string} key - The key to retrieve the value for.
     * @returns {any | undefined} - The value if it exists and is not expired, or undefined if not found or expired.
     */
    get(key) {
        this.ensureNotDisposed(); // Check if the cache is disposed
        const item = this.cache.get(key);
        if (!item) {
            return undefined;
        }
        // Check if the item is expired and remove it if so
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }
        return item.value;
    }
    /**
     * Deletes a key-value pair from the cache.
     *
     * @param {string} key - The key to remove from the cache.
     */
    delete(key) {
        this.ensureNotDisposed(); // Check if the cache is disposed
        this.cache.delete(key);
    }
    /**
     * Clears all items from the cache.
     */
    clear() {
        this.ensureNotDisposed(); // Check if the cache is disposed
        this.cache.clear();
    }
    /**
     * Returns the number of items currently stored in the cache.
     *
     * @returns {number} - The number of items in the cache.
     */
    size() {
        this.ensureNotDisposed(); // Check if the cache is disposed
        return this.cache.size;
    }
    /**
     * Disposes of the cache by stopping the cleanup process and clearing all items from the cache.
     * This method should be called when the cache is no longer needed.
     */
    dispose() {
        if (this.isDisposed) {
            throw new Error('This cache has already been disposed.');
        }
        this.clear();
        if (this.cleanupInterval) {
            clearTimeout(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.isDisposed = true;
    }
    /**
     * Ensures the cache is not disposed before performing any operations.
     * Throws an error if the cache has been disposed.
     */
    ensureNotDisposed() {
        if (this.isDisposed) {
            throw new Error('This cache has been disposed and can no longer be used.');
        }
    }
    /**
     * Starts the periodic cleanup process to remove expired items.
     * This function ensures that only one cleanup process runs at a time.
     */
    startCleanupProcess() {
        if (this.cleanupInterval || this.isCleaningUp) {
            return;
        }
        const cleanup = () => __awaiter(this, void 0, void 0, function* () {
            if (this.isDisposed || this.isCleaningUp)
                return;
            this.isCleaningUp = true; // Lock the cleanup
            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now > item.expiresAt) {
                    yield new Promise((resolve) => setTimeout(() => {
                        this.cache.delete(key);
                        resolve(null);
                    }, 0)); // Defer the deletion to make it non-blocking
                }
            }
            this.isCleaningUp = false; // Unlock after cleanup
            if (!this.isDisposed) {
                this.cleanupInterval = setTimeout(cleanup, this.cleanupIntervalTime); // Reschedule after configured interval
            }
        });
        // Start the cleanup process
        this.cleanupInterval = setTimeout(cleanup, this.cleanupIntervalTime);
    }
}


/***/ }),

/***/ "./src/client/ClientFactory.ts":
/*!*************************************!*\
  !*** ./src/client/ClientFactory.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserClientFactory: () => (/* binding */ BrowserClientFactory),
/* harmony export */   ExpressJsClientFactory: () => (/* binding */ ExpressJsClientFactory)
/* harmony export */ });
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cookies */ "./src/cookies.ts");
/* harmony import */ var _SmartQueryClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SmartQueryClient */ "./src/client/SmartQueryClient.ts");
/* harmony import */ var _cache_SimpleMemoryCache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../cache/SimpleMemoryCache */ "./src/cache/SimpleMemoryCache.ts");
/* harmony import */ var _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../abtest/AbTestSegmentManager */ "./src/abtest/AbTestSegmentManager.ts");
/* harmony import */ var _SmartSuggestClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SmartSuggestClient */ "./src/client/SmartSuggestClient.ts");





const BrowserClientFactory = ({ tenant, apiKey, abTestActive }) => {
    const cache = new _cache_SimpleMemoryCache__WEBPACK_IMPORTED_MODULE_2__.SimpleMemoryCache(360, 360);
    const abTestSegmentManager = new _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_3__.AbTestSegmentManager({ cookieAccess: new _cookies__WEBPACK_IMPORTED_MODULE_0__.BrowserCookieAccess() });
    const smartQueryClient = new _SmartQueryClient__WEBPACK_IMPORTED_MODULE_1__.SmartQueryClient({
        tenant,
        apiKey,
        isAbTestActive: abTestActive,
        abTestManager: abTestSegmentManager
    }, cache);
    const smartSuggestClient = new _SmartSuggestClient__WEBPACK_IMPORTED_MODULE_4__.SmartSuggestClient({ tenant, apiKey }, cache);
    return {
        smartQueryClient, smartSuggestClient, abTestManager: abTestSegmentManager
    };
};
const ExpressJsClientFactory = ({ tenant, cookieAccess, apiKey, abTestActive }) => {
    const abTestSegmentManager = new _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_3__.AbTestSegmentManager({ cookieAccess });
    const smartQueryClient = new _SmartQueryClient__WEBPACK_IMPORTED_MODULE_1__.SmartQueryClient({
        tenant,
        apiKey,
        isAbTestActive: abTestActive,
        abTestManager: abTestSegmentManager
    });
    const smartSuggestClient = new _SmartSuggestClient__WEBPACK_IMPORTED_MODULE_4__.SmartSuggestClient({ tenant, apiKey });
    return {
        smartQueryClient, smartSuggestClient, abTestManager: abTestSegmentManager
    };
};


/***/ }),

/***/ "./src/client/SmartQueryClient.ts":
/*!****************************************!*\
  !*** ./src/client/SmartQueryClient.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SmartQueryClient: () => (/* binding */ SmartQueryClient)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

/**
 * SmartQueryClient handles user queries by interacting with a remote smart query service.
 * It supports A/B testing to redirect or modify queries based on user segments. The client
 * can also retrieve cached mapping results if available.
 *
 * @class SmartQueryClient
 */
class SmartQueryClient {
    /**
     * Creates an instance of SmartQueryClient.
     *
     * @param {SmartQueryClientConfig} config - Configuration object for SmartQueryClient.
     * @param {ICache} [cache] - Optional cache to retrieve `userQuery` to `searchQuery` mappings.
     * @throws {Error} - Throws an error if A/B test is active and no AbTestSegmentManager is provided.
     */
    constructor(config, cache) {
        (0,_util__WEBPACK_IMPORTED_MODULE_0__.isTenantValidOrThrow)(config.tenant);
        if (config.isAbTestActive && !config.abTestManager) {
            throw new Error("you need to specify a cookieAccess when abTestActive flag is set to true");
        }
        this.isAbTestActive = config.isAbTestActive;
        this.abTestManager = config.abTestManager;
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
        this.cache = cache; // Optional cache initialization
    }
    /**
     * Retrieves a mapping result for a user's search query by interacting with the SmartQuery API.
     * If A/B testing is active and the user is not in the "SearchHub" segment, the provided user query is returned instead.
     * If a cached mapping exists for the `userQuery`, it will be returned without making an API call.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<MappingTarget>} - A promise resolving to the search mapping target, including a possible redirect.
     */
    getMapping(userQuery) {
        if (this.cache) {
            const cachedMapping = this.cache.get(userQuery);
            if (cachedMapping) {
                return Promise.resolve(cachedMapping);
            }
        }
        if (this.isAbTestActive && this.abTestManager && !this.abTestManager.isSearchhubActive()) {
            return new Promise(res => res({
                redirect: null,
                searchQuery: userQuery
            }));
        }
        let base64Credentials;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }
        return fetch(`https://saas.searchhub.io/smartquery/v2/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`,
                'Accept': 'application/json',
            } : {
                'Accept': 'application/json',
            }
        })
            .then(response => {
            if (response.status === 404) {
                throw new Error('Resource not found (404). Please check your tenant configuration');
            }
            else if (!response.ok) {
                throw new Error(`Unexpected error: status ${response.status}`);
            }
            return response.json();
        })
            .then(target => ({ searchQuery: target.searchQuery, redirect: target.redirect || null }))
            .then(mapping => {
            if (this.cache) {
                this.cache.set(userQuery, mapping);
            }
            return mapping;
        });
    }
}


/***/ }),

/***/ "./src/client/SmartSuggestClient.ts":
/*!******************************************!*\
  !*** ./src/client/SmartSuggestClient.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SmartSuggestClient: () => (/* binding */ SmartSuggestClient)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

/**
 * SmartSuggestClient handles user queries and provides search suggestions
 * by interacting with the SmartSuggest API. It can optionally cache the
 * mapping of `userQuery` to `searchQuery` for future use in SmartQueryClient.
 *
 * @class SmartSuggestClient
 */
class SmartSuggestClient {
    /**
     * Creates an instance of SmartSuggestClient.
     *
     * @param {SmartSuggestClientConfig} config - Configuration object for SmartSuggestClient.
     * @param {ICache} [cache] - Optional cache to store `userQuery` to `searchQuery` mappings.
     * @throws {Error} - Throws an error if the tenant is invalid.
     */
    constructor(config, cache) {
        (0,_util__WEBPACK_IMPORTED_MODULE_0__.isTenantValidOrThrow)(config.tenant);
        this.tenant = config.tenant;
        const split = this.tenant.split(".");
        this.customer = split[0];
        this.channel = split[1];
        this.apiKey = config.apiKey;
        this.cache = cache; // Optional cache initialization
    }
    /**
     * Fetches search suggestions based on the user's query by interacting with the SmartSuggest API.
     * Optionally stores the `userQuery` to `searchQuery` mapping in the cache.
     *
     * @param {string} userQuery - The search query entered by the user.
     * @returns {Promise<Suggestion[]>} - A promise that resolves to an array of suggestions.
     */
    getSuggestions(userQuery) {
        let base64Credentials;
        if (this.apiKey) {
            base64Credentials = btoa(this.customer + ":" + this.apiKey);
        }
        return fetch(`https://saas.searchhub.io/smartsuggest/v4/${this.customer}/${this.channel}?userQuery=${userQuery}`, {
            method: "GET",
            headers: base64Credentials ? {
                'Authorization': `Basic ${base64Credentials}`,
                'Accept': 'application/json',
            } : {
                'Accept': 'application/json',
            }
        })
            .then(response => {
            if (response.status === 404) {
                throw new Error('Resource not found (404). Please check your tenant configuration');
            }
            else if (response.status === 400 && !userQuery) {
                return {
                    suggestions: []
                };
            }
            else if (!response.ok) {
                throw new Error(`Unexpected error: status ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            if (this.cache && data.mappingTarget) {
                const { searchQuery, redirect } = data.mappingTarget;
                this.cache.set(userQuery, { redirect: redirect || null, searchQuery }); // ICache für SmartQueryClient
            }
            return data.suggestions.map((s) => ({
                suggestion: s.suggestion,
                searchQuery: s.payload["mappingTarget.searchQuery"],
                redirect: s.payload["mappingTarget.redirect"] || null,
            }));
        });
    }
}


/***/ }),

/***/ "./src/cookies.ts":
/*!************************!*\
  !*** ./src/cookies.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserCookieAccess: () => (/* binding */ BrowserCookieAccess),
/* harmony export */   ExpressCookieAccess: () => (/* binding */ ExpressCookieAccess),
/* harmony export */   SEARCH_COLLECTOR_SESSION_COOKIE_NAME: () => (/* binding */ SEARCH_COLLECTOR_SESSION_COOKIE_NAME),
/* harmony export */   getBrowserCookie: () => (/* binding */ getBrowserCookie),
/* harmony export */   setBrowserCookie: () => (/* binding */ setBrowserCookie)
/* harmony export */ });
const SEARCH_COLLECTOR_SESSION_COOKIE_NAME = "SearchCollectorSession";
const setBrowserCookie = (name, value, ttlMinutes) => {
    let expires = "";
    if (ttlMinutes) {
        const date = new Date();
        date.setTime(date.getTime() + (ttlMinutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    const sameSite = window.location.hostname === "localhost" ? "" : "; SameSite=None; Secure";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + sameSite;
    return value;
};
const getBrowserCookie = (cname) => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
class BrowserCookieAccess {
    setCookie(name, value) {
        setBrowserCookie(name, value);
    }
    getCookie(name) {
        return getBrowserCookie(name);
    }
}
class ExpressCookieAccess {
    constructor(request, response) {
        /**
         * without this store the cookie wont be available after using setCookie
         * @private
         */
        this.cookieStore = new Map();
        this.request = request;
        this.response = response;
    }
    setCookie(name, value) {
        // Set the cookie on the response with default options
        this.response.cookie(name, value, this.getCookieOptions());
        this.cookieStore.set(name, value);
    }
    getCookieOptions() {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        return {
            expires,
            httpOnly: false,
            secure: "development" === 'production',
            sameSite: 'lax',
        };
    }
    getCookie(name) {
        // Access the cookie from the request object
        const cookieValue = this.request.cookies[name];
        return cookieValue || this.cookieStore.get(name) || ''; // Return empty string if cookie doesn't exist
    }
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateId: () => (/* binding */ generateId),
/* harmony export */   isTenantValidOrThrow: () => (/* binding */ isTenantValidOrThrow)
/* harmony export */ });
function isTenantValidOrThrow(tenant) {
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
    }
    else {
        throw new Error(errMsg);
    }
}
const generateId = () => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


/***/ }),

/***/ "?ab08":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbTestSegment: () => (/* reexport safe */ _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_1__.AbTestSegment),
/* harmony export */   AbTestSegmentManager: () => (/* reexport safe */ _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_1__.AbTestSegmentManager),
/* harmony export */   BrowserClientFactory: () => (/* reexport safe */ _client_ClientFactory__WEBPACK_IMPORTED_MODULE_5__.BrowserClientFactory),
/* harmony export */   BrowserCookieAccess: () => (/* reexport safe */ _cookies__WEBPACK_IMPORTED_MODULE_0__.BrowserCookieAccess),
/* harmony export */   ExpressCookieAccess: () => (/* reexport safe */ _cookies__WEBPACK_IMPORTED_MODULE_0__.ExpressCookieAccess),
/* harmony export */   ExpressJsClientFactory: () => (/* reexport safe */ _client_ClientFactory__WEBPACK_IMPORTED_MODULE_5__.ExpressJsClientFactory),
/* harmony export */   SEARCH_COLLECTOR_SESSION_COOKIE_NAME: () => (/* reexport safe */ _cookies__WEBPACK_IMPORTED_MODULE_0__.SEARCH_COLLECTOR_SESSION_COOKIE_NAME),
/* harmony export */   SimpleMemoryCache: () => (/* reexport safe */ _cache_SimpleMemoryCache__WEBPACK_IMPORTED_MODULE_4__.SimpleMemoryCache),
/* harmony export */   SmartQueryClient: () => (/* reexport safe */ _client_SmartQueryClient__WEBPACK_IMPORTED_MODULE_2__.SmartQueryClient),
/* harmony export */   SmartSuggestClient: () => (/* reexport safe */ _client_SmartSuggestClient__WEBPACK_IMPORTED_MODULE_3__.SmartSuggestClient),
/* harmony export */   generateRandomSegment: () => (/* reexport safe */ _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_1__.generateRandomSegment),
/* harmony export */   getBrowserCookie: () => (/* reexport safe */ _cookies__WEBPACK_IMPORTED_MODULE_0__.getBrowserCookie),
/* harmony export */   setBrowserCookie: () => (/* reexport safe */ _cookies__WEBPACK_IMPORTED_MODULE_0__.setBrowserCookie)
/* harmony export */ });
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cookies */ "./src/cookies.ts");
/* harmony import */ var _abtest_AbTestSegmentManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abtest/AbTestSegmentManager */ "./src/abtest/AbTestSegmentManager.ts");
/* harmony import */ var _client_SmartQueryClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./client/SmartQueryClient */ "./src/client/SmartQueryClient.ts");
/* harmony import */ var _client_SmartSuggestClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./client/SmartSuggestClient */ "./src/client/SmartSuggestClient.ts");
/* harmony import */ var _cache_SimpleMemoryCache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cache/SimpleMemoryCache */ "./src/cache/SimpleMemoryCache.ts");
/* harmony import */ var _client_ClientFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./client/ClientFactory */ "./src/client/ClientFactory.ts");







})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map