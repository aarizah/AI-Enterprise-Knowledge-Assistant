from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    VOYAGE_API_KEY: str
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
