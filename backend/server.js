const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

require('./db');

dotenv.config();

const tasksRouter = require('./routes/tasks');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tasks', tasksRouter);
app.use('/api/chat', chatRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден.' });
});

app.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});
