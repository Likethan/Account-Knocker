from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import User, ConnectedAccount, SecurityReport
from ..schemas import SecurityReportResponse, AnalyzeRequest
from ..auth_service import get_current_user
from ..services.security_engine import run_risk_analysis

router = APIRouter(prefix="/api", tags=["security"])

@router.post("/analyze", response_model=SecurityReportResponse)
def analyze_accounts(payload: AnalyzeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Fetch user's connected accounts
    accounts = db.query(ConnectedAccount).filter(ConnectedAccount.user_id == current_user.id).all()
    
    # 2. Run risk engine rules
    score, risk_level, risks, recommendations = run_risk_analysis(accounts, current_user.resolved_recommendations)

    # 3. Update user profile states
    current_user.defense_score = score
    
    # Determine user title badge based on score
    if score >= 90:
        current_user.defense_level = "Security Master"
    elif score >= 80:
        current_user.defense_level = "Cyber Guardian"
    elif score >= 65:
        current_user.defense_level = "Security Explorer"
    else:
        current_user.defense_level = "Beginner Defender"

    # 4. Save Security Report to database
    report = SecurityReport(
        user_id=current_user.id,
        security_score=score,
        risk_level=risk_level,
        issues_found=risks,
        recommendations=recommendations,
        created_at=datetime.datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return report

@router.get("/reports", response_model=List[SecurityReportResponse])
def get_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(SecurityReport).filter(
        SecurityReport.user_id == current_user.id
    ).order_by(SecurityReport.created_at.desc()).all()
    
    # If no report exists, trigger an automatic initial audit
    if not reports:
        accounts = db.query(ConnectedAccount).filter(ConnectedAccount.user_id == current_user.id).all()
        score, risk_level, risks, recommendations = run_risk_analysis(accounts, current_user.resolved_recommendations)
        
        report = SecurityReport(
            user_id=current_user.id,
            security_score=score,
            risk_level=risk_level,
            issues_found=risks,
            recommendations=recommendations,
            created_at=datetime.datetime.utcnow()
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        reports = [report]

    return reports

@router.get("/score/history")
def get_score_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch historical score metrics
    reports = db.query(SecurityReport).filter(
        SecurityReport.user_id == current_user.id
    ).order_by(SecurityReport.created_at.asc()).all()

    # Generate custom chronological timeline points
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month_idx = datetime.datetime.utcnow().month - 1
    
    timeline = []
    
    if len(reports) <= 1:
        # Generate a default progressive mock timeline for visualization
        starting_score = 65
        for i in range(4):
            idx = (current_month_idx - 3 + i) % 12
            timeline.append({
                "month": months[idx],
                "score": starting_score + (i * 5)
            })
        # Add current real score as the final timeline point
        timeline.append({
            "month": months[current_month_idx],
            "score": current_user.defense_score
        })
    else:
        # Use actual user historical database points
        for i, rep in enumerate(reports[-6:]):  # last 6 reports
            timeline.append({
                "month": rep.created_at.strftime("%b %d"),
                "score": rep.security_score
            })

    return timeline

@router.post("/recommendations/{recommendation_id}/resolve")
def resolve_recommendation(recommendation_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resolved = current_user.resolved_recommendations or []
    if recommendation_id not in resolved:
        new_resolved = list(resolved)
        new_resolved.append(recommendation_id)
        current_user.resolved_recommendations = new_resolved
        db.commit()
    return {"message": f"Recommendation {recommendation_id} marked as resolved"}
