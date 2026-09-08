from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinTrack"
    API_V1_STR: str = "/api/v1"
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Security Settings
    SECRET_KEY: str = "temporary-super-secret-key-change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    RESET_TOKEN_EXPIRE_MINUTES: int = 15
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./fintrack.db"
    
    # CORS Settings (comma-separated origins)
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: Optional[str] = ""

    # Brevo (Sendinblue) Email SMTP Settings
    SMTP_HOST: str = "smtp-relay.brevo.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = ""
    SMTP_PASSWORD: Optional[str] = ""
    EMAILS_FROM_EMAIL: str = "no-reply@fintrack.local"
    EMAILS_FROM_NAME: str = "FinTrack Support"

    @property
    def cors_origins(self) -> List[str]:
        if not self.BACKEND_CORS_ORIGINS:
            return []
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
