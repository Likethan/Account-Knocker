import datetime
from typing import List, Tuple
from ..models import ConnectedAccount

def run_risk_analysis(connected_accounts: List[ConnectedAccount], resolved_recommendations: List[str] = None) -> Tuple[int, str, List[dict], List[dict]]:
    """
    Scoring Engine:
    Initial score: 100
    - Missing MFA: -15
    - Unused applications: -10
    - Old password: -20
    - Suspicious login: -25
    - Unknown devices: -15
    - Recommendation resolved: restores deducted points
    """
    if resolved_recommendations is None:
        resolved_recommendations = []
        
    score = 100
    risks = []
    recommendations = []
    
    # We only analyze connected/warning/risk accounts
    active_accounts = [acc for acc in connected_accounts if acc.status != "disconnected"]

    if not active_accounts:
        # No accounts connected -> safe/neutral score of 100 with a tip
        recommendations.append({
            "id": "init_connect",
            "platform": "system",
            "title": "Link online platforms",
            "description": "Connect Google, Spotify, Discord, or GitHub to begin monitoring security metrics.",
            "priority": "high",
            "fixed": False
        })
        return 100, "Safe", [], recommendations

    for acc in active_accounts:
        p = acc.platform.lower()
        
        if acc.status == "risk":
            # Critical status mapping
            if p == "github":
                is_mfa_resolved = "github_mfa" in resolved_recommendations
                is_sessions_resolved = "github_sessions" in resolved_recommendations
                
                # Github critical issues
                if not is_mfa_resolved:
                    score -= 15  # Missing MFA
                    risks.append({
                        "type": "critical",
                        "title": "GitHub MFA Disabled",
                        "description": "Multi-factor authentication is not active on your connected GitHub profile."
                    })
                
                if not is_sessions_resolved:
                    score -= 15  # Unknown devices
                    risks.append({
                        "type": "critical",
                        "title": "Unknown Device Authentication",
                        "description": "A developer access token was used from an unauthenticated IP address location."
                    })
                
                recommendations.append({
                    "id": f"{p}_mfa",
                    "platform": p,
                    "title": "Enable GitHub Two-Factor Authentication",
                    "description": "Secure commit signatures and repository rights by toggling on SMS or App MFA.",
                    "priority": "high",
                    "fixed": is_mfa_resolved
                })
                recommendations.append({
                    "id": f"{p}_sessions",
                    "platform": p,
                    "title": "Audit Active Developer Tokens",
                    "description": "Review active SSH keys and revoke any expired personal access keys.",
                    "priority": "high",
                    "fixed": is_sessions_resolved
                })
            
            elif p == "google":
                is_google_pw_resolved = "google_pw" in resolved_recommendations
                
                if not is_google_pw_resolved:
                    score -= 25  # Suspicious login
                    risks.append({
                        "type": "critical",
                        "title": "Suspicious Login Activity",
                        "description": "A blocked access attempt was registered from a foreign proxy network."
                    })
                recommendations.append({
                    "id": f"{p}_pw",
                    "platform": p,
                    "title": "Update Google Password",
                    "description": "Force logouts across connected clients by updating your master Google passphrase.",
                    "priority": "high",
                    "fixed": is_google_pw_resolved
                })

        elif acc.status == "warning":
            if p == "discord":
                is_mfa_resolved = "discord_mfa" in resolved_recommendations
                is_revocation_resolved = "discord_revocation" in resolved_recommendations
                
                if not is_mfa_resolved:
                    score -= 15  # Missing MFA
                    risks.append({
                        "type": "medium",
                        "title": "Discord MFA Inactive",
                        "description": "Your account is missing secondary authentication checks."
                    })
                if not is_revocation_resolved:
                    score -= 10  # Unused apps (stale permissions)
                    risks.append({
                        "type": "medium",
                        "title": "Stale App Permissions",
                        "description": "Third-party integrations have permission tokens that have been dormant for over 180 days."
                    })
                
                recommendations.append({
                    "id": f"{p}_mfa",
                    "platform": p,
                    "title": "Activate Discord MFA",
                    "description": "Go to Discord Settings > My Account and enable authenticator support.",
                    "priority": "medium",
                    "fixed": is_mfa_resolved
                })
                recommendations.append({
                    "id": f"{p}_revocation",
                    "platform": p,
                    "title": "Revoke Obsolete Integrations",
                    "description": "Audit Authorized Apps list and remove integrations that are no longer in active use.",
                    "priority": "medium",
                    "fixed": is_revocation_resolved
                })
            
            elif p == "spotify":
                is_spotify_pw_resolved = "spotify_pw" in resolved_recommendations
                
                if not is_spotify_pw_resolved:
                    score -= 20  # Old password
                    risks.append({
                        "type": "medium",
                        "title": "Obsolete Password Setting",
                        "description": "Your password is over 360 days old and should be updated to prevent credential stuffing."
                    })
                recommendations.append({
                    "id": f"{p}_pw",
                    "platform": p,
                    "title": "Rotate Spotify Password",
                    "description": "Change your credentials using Spotify profile settings to keep access authorization fresh.",
                    "priority": "low",
                    "fixed": is_spotify_pw_resolved
                })

        elif acc.status == "connected":
            # Positive additions/bonuses for clean connections
            score += 5  # Security update bonus
            recommendations.append({
                "id": f"{p}_update",
                "platform": p,
                "title": f"Review {p.capitalize()} Security History",
                "description": "Everything looks healthy. Maintain regular credential checkups.",
                "priority": "low",
                "fixed": True
            })

    # Bound score between 0 and 100
    score = max(0, min(100, score))
    
    # Determine risk level
    if score >= 85:
        risk_level = "Safe"
    elif score >= 70:
        risk_level = "Good"
    elif score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "Critical"

    return score, risk_level, risks, recommendations
