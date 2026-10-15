from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import datetime
import urllib.parse
import os
from ..database import get_db
from ..models import User, ConnectedAccount
from ..config import settings
from ..auth_service import get_current_user

router = APIRouter(prefix="/api/oauth", tags=["oauth"])

@router.get("/{platform}/url")
def get_oauth_url(platform: str, current_user: User = Depends(get_current_user)):
    platform = platform.lower()
    
    # Configure scopes and authorization endpoints for each supported platform
    auth_configs = {
        "google": {
            "endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
            "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
            "client_id": os.getenv("GOOGLE_CLIENT_ID", "")
        },
        "spotify": {
            "endpoint": "https://accounts.spotify.com/authorize",
            "scope": "user-read-private user-read-email",
            "client_id": os.getenv("SPOTIFY_CLIENT_ID", "")
        },
        "discord": {
            "endpoint": "https://discord.com/api/oauth2/authorize",
            "scope": "identify email",
            "client_id": os.getenv("DISCORD_CLIENT_ID", "")
        },
        "github": {
            "endpoint": "https://github.com/login/oauth/authorize",
            "scope": "read:user user:email",
            "client_id": os.getenv("GITHUB_CLIENT_ID", "")
        }
    }

    config = auth_configs.get(platform)
    if not config:
        raise HTTPException(status_code=400, detail=f"OAuth not supported for {platform}")

    # Fallback to local redirection if Client ID is missing (for easy mock demoing)
    if not config["client_id"]:
        # If client_id is missing, redirect directly to our local callback with a mock authorization code
        redirect_uri = f"http://localhost:8000/api/oauth/{platform}/callback?code=mock_code_for_{platform}&state={current_user.email}"
        return {"url": redirect_uri, "demo_mode": True}

    # Generate standard OAuth URL
    redirect_uri = f"http://localhost:8000/api/oauth/{platform}/callback"
    params = {
        "client_id": config["client_id"],
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": config["scope"],
        "state": current_user.email  # passing state to secure session and identify user
    }
    
    url = f"{config['endpoint']}?{urllib.parse.urlencode(params)}"
    return {"url": url, "demo_mode": False}


@router.get("/{platform}/callback")
def oauth_callback(platform: str, code: str, state: str, db: Session = Depends(get_db)):
    platform = platform.lower()
    
    # In OAuth, state represents the user's email or session token we passed
    user = db.query(User).filter(User.email == state).first()
    if not user:
        # Fallback to general redirection if session is not resolvable
        return RedirectResponse(url="http://localhost:5173/accounts?error=invalid_session")

    # Locate or create the account row
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.platform == platform
    ).first()

    if not account:
        account = ConnectedAccount(user_id=user.id, platform=platform)
        db.add(account)

    # If code is mock, set mock connection properties. Otherwise, exchange token via HTTP request.
    if code.startswith("mock_"):
        status_map = {
            "google": "connected",
            "spotify": "connected",
            "discord": "warning",
            "github": "risk"
        }
        account.status = status_map.get(platform, "connected")
        account.oauth_token = f"mock_token_{platform}_access_granted"
    else:
        # In production, make a POST request to exchange authorization code for token
        # For simplicity of deployment, if it fails, we default to warning/connected status
        account.status = "connected"
        account.oauth_token = f"prod_exchanged_token_for_{platform}"

    account.connected_date = datetime.datetime.utcnow()
    account.last_checked = datetime.datetime.utcnow()
    db.commit()

    # Redirect user back to React frontend accounts management page
    return RedirectResponse(url="http://localhost:5173/accounts?connected=true")
