import { SQLiteBindValue, SQLiteDatabase } from "expo-sqlite";
import { SQLiteBindNamedParams } from "./types";

export function toSqlNamedParams<T extends Record<string, any>>(
    obj: T,
    mapper?: Partial<Record<keyof T, (value: T[keyof T]) => SQLiteBindValue>>
): SQLiteBindNamedParams<T> {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => {
            return mapper && mapper[k] ? [`$${k}`, mapper[k](v)] : [`$${k}`, v];
        })
    ) as SQLiteBindNamedParams<T>;
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    const result = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version"
    );
    let currentDbVersion = result?.user_version ?? 0;
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        await db.execAsync(initialSql);

        await db.execAsync(dbSeed);

        currentDbVersion = 1;
    }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const initialSql = `
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date_time TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        image_url TEXT,
        category TEXT CHECK (category IN ('conference', 'workshop', 'webinar', 'social', 'sport', 'cultural', 'corporate', 'business', 'other'))
    );
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'client'))
    );
    CREATE TABLE IF NOT EXISTS bookings (
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        date_time TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (event_id, user_id)
    ) WITHOUT ROWID;
`;

const dbSeed = `
    INSERT INTO users (name, email, password, role) VALUES ('Teddy Baha', 'teddy.baha@admin.com', 'password', 'admin');
    INSERT INTO users (name, email, password, role) VALUES ('Guillaume Mpouli', 'guillaume.mpouli@kolagroup.io', 'password', 'client');
    INSERT INTO users (name, email, password, role) VALUES ('Bob Johnson', 'user@example.com', 'password', 'client');
    INSERT INTO users (name, email, password, role) VALUES ('Super Admin', 'admin@admin.com', 'admin', 'admin');

    INSERT INTO events (title, description, date_time, location, capacity, category, image_url) VALUES ('Global Tech Summit 2024', 'Join leaders and innovators discussing the future of technology. Keynotes, workshops, and networking.', '2024-10-15T09:00:00Z', 'Virtual Conference Center', 500, 'conference', 'https://picsum.photos/seed/tsworkshop/400/200');
    INSERT INTO events (title, description, date_time, location, capacity, category, image_url) VALUES ('Mastering Expo for Mobile Dev', 'Learn how to build and deploy high-quality cross-platform apps efficiently using Expo.', '2024-09-20T14:00:00Z', 'Online via Zoom', 150, NULL, NULL);
    INSERT INTO events (title, description, date_time, location, capacity, category, image_url) VALUES ('Tech Community Mixer', 'Casual networking event for developers, designers, and tech enthusiasts. Drinks and snacks provided.', '2024-09-28T18:00:00Z', 'The Corner Pub', 60, 'social', NULL);
    INSERT INTO events (title, description, date_time, location, capacity, category, image_url) VALUES ('Startup Funding Strategies', 'A seminar covering different approaches to securing funding for your startup.', '2024-10-22T11:00:00Z', 'Innovation Center Auditorium', 100, NULL, 'https://picsum.photos/seed/exposdk51/400/200');

    INSERT INTO bookings (event_id, user_id, date_time) VALUES (4, 3, '2024-08-01T10:15:00Z');
    INSERT INTO bookings (event_id, user_id, date_time) VALUES (4, 1, '2024-08-01T11:05:00Z');
    INSERT INTO bookings (event_id, user_id, date_time) VALUES (1, 3, '2024-08-02T09:30:00Z');
    INSERT INTO bookings (event_id, user_id, date_time) VALUES (2, 2, '2024-08-03T14:00:00Z');
`;