from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import User, ConnectedAccount
from ..schemas import AccountResponse, AccountConnect
from ..auth_service import get_current_user

router = APIRouter(prefix="/api", tags=["accounts"])

# Standard platforms we want to audit
SUPPORTED_PLATFORMS = ["google", "spotify", "discord", "github"]

def ensure_user_accounts(user_id: int, db: Session):
    """Utility to pre-populate accounts if they do not exist in database yet."""
    existing_platforms = [acc.platform for acc in db.query(ConnectedAccount).filter(ConnectedAccount.user_id == user_id).all()]
    
    for platform in SUPPORTED_PLATFORMS:
        if platform not in existing_platforms:
            new_acc = ConnectedAccount(
                user_id=user_id,
                platform=platform,
                status="disconnected",
                connected_date=datetime.datetime.utcnow(),
                last_checked=datetime.datetime.utcnow()
            )
            db.add(new_acc)
    db.commit()

import subprocess

def is_similar_email(email1: str, email2: str) -> bool:
    if not email1 or not email2:
        return False
    e1 = email1.lower().strip()
    e2 = email2.lower().strip()
    if e1 == e2:
        return True
    p1 = e1.split('@')[0]
    p2 = e2.split('@')[0]
    if p1 in p2 or p2 in p1:
        return True
    s1, s2 = set(p1), set(p2)
    intersection = s1.intersection(s2)
    union = s1.union(s2)
    if len(union) > 0 and (len(intersection) / len(union)) > 0.8:
        return True
    return False

def check_local_github_status(user_email: str) -> str:
    """Check if GitHub is authenticated on the local platform with the user's email."""
    try:
        result = subprocess.run(
            ["git", "config", "user.email"],
            capture_output=True,
            text=True,
            shell=True
        )
        git_email = result.stdout.strip()
        if git_email and is_similar_email(git_email, user_email):
            return "risk"
        return "disconnected"
    except Exception:
        return "disconnected"

def check_local_discord_status() -> str:
    """Check if Discord is active/running on the local platform."""
    try:
        result = subprocess.run(
            ["tasklist", "/FI", "IMAGENAME eq Discord.exe"],
            capture_output=True,
            text=True,
            shell=True
        )
        if "Discord.exe" in result.stdout:
            return "warning"
        return "disconnected"
    except Exception:
        return "disconnected"

@router.get("/accounts", response_model=List[AccountResponse])
def get_accounts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_user_accounts(current_user.id, db)
    
    # Real-time platform checks
    github_status = check_local_github_status(current_user.email)
    discord_status = check_local_discord_status()
    
    # Update GitHub status in DB
    github_acc = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == current_user.id,
        ConnectedAccount.platform == "github"
    ).first()
    if github_acc:
        github_status = check_local_github_status(current_user.email)
        if github_acc.status != "disconnected":
            # Keep it connected if it was already connected, but update if threat is detected.
            if github_status == "risk":
                github_acc.status = "risk"
            else:
                if github_acc.status not in ["connected", "risk"]:
                    github_acc.status = "connected"
        else:
            if github_status == "risk":
                github_acc.status = "risk"
        github_acc.last_checked = datetime.datetime.utcnow()
        
    # Update Discord status in DB
    discord_acc = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == current_user.id,
        ConnectedAccount.platform == "discord"
    ).first()
    if discord_acc:
        discord_status = check_local_discord_status()
        if discord_acc.status != "disconnected":
            # Keep it connected, but update if warning is detected.
            if discord_status == "warning":
                discord_acc.status = "warning"
            else:
                if discord_acc.status not in ["connected", "warning"]:
                    discord_acc.status = "connected"
        else:
            if discord_status == "warning":
                discord_acc.status = "warning"
        discord_acc.last_checked = datetime.datetime.utcnow()
        
    # Update Google status in DB (connected if they logged in with a gmail address)
    google_acc = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == current_user.id,
        ConnectedAccount.platform == "google"
    ).first()
    if google_acc:
        if "gmail.com" in current_user.email.lower():
            google_acc.status = "connected"
        else:
            google_acc.status = "disconnected"
        google_acc.last_checked = datetime.datetime.utcnow()

    db.commit()
    
    accounts = db.query(ConnectedAccount).filter(ConnectedAccount.user_id == current_user.id).all()
    return accounts

@router.post("/accounts/mock-connect")
def mock_connect(payload: AccountConnect, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    platform = payload.platform.lower()
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=400, detail=f"Platform {platform} not supported.")

    ensure_user_accounts(current_user.id, db)
    
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == current_user.id,
        ConnectedAccount.platform == platform
    ).first()

    if not account:
        account = ConnectedAccount(user_id=current_user.id, platform=platform)
        db.add(account)

    # Mocking status results: some are warnings, some risk, some safe
    status_map = {
        "google": "connected",
        "spotify": "connected",
        "discord": "warning",
        "github": "risk"
    }

    account.status = status_map.get(platform, "connected")
    account.connected_date = datetime.datetime.utcnow()
    account.last_checked = datetime.datetime.utcnow()
    
    db.commit()
    return {"message": f"Successfully mock connected {platform}", "status": account.status}

@router.delete("/connect/{platform}")
def disconnect_platform(platform: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    platform = platform.lower()
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == current_user.id,
        ConnectedAccount.platform == platform
    ).first()

    if not account or account.status == "disconnected":
        raise HTTPException(status_code=404, detail=f"No active connection found for {platform}")

    account.status = "disconnected"
    
    # Clean up resolved recommendations associated with this platform
    resolved = current_user.resolved_recommendations or []
    new_resolved = [r for r in resolved if not r.startswith(f"{platform}_")]
    current_user.resolved_recommendations = new_resolved
    
    db.commit()
    return {"message": f"Disconnected {platform} successfully"}
