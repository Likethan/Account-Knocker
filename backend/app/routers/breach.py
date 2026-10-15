from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from ..services.breach_checker import DataBreachChecker

router = APIRouter(prefix="/api/breach", tags=["Breach Intelligence"])

class EmailCheckRequest(BaseModel):
    email: str

class PasswordCheckRequest(BaseModel):
    password: str

@router.post("/check-email")
def check_email_exposure(payload: EmailCheckRequest):
    """
    Checks if an email appears in known public security incidents or breaches.
    """
    if not payload.email or "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    return DataBreachChecker.check_email_exposure(payload.email)

@router.post("/check-password")
def check_password_strength(payload: PasswordCheckRequest):
    """
    Analyzes password strength, entropy metrics, and defense against brute forcing.
    """
    if not payload.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    return DataBreachChecker.check_password_entropy(payload.password)
