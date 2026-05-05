const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const SYSTEM_PROMPT =
  'Ты — учебный помощник в приложении StudyFlow AI. Помогай студенту планировать задачи, расставлять приоритеты, учитывать дедлайны и не перегружать день. Отвечай кратко, понятно и по-русски. Если пользователь просит план, предложи реалистичный план из 2–4 шагов. Учитывай список задач, если он передан.';

const getFallbackReply = (message, tasks = []) => {
  const pending = tasks.filter((task) => !task.done).slice(0, 3);

  const taskHint = pending.length
    ? `\nСейчас у тебя в приоритете: ${pending
        .map((t) => `«${t.title}» (${t.priority})`)
        .join(', ')}.`
    : '\nСейчас начни с самой срочной задачи на сегодня.';

  return `Демо-режим: Groq API-ключ не настроен или сервис временно недоступен.
Твой запрос: «${message}».${taskHint}
План на сейчас:
1) Выбери одну важную задачу на 25–40 минут.
2) Выполни её без отвлечений.
3) Сделай короткий перерыв и перейди к следующей.`;
};

router.post('/', async (req, res) => {
  try {
    const { message, tasks = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Поле message обязательно.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const baseURL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

    if (!apiKey) {
      return res.json({ reply: getFallbackReply(message, tasks) });
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL,
      });

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Сообщение пользователя: ${message}

Список задач:
${JSON.stringify(tasks, null, 2)}`,
          },
        ],
        temperature: 0.4,
      });

      const reply = response.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        return res.json({ reply: getFallbackReply(message, tasks) });
      }

      return res.json({ reply });
    } catch (apiError) {
      console.error('Groq API error:', apiError);
      return res.json({ reply: getFallbackReply(message, tasks) });
    }
  } catch (error) {
    console.error('POST /api/chat error:', error);
    res.status(500).json({ error: 'Не удалось обработать запрос чата.' });
  }
});

module.exports = router;