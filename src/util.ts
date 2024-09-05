export function isTenantValidOrThrow(tenant: string) {
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
    } else {
        throw new Error(errMsg);
    }
}

export const generateId = () => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}