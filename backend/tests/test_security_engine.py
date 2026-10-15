import pytest
from app.services.security_engine import run_risk_analysis
from app.models import ConnectedAccount

def test_empty_accounts_analysis():
    score, risk_level, risks, recommendations = run_risk_analysis([])
    assert score == 100
    assert risk_level == "Safe"
    assert len(risks) == 0
    assert len(recommendations) == 1
    assert recommendations[0]["id"] == "init_connect"

def test_clean_connected_account():
    acc = ConnectedAccount(platform="Google", status="connected", user_id=1)
    score, risk_level, risks, recommendations = run_risk_analysis([acc])
    assert score == 100  # Max bounded at 100
    assert risk_level == "Safe"
    assert len(risks) == 0

def test_risk_account_github_deductions():
    acc = ConnectedAccount(platform="github", status="risk", user_id=1)
    # github risk: -15 (mfa), -15 (sessions) -> score = 70
    score, risk_level, risks, recommendations = run_risk_analysis([acc])
    assert score == 70
    assert risk_level == "Good"
    assert len(risks) == 2

def test_remediation_resolution():
    acc = ConnectedAccount(platform="github", status="risk", user_id=1)
    # Resolving github_mfa restores 15 points -> score 85 -> "Safe"
    score, risk_level, risks, recommendations = run_risk_analysis([acc], resolved_recommendations=["github_mfa"])
    assert score == 85
    assert risk_level == "Safe"
    assert len(risks) == 1
