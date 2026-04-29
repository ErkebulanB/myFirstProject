const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const SYSTEM_PROMPT =
  'Ты — учебный помощник в приложении Student Planner. Помогай студенту планировать задачи, расставлять приоритеты, учитывать дедлайны и не перегружать день. Отвечай кратко, понятно и по-русски. Не делай медицинских или юридических советов. Если пользователь просит план, предложи реалистичный план из 2–4 шагов. Учитывай список задач, если он передан.';

const getFallbackReply = (message, tasks = []) => {
  const pending = tasks.filter((task) => !task.done).slice(0, 3);
  const taskHint = pending.length
    ? `
Сейчас у тебя в приоритете: ${pending.map((t) => `«${t.title}» (${t.priority})`).join(', ')}.`
    : '\nСейчас начни с самой срочной задачи на сегодня.';

  return `Демо-режим: API-ключ OpenAI не настроен или сервис недоступен.\nТвой запрос: «${message}».${taskHint}\nПлан на сейчас:\n1) Выбери 1 важную задачу на 25–40 минут.\n2) Выполни её без отвлечений.\n3) Сделай короткий перерыв и перейди к следующей.`;
};

router.post('/', async (req, res) => {
  try {
    const { message, tasks = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Поле message обязательно.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    if (!apiKey) {
      return res.json({ reply: getFallbackReply(message, tasks) });
    }

    try {
      const client = new OpenAI({ apiKey });

      const response = await client.responses.create({
        model,
        input: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Сообщение пользователя: ${message}\n\nСписок задач:\n${JSON.stringify(tasks, null, 2)}`,
          },
        ],
      });

      const reply = response.output_text?.trim();
      if (!reply) {
        return res.json({ reply: getFallbackReply(message, tasks) });
      }

      return res.json({ reply });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return res.json({ reply: getFallbackReply(message, tasks) });
    }
  } catch (error) {
    console.error('POST /api/chat error:', error);
    res.status(500).json({ error: 'Не удалось обработать запрос чата.' });
  }
});

module.exports = router;
