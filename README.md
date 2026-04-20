# RandomQuest - Daily Random Challenge

> Life too boring? RandomQuest gives you a random challenge every day. Complete it and earn achievement badges!

## Features

- **Daily Random Challenge** - Smart recommendations based on preferences (Food/Social/Health/Creative/Learning)
- **Check-in System** - Share your experience after completing challenges
- **Achievement Badges** - Unlock badges by consecutive check-ins (Bronze -> Silver -> Gold -> Diamond)
- **Challenge Square** - See what challenges others are doing
- **Friend PK** - Invite friends to complete challenges together
- **Mood Tracking** - Record mood each check-in, generate monthly challenge reports

## Tech Stack

- Backend: FastAPI + PostgreSQL + SQLAlchemy
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS
- Deploy: Docker + Railway

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key

## License

MIT