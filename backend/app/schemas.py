from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime.datetime
    defense_level: str
    defense_score: int
    resolved_recommendations: List[str] = []

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse


# --- Account Schemas ---
class AccountConnect(BaseModel):
    platform: str
    oauth_token: Optional[str] = None
    status: Optional[str] = "connected"

class AccountResponse(BaseModel):
    id: int
    platform: str
    status: str
    connected_date: datetime.datetime
    last_checked: datetime.datetime

    class Config:
        from_attributes = True


# --- Security Analysis Schemas ---
class RiskItemSchema(BaseModel):
    type: str  # critical, medium, low
    title: str
    description: str

class RecommendationSchema(BaseModel):
    id: str
    platform: str
    title: str
    description: str
    priority: str  # high, medium, low
    fixed: bool = False

class AnalyzeRequest(BaseModel):
    accounts: Optional[List[dict]] = None

class SecurityReportResponse(BaseModel):
    id: int
    security_score: int
    risk_level: str
    issues_found: List[RiskItemSchema]
    recommendations: List[RecommendationSchema]
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- AI Chat Schemas ---
class ChatMessageSchema(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    response: str
