import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

/**
 * Initialize the database and create tables if they don't exist
 */
export function initDatabase() {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'app.db');
    db = new Database(dbPath);

    // Create accounts table
    db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            platform TEXT NOT NULL,
            auth_key TEXT NOT NULL,
            time_left INTEGER NOT NULL DEFAULT 0
        )
    `);

    // Create global_settings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS global_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL
        )
    `);

    // Insert default settings if they don't exist
    const defaultSettings = [
        { key: 'dashboard_header_text', value: 'Stream Marathon Timer Admin Dashboard' },
        { key: 'welcome_message', value: 'Welcome to the admin panel' },
    ];

    const insert = db.prepare('INSERT OR IGNORE INTO global_settings (key, value) VALUES (?, ?)');
    const insertMany = db.transaction((settings) => {
        for (const setting of settings) {
            insert.run(setting.key, setting.value);
        }
    });
    insertMany(defaultSettings);

    console.log('Database initialized successfully');
    return db;
}

/**
 * Get all accounts
 */
export function getAllAccounts() {
    const stmt = db.prepare('SELECT id, name, platform, auth_key, time_left FROM accounts');
    return stmt.all();
}

/**
 * Get a specific setting by key
 */
export function getSetting(key) {
    const stmt = db.prepare('SELECT value FROM global_settings WHERE key = ?');
    const result = stmt.get(key);
    return result ? result.value : null;
}

/**
 * Get all settings
 */
export function getAllSettings() {
    const stmt = db.prepare('SELECT id, key, value FROM global_settings');
    return stmt.all();
}

/**
 * Update or insert a setting
 */
export function setSetting(key, value) {
    const stmt = db.prepare('INSERT INTO global_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?');
    return stmt.run(key, value, value);
}

/**
 * Update account settings
 */
export function updateAccount(id, name, platform, authKey, timeLeft) {
    const stmt = db.prepare('UPDATE accounts SET name = ?, platform = ?, auth_key = ?, time_left = ? WHERE id = ?');
    return stmt.run(name, platform, authKey, timeLeft, id);
}

/**
 * Create a new account
 */
export function createAccount(name, platform, authKey, timeLeft) {
    const stmt = db.prepare('INSERT INTO accounts (name, platform, auth_key, time_left) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, platform, authKey, timeLeft);
    return result.lastInsertRowid;
}

/**
 * Get account by ID
 */
export function getAccountById(id) {
    const stmt = db.prepare('SELECT id, name, platform, auth_key, time_left FROM accounts WHERE id = ?');
    return stmt.get(id);
}
