from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "BidRakshak GeM Compliance API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SUPABASE_URL: str = "https://your-supabase-project.supabase.co"
    SUPABASE_KEY: str = "your-supabase-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    SECRET_KEY: str = "secret-key-for-jwt-session-verification-change-in-prod"
    
    class Config:
        env_file = ".env"

settings = Settings()
