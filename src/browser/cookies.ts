export const SEARCH_COLLECTOR_SESSION_COOKIE_NAME = "SearchCollectorSession";

export const setBrowserCookie = (name: string, value: string, ttlMinutes ?: number): string => {
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

export interface CookieAccess {
    setCookie(name: string, value: string): void;

    getCookie(name: string): string;
}