import pytest
from app.models import ConnectedAccount

def test_connected_account_model_instantiation():
    account = ConnectedAccount(
        user_id=1,
        platform="Discord",
        status="warning",
        username="SecurityHero#1234"
    )
    assert account.platform == "Discord"
    assert account.status == "warning"
    assert account.username == "SecurityHero#1234"

def test_account_status_types():
    valid_statuses = ["connected", "warning", "risk", "disconnected"]
    for status in valid_statuses:
        acc = ConnectedAccount(platform="Spotify", status=status, user_id=1)
        assert acc.status in valid_statuses
