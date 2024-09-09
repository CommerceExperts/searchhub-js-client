import {Request, Response} from 'express';
import {CookieOptions} from "express-serve-static-core";


export const SEARCH_COLLECTOR_SESSION_COOKIE_NAME = "SearchCollectorSession";
const MINUTES_ONE_YEAR = 525960;

export const setBrowserCookie = (name: string, value: string, ttlMinutes: number = MINUTES_ONE_YEAR): string => {
    let expires = "";

    if (ttlMinutes) {
        const date = new Date();
        date.setTime(date.getTime() + (ttlMinutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    const sameSite = window.location.hostname === "localhost" ? "" : "; SameSite=None; Secure";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + sameSite;
    return value;
}

export const getBrowserCookie = (cname: string): string | "" => {
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
}

export class BrowserCookieAccess implements CookieAccess {
    setCookie(name: string, value: string): void {
        setBrowserCookie(name, value);
    }

    getCookie(name: string): string {
        return getBrowserCookie(name);
    }
}


export class ExpressCookieAccess implements CookieAccess {
    private readonly request;
    private readonly response;
    /**
     * without this store the cookie wont be available after using setCookie
     * @private
     */
    private readonly cookieStore = new Map<string, string>();

    constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }

    setCookie(name: string, value: string): void {
        // Set the cookie on the response with default options
        this.response.cookie(name, value, this.getCookieOptions());
        this.cookieStore.set(name, value);
    }

    getCookieOptions(): CookieOptions {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        return {
            expires,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        };
    }

    getCookie(name: string): string {
        // Access the cookie from the request object
        const cookieValue = this.request.cookies[name];
        return cookieValue || this.cookieStore.get(name) || '';  // Return empty string if cookie doesn't exist
    }
}

export interface CookieAccess {
    setCookie(name: string, value: string): void;

    getCookie(name: string): string;
}