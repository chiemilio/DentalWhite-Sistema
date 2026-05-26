"""
Configuración de la aplicación FastAPI
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Configuración de la aplicación"""

    # Database
    DATABASE_URL: str = "postgresql://localhost:5432/dental_white"

    # Security
    SECRET_KEY: str = "super_secret_key_123456789012345678901234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 días

    # CORS
    CORS_ORIGINS: str = "http://localhost,http://localhost:80,http://localhost:3000,http://127.0.0.1,http://127.0.0.1:80,http://127.0.0.1:3000,https://deltawhitetest.vercel.app"

    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Dental White API"
    VERSION: str = "3.0.0"

    # Environment
    ENVIRONMENT: str = "development"

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        case_sensitive=True
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Convierte CORS_ORIGINS string a lista"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
