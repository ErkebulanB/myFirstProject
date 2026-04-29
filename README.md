# StudyFlow AI

StudyFlow AI — современное SaaS-приложение для студентов и образовательных организаций: управление задачами, дедлайнами и учебной нагрузкой с AI-помощником.

## Стек
- Frontend: React + Vite + CSS
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- AI: OpenAI API через backend endpoint

## Возможности
- Dashboard: ключевые метрики, фокус дня, ближайшие дедлайны
- Tasks: создание, удаление, отметка выполнения, фильтры по статусу и приоритету
- AI Assistant: чат с подсказками и fallback-режимом
- Calendar: недельный список дедлайнов
- Analytics: прогресс-бары по выполнению, приоритетам и просрочкам
- Settings: статичный экран настроек

## HCI в дизайне (без учебных блоков в UI)
В интерфейсе применены практические HCI-принципы: контраст, крупные интерактивные элементы, доступные label, aria-live статусы, видимый фокус, понятная обратная связь и адаптивная верстка.

## Запуск
### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
```

## OpenAI
В `backend/.env`:
```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4.1-mini
PORT=3001
```

Если ключ отсутствует, чат продолжает работать в fallback-режиме.
