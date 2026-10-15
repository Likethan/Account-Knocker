import asyncio
import logging
import datetime
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import User, ConnectedAccount, SecurityReport
from .security_engine import run_risk_analysis
from ..config import settings

logger = logging.getLogger("scheduler_logger")

async def run_periodic_scans():
    """
    Background worker that runs periodic security scans for all users in the system.
    """
    interval_seconds = settings.SCAN_INTERVAL_SECONDS
    logger.info(f"Starting background security scan scheduler with interval of {interval_seconds} seconds...")
    
    while True:
        try:
            logger.info("Executing scheduled security scans for all users...")
            db: Session = SessionLocal()
            try:
                users = db.query(User).all()
                for user in users:
                    # Fetch user's connected accounts
                    accounts = db.query(ConnectedAccount).filter(ConnectedAccount.user_id == user.id).all()
                    
                    # Run risk engine rules
                    score, risk_level, risks, recommendations = run_risk_analysis(accounts, user.resolved_recommendations)
                    
                    # Update user profile states
                    user.defense_score = score
                    if score >= 90:
                        user.defense_level = "Security Master"
                    elif score >= 80:
                        user.defense_level = "Cyber Guardian"
                    elif score >= 65:
                        user.defense_level = "Security Explorer"
                    else:
                        user.defense_level = "Beginner Defender"
                    
                    # Save new Security Report
                    report = SecurityReport(
                        user_id=user.id,
                        security_score=score,
                        risk_level=risk_level,
                        issues_found=risks,
                        recommendations=recommendations,
                        created_at=datetime.datetime.utcnow()
                    )
                    db.add(report)
                    logger.info(f"Automatically scanned user {user.email} (Score: {score}, Level: {user.defense_level})")
                
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(f"Error during scheduled scans: {e}")
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Scheduler exception: {e}")
        
        logger.info(f"Sleeping for {interval_seconds} seconds until next scheduled scan...")
        await asyncio.sleep(interval_seconds)
