from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import User, ConnectedAccount, SecurityReport, AIMemory
from ..schemas import ChatMessageSchema, ChatMessageResponse, ChatResponse
from ..auth_service import get_current_user
from ..ai.agent import SecurityAssistantAgent

router = APIRouter(prefix="/api", tags=["chat"])
agent = SecurityAssistantAgent()

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(payload: ChatMessageSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message_text = payload.message
    if not message_text.strip():
        raise HTTPException(status_code=400, detail="Empty message not allowed.")

    # 1. Fetch user connected accounts & reports
    accounts = db.query(ConnectedAccount).filter(ConnectedAccount.user_id == current_user.id).all()
    latest_report = db.query(SecurityReport).filter(
        SecurityReport.user_id == current_user.id
    ).order_by(SecurityReport.created_at.desc()).first()

    # 2. Fetch recent conversation memory
    db_history = db.query(AIMemory).filter(
        AIMemory.user_id == current_user.id
    ).order_by(AIMemory.timestamp.asc()).all()

    chat_history = [{"message": m.message, "response": m.response} for m in db_history]

    # 3. Call agent
    ai_response = agent.generate_response(message_text, chat_history, accounts, latest_report)

    # 4. Save exchange to memory table
    memory_entry = AIMemory(
        user_id=current_user.id,
        message=message_text,
        response=ai_response,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(memory_entry)
    db.commit()

    return {"response": ai_response}

@router.get("/chat/history", response_model=List[ChatMessageResponse])
def get_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_memories = db.query(AIMemory).filter(
        AIMemory.user_id == current_user.id
    ).order_by(AIMemory.timestamp.asc()).all()

    # We map single history rows into a flat stream of (user message, ai response)
    chat_stream = []
    for m in db_memories:
        chat_stream.append(
            ChatMessageResponse(
                id=f"u_{m.id}",
                sender="user",
                text=m.message,
                timestamp=m.timestamp
            )
        )
        chat_stream.append(
            ChatMessageResponse(
                id=f"a_{m.id}",
                sender="ai",
                text=m.response,
                timestamp=m.timestamp
            )
        )

    return chat_stream
