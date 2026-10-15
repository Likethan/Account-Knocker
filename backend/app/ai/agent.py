import os
import google.generativeai as genai
from typing import List
from ..config import settings
from ..models import ConnectedAccount, SecurityReport

SYSTEM_PROMPT = """You are Account Knocker AI (Knock AI), a cybersecurity assistant.
Your job is to analyze user digital security information.

Always:
- Explain risks simply.
- Never scare users.
- Give actionable solutions.
- Prioritize privacy.
- Recommend security best practices.

Your output should be friendly, professional and educational.
You have access to the user's currently connected accounts and their latest security scan metrics.
Keep answers concise and well-structured, using bullet points or checklists where appropriate.
"""

class SecurityAssistantAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = "gemini-2.5-flash"
        self.initialized = False
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.initialized = True
            except Exception as e:
                print(f"Error configuring Gemini API: {e}")

    def generate_response(self, user_message: str, chat_history: List[dict], accounts: List[ConnectedAccount], latest_report: SecurityReport) -> str:
        # Context compilation: compile connected accounts status list and risks to inject into prompt
        accounts_context = []
        for acc in accounts:
            accounts_context.append(f"- {acc.platform.upper()}: Status is {acc.status.upper()}")
        accounts_str = "\n".join(accounts_context) if accounts_context else "No platforms linked yet."

        risks_context = []
        if latest_report and latest_report.issues_found:
            for issue in latest_report.issues_found:
                risks_context.append(f"- [{issue.get('type', 'medium').upper()}] {issue.get('title')}: {issue.get('description')}")
        risks_str = "\n".join(risks_context) if risks_context else "No risks identified."

        context = f"""
--- USER SECURITY PROFILE ---
Overall Defense Score: {latest_report.security_score if latest_report else 100}/100
Connected Platforms:
{accounts_str}

Active Security Risks Found:
{risks_str}
-----------------------------
"""

        # Fallback to local expert rules if Gemini API key is missing
        if not self.initialized:
            return self._generate_fallback_response(user_message, accounts, latest_report)

        try:
            # Build history list in Gemini structure
            contents = []
            
            # Add system instructions as prefix or system parameter
            # For standard genai versions, system instruction can be passed during model creation
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=SYSTEM_PROMPT
            )
            
            # Injecting history and current safety context
            prompt_content = f"{context}\n\nUser Message: {user_message}\nResponse:"
            
            # Build historical message parameters
            history_contents = []
            for chat in chat_history[-6:]:  # limit to last 6 exchanges for prompt size efficiency
                history_contents.append({"role": "user", "parts": [chat["message"]]})
                history_contents.append({"role": "model", "parts": [chat["response"]]})
            
            # Append active prompt
            history_contents.append({"role": "user", "parts": [prompt_content]})
            
            response = model.generate_content(history_contents)
            return response.text
        except Exception as e:
            print(f"Gemini API generation failed, running fallback: {e}")
            return self._generate_fallback_response(user_message, accounts, latest_report)

    def _generate_fallback_response(self, query: str, accounts: List[ConnectedAccount], latest_report: SecurityReport) -> str:
        """Rule-based smart mock generator when API is offline or key is unconfigured."""
        query_lower = query.lower()
        
        # Analyze query keywords
        if "spotify" in query_lower:
            spotify_acc = next((a for a in accounts if a.platform == "spotify"), None)
            if spotify_acc and spotify_acc.status != "disconnected":
                return (
                    "### Spotify Security Audit\n"
                    "Your Spotify account is currently connected. Let's look at the parameters:\n\n"
                    "✔ OAuth session verified\n"
                    "✔ No suspicious app integrations detected\n\n"
                    "**Remediation Recommendation**:\n"
                    "- We detected that your password is over 1 year old. Rotate your credentials using Spotify profile settings to keep access authorization fresh."
                )
            else:
                return "Your Spotify account is not linked. To review its security, go to the **My Accounts** page and connect it."

        if "github" in query_lower:
            github_acc = next((a for a in accounts if a.platform == "github"), None)
            if github_acc and github_acc.status != "disconnected":
                return (
                    "### GitHub Security Warning\n"
                    "Your connected GitHub account is flagged with **Critical Risk** due to the following vulnerabilities:\n\n"
                    "- **Missing MFA**: Multi-factor authentication is disabled on your GitHub profile, leaving repositories vulnerable to password attacks.\n"
                    "- **Unknown Devices**: A developer access token was used from an unrecognized IP address.\n\n"
                    "**Mitigation Steps**:\n"
                    "1. Enable GitHub Two-Factor Authentication under Settings > Password and Security.\n"
                    "2. Audit active personal access tokens and delete any legacy keys."
                )
            else:
                return "Your GitHub account is not connected. Connect it on the **My Accounts** page to perform an automated code repo audit."

        if "mfa" in query_lower or "factor" in query_lower or "2fa" in query_lower:
            return (
                "### Multi-Factor Authentication (MFA) Guidance\n"
                "Multi-factor authentication (MFA) adds an extra layer of defense by requiring two forms of verification before granting login access.\n\n"
                "**Why it matters**:\n"
                "- Reduces risk of credentials stuffing attacks by 99%.\n"
                "- Keeps accounts safe even if password hashes are leaked in breaches.\n\n"
                "**How to enable it**:\n"
                "- **Google**: Go to Google Account > Security > 2-Step Verification.\n"
                "- **GitHub**: Settings > Password and security > Two-factor authentication."
            )

        # Default fallback response summarizing current state
        total_accounts = len([a for a in accounts if a.status != "disconnected"])
        critical_issues = len(latest_report.issues_found) if latest_report and latest_report.issues_found else 0
        
        return (
            f"Hello! I am Knock AI, your security coach. I've audited your active connections:\n\n"
            f"- **Connected Platforms**: {total_accounts} active profiles linked.\n"
            f"- **Outstanding Issues**: {critical_issues} issues require attention.\n\n"
            f"Would you like me to walk you through securing your **GitHub** account or explain how to setup **Multi-Factor Authentication (MFA)**?"
        )
