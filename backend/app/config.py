import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./account_knocker.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "knocker-safety-super-secret-key-321")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = int(os.getenv("JWT_EXPIRATION_MINUTES", "1440"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    SCAN_INTERVAL_SECONDS: int = int(os.getenv("SCAN_INTERVAL_SECONDS", "259200")) # Default is 3 days (3 * 24 * 60 * 60)

settings = Settings()
