from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from ..auth_service import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api", tags=["authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered."
        )

    # Hash password and store user
    password_hash = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=password_hash,
        defense_level="Beginner Defender",
        defense_score=100
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate token
    token = create_access_token(data={"sub": new_user.email})
    return {"token": token, "user": new_user}

@router.post("/login", response_model=TokenResponse)
async def login(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    email = None
    password = None

    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("email")
            password = body.get("password")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect login format. Email and password are required."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # Generate token
    token = create_access_token(data={"sub": user.email})
    return {"token": token, "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
