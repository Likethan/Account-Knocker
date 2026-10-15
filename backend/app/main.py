from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, accounts, security, chat, oauth, health
import asyncio
from .services.scheduler import run_periodic_scans

# Create database tables on startup
Base.metadata.create_all(bind=engine)

from fastapi import Request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api_logger")

app = FastAPI(
    title="Account Knocker API",
    description="AI Digital Safety Assistant - Backend Services",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    # Run the background task without blocking startup
    asyncio.create_task(run_periodic_scans())

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"LOGGED REQUEST: {request.method} {request.url}")
    logger.info(f"LOGGED HEADERS: {dict(request.headers)}")
    try:
        response = await call_next(request)
        logger.info(f"LOGGED RESPONSE STATUS: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"LOGGED REQUEST EXCEPTION: {e}", exc_info=True)
        raise e

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(security.router)
app.include_router(chat.router)
app.include_router(oauth.router)
app.include_router(health.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Account Knocker API",
        "assistant": "Knock AI",
        "version": "1.0.0"
    }
