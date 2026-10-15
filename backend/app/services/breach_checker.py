import hashlib
from typing import Dict, Any, List

class DataBreachChecker:
    """
    Simulated & HIBP-compatible credential leak analysis engine.
    Audits email addresses and password hashes against known compromise corpuses.
    """
    KNOWN_EXPOSURES = {
        "test@example.com": [
            {"breach_name": "Canva Incident", "year": 2019, "compromised_data": ["Emails", "Passwords", "Names"]},
            {"breach_name": "Adobe Breach", "year": 2013, "compromised_data": ["Passwords", "Usernames"]}
        ],
        "demo@gmail.com": [
            {"breach_name": "LinkedIn Scrape", "year": 2021, "compromised_data": ["Emails", "Phone numbers", "Workplace"]}
        ]
    }

    @classmethod
    def check_email_exposure(cls, email: str) -> Dict[str, Any]:
        normalized = email.strip().lower()
        breaches = cls.KNOWN_EXPOSURES.get(normalized, [])
        return {
            "query": normalized,
            "is_breached": len(breaches) > 0,
            "breach_count": len(breaches),
            "breaches": breaches,
            "advice": "Enable MFA and rotate passwords immediately on any compromised services." if breaches else "No known public exposure records detected."
        }

    @staticmethod
    def check_password_entropy(password: str) -> Dict[str, Any]:
        length = len(password)
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_symbol = any(not c.isalnum() for c in password)

        strength_points = sum([length >= 12, has_upper, has_lower, has_digit, has_symbol])
        
        strength_map = {
            5: "Very Strong",
            4: "Strong",
            3: "Moderate",
            2: "Weak",
            1: "Very Weak",
            0: "Extremely Weak"
        }

        return {
            "length": length,
            "has_upper": has_upper,
            "has_lower": has_lower,
            "has_digit": has_digit,
            "has_symbol": has_symbol,
            "strength": strength_map.get(strength_points, "Weak"),
            "is_recommended": length >= 12 and has_symbol and has_digit
        }
