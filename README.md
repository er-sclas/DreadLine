# DreadLine

Your delightfully dreadful to-do list manager. DreadLine is a task management app with a twist — instead of politely reminding you about your tasks, it mocks your procrastination and shames you into productivity through a snarky AI chatbot.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)

## Features

- **Snarky AI Chatbot** — Powered by OpenAI, the bot roasts you about overdue tasks, judges your productivity, and adds tasks through natural conversation
- **Smart Task Creation** — Tell the bot "remind me to buy milk tomorrow at 5pm" and it parses the deadline with natural language understanding
- **Task Tracking** — Visual indicators for overdue (red, pulsing) and due-soon tasks, sorted by urgency
- **Dark Theme** — A fittingly ominous aesthetic for your "Burden List"

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Add your API key to `.env`:

```
OPENAI_API_KEY=your-api-key-here
```

### Run

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| AI | Genkit + OpenAI (GPT-4o-mini) |
| Date Parsing | date-fns |
| Icons | Lucide React |

## How It Works

1. **Chat to add tasks** — Describe a task and the bot asks for a deadline if you didn't provide one
2. **Get roasted** — The bot greets you by mocking your overdue tasks and tracks your procrastination
3. **Stay accountable** — Visual urgency indicators and a condescending AI keep you on track

## License

MIT
