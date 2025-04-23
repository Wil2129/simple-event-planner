import { CamelizeKeys, SnakifyKeys } from "./types";

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function validateEmail(email: string): boolean {
    const re = new RegExp(
        "^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$",
        "i"
    );
    return re.test(email);
}

export function snakeToCamelKeys<T>(obj: SnakifyKeys<T>): T {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k.toLowerCase().replace(/(_\w)/g, (m) => m[1].toUpperCase()),
            v,
        ])
    ) as T;
}

export function camelToSnakeKeys<T>(obj: CamelizeKeys<T>): T {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            toSnakeCase(k),
            v,
        ])
    ) as T;
}

export function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};
