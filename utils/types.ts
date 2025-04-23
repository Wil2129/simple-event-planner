
export const eventCategories = [
    "conference",
    "workshop",
    "webinar",
    "social",
    "sport",
    "cultural",
    "corporate",
    "business",
    "other",
] as const;

export type EventCategory = (typeof eventCategories)[number];

export interface UpcomingEvent {
    id: string;
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    capacity: number;
    imageUrl?: string;
    category?: EventCategory;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "client" | "admin" | "guest";
}

export interface Booking {
    eventId: string;
    userId: string;
    dateTime: Date;
}


export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
    ? `${T}${SnakeToCamel<Capitalize<U>>}`
    : S;

export type CamelizeKeys<T> = {
    [K in keyof T as K extends string ? SnakeToCamel<K> : K]: T[K];
};

type SnakeCase<S extends string> = S extends `${infer R}${infer T}`
    ? T extends Lowercase<T>
    ? S
    : T extends Capitalize<T>
    ? T extends `_${infer U}`
    ? `${Lowercase<R>}_${SnakeCase<Uncapitalize<U>>}`
    : `${Lowercase<R>}_${SnakeCase<Uncapitalize<T>>}`
    : `${Lowercase<R>}${SnakeCase<T>}`
    : Lowercase<S>;

export type SnakifyKeys<T> = {
    [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K];
};
