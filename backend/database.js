const Database = require("better-sqlite3")

const db = new Database("database.db")

db.prepare(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY,
 username TEXT,
 password TEXT
)
`).run()

db.prepare(`
CREATE TABLE IF NOT EXISTS results(
 id INTEGER PRIMARY KEY,
 username TEXT,
 correct INTEGER,
 time INTEGER
)
`).run()

module.exports = db