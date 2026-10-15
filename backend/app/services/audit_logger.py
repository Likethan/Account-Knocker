import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

logger = logging.getLogger("audit_logger")

class SecurityAuditLogger:
    """
    Structured security event logger for auditing authentication,
    risk evaluation, and mitigation actions.
    """
    @staticmethod
    def log_event(
        event_type: str,
        user_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        severity: str = "INFO"
    ):
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "severity": severity,
            "details": details or {}
        }
        log_message = json.dumps(payload)
        if severity == "CRITICAL" or severity == "ERROR":
            logger.error(f"[AUDIT] {log_message}")
        elif severity == "WARNING":
            logger.warning(f"[AUDIT] {log_message}")
        else:
            logger.info(f"[AUDIT] {log_message}")
        return payload
