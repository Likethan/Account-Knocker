from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
import time

router = APIRouter(prefix="/api/health", tags=["Health"])

START_TIME = time.time()

@router.get("")
def health_check(db: Session = Depends(get_db)):
    """
    Check system health status, database connectivity, and uptime.
    """
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    uptime_seconds = int(time.time() - START_TIME)

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "uptime_seconds": uptime_seconds,
        "service": "Account Knocker API"
    }
