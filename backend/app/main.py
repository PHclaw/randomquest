from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.api import auth, quests, checkins, achievements, social
import os

settings = get_settings()

app = FastAPI(title="RandomQuest", description="Daily random challenge app", version="1.0.0")

allowed_origins = [settings.FRONTEND_URL]
if settings.RAILWAY_PUBLIC_DOMAIN:
    allowed_origins.append(f"https://{settings.RAILWAY_PUBLIC_DOMAIN}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(quests.router)
app.include_router(checkins.router)
app.include_router(achievements.router)
app.include_router(social.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
