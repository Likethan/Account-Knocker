from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    defense_level = Column(String, default="Beginner Defender")
    defense_score = Column(Integer, default=100)
    resolved_recommendations = Column(JSON, default=list)

    # Relationships
    accounts = relationship("ConnectedAccount", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("SecurityReport", back_populates="user", cascade="all, delete-orphan")
    ai_memories = relationship("AIMemory", back_populates="user", cascade="all, delete-orphan")


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)  # google, spotify, discord, github
    oauth_token = Column(String, nullable=True)  # stored access/refresh tokens
    status = Column(String, default="connected")  # connected, disconnected, warning, risk
    connected_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_checked = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="accounts")


class SecurityReport(Base):
    __tablename__ = "security_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    security_score = Column(Integer, default=100)
    risk_level = Column(String, default="Safe")  # Safe, Medium, Critical
    issues_found = Column(JSON, nullable=True)  # JSON list of risks
    recommendations = Column(JSON, nullable=True)  # JSON list of actionable items
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="reports")


class AIMemory(Base):
    __tablename__ = "ai_memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(String, nullable=False)
    response = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="ai_memories")
