const express = require('express');
const db = require('../db');

const router = express.Router();
const allowedPriorities = new Set(['low', 'medium', 'high']);

const taskSelect = `
  SELECT id, title, subject, priority, deadline, note, done, created_at, updated_at
  FROM tasks
`;

router.get('/', (req, res) => {
  try {
    const rows = db
      .prepare(
        `${taskSelect}
         ORDER BY done ASC, deadline ASC, created_at DESC`
      )
      .all()
      .map((task) => ({ ...task, done: Boolean(task.done) }));

    res.json(rows);
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    res.status(500).json({ error: 'Не удалось получить задачи.' });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, subject, priority, deadline, note = '' } = req.body;

    if (!title || !subject || !priority || !deadline) {
      return res.status(400).json({ error: 'Поля title, subject, priority и deadline обязательны.' });
    }

    if (!allowedPriorities.has(priority)) {
      return res.status(400).json({ error: 'priority должен быть одним из: low, medium, high.' });
    }

    const insert = db.prepare(`
      INSERT INTO tasks (title, subject, priority, deadline, note, done)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    const result = insert.run(title.trim(), subject.trim(), priority, deadline, note.trim());

    const created = db
      .prepare(`${taskSelect} WHERE id = ?`)
      .get(result.lastInsertRowid);

    res.status(201).json({ ...created, done: Boolean(created.done) });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    res.status(500).json({ error: 'Не удалось создать задачу.' });
  }
});

router.patch('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Некорректный id задачи.' });
    }

    const current = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Задача не найдена.' });
    }

    const next = {
      title: req.body.title ?? current.title,
      subject: req.body.subject ?? current.subject,
      priority: req.body.priority ?? current.priority,
      deadline: req.body.deadline ?? current.deadline,
      note: req.body.note ?? current.note,
      done: typeof req.body.done === 'boolean' ? (req.body.done ? 1 : 0) : current.done,
    };

    if (!next.title || !next.subject || !next.priority || !next.deadline) {
      return res.status(400).json({ error: 'Поля title, subject, priority и deadline не должны быть пустыми.' });
    }

    if (!allowedPriorities.has(next.priority)) {
      return res.status(400).json({ error: 'priority должен быть одним из: low, medium, high.' });
    }

    db.prepare(`
      UPDATE tasks
      SET title = ?, subject = ?, priority = ?, deadline = ?, note = ?, done = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      String(next.title).trim(),
      String(next.subject).trim(),
      next.priority,
      next.deadline,
      String(next.note || '').trim(),
      next.done,
      id
    );

    const updated = db.prepare(`${taskSelect} WHERE id = ?`).get(id);
    res.json({ ...updated, done: Boolean(updated.done) });
  } catch (error) {
    console.error('PATCH /api/tasks/:id error:', error);
    res.status(500).json({ error: 'Не удалось обновить задачу.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Некорректный id задачи.' });
    }

    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Задача не найдена.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('DELETE /api/tasks/:id error:', error);
    res.status(500).json({ error: 'Не удалось удалить задачу.' });
  }
});

module.exports = router;
