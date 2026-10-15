import pytest
from app.auth_service import hash_password, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    raw_password = "SuperSecurePassword123!"
    hashed = hash_password(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword456!", hashed) is False

def test_jwt_token_creation_and_decoding():
    data = {"sub": "likethan@example.com", "user_id": 42}
    token = create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 20

    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == "likethan@example.com"
    assert payload.get("user_id") == 42

def test_invalid_jwt_token():
    invalid_token = "invalid.token.string"
    payload = decode_access_token(invalid_token)
    assert payload is None
