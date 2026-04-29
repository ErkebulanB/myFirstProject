const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
    deadline TEXT NOT NULL,
    note TEXT,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const countRow = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (countRow.count === 0) {
  const seed = db.prepare(`
    INSERT INTO tasks (title, subject, priority, deadline, note, done)
    VALUES (@title, @subject, @priority, @deadline, @note, @done)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) seed.run(item);
  });

  insertMany([
    {
      title: 'Подготовить финальный проект по HCI',
      subject: 'HCI',
      priority: 'high',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      note: 'Проверить все разделы перед защитой',
      done: 0,
    },
    {
      title: 'Проверить доступность интерфейса',
      subject: 'UX аудит',
      priority: 'medium',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      note: 'Контраст, клавиатура, aria-live',
      done: 0,
    },
  ]);
}

module.exports = db;
