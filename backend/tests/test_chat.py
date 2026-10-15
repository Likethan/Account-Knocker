import pytest
from app.ai.agent import ask_gemini_agent

def test_mock_gemini_fallback():
    # When no API key is provided, the mock rules respond deterministically
    system_ctx = {
        "score": 60,
        "risk_level": "Medium",
        "accounts": [{"platform": "Google", "status": "risk"}],
        "history": []
    }
    
    response = ask_gemini_agent("How do I improve my security score?", context=system_ctx)
    assert response is not None
    assert isinstance(response, str)
    assert len(response) > 20

def test_mfa_inquiry_fallback():
    system_ctx = {
        "score": 85,
        "risk_level": "Safe",
        "accounts": [],
        "history": []
    }
    response = ask_gemini_agent("What is MFA and why should I care?", context=system_ctx)
    assert response is not None
    assert "MFA" in response or "factor" in response.lower()
