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
    CREATE TABLE IF NOT EXISTS app_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL);
`);

const seedStatus = db.prepare("SELECT value FROM app_metadata WHERE key = 'seed_completed'").get();
if (!seedStatus) {
    const insert = db.prepare(`
        INSERT OR IGNORE INTO reading_list (story_id, title, url)
VALUES (?, ?, ?);
    `);
    const saveSeedStatus = db.prepare(`
    INSERT INTO app_metadata (key, value)
    VALUES (?, ?);
`);
    const seedTransaction = db.transaction(() => {
        insert.run(
            20985875,
            "The boring technology behind a one-person Internet company (2018)",
            null
        );
        saveSeedStatus.run("seed_completed", "true");
    });
    seedTransaction();
}


export default db;