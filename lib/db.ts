import Database from "better-sqlite3";

const db = new Database("data/news.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS reading_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        url TEXT,
        is_read INTEGER DEFAULT 0,
        note TEXT,
        created_at TEXT
    );
`);

export default db;