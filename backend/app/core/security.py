from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import argon2
from app.core.environment import settings
from app.core.exceptions import InvalidToken, ExpiredToken, MissingCredentials

ALGORITHM = settings.algorithm
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return argon2.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return argon2.verify(password, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None
    

def get_and_verify_user(token: str = Depends(oauth2_scheme)):
    from app.modules.users.schemas import UserContext
    
    if not token:
        raise MissingCredentials("Missing bearer token")
    payload = decode_access_token(token)
    if payload is None:
        # Distinguish expiration via decode path if needed; minimal generic invalid token
        # For more granular handling, decode in try/except here and raise ExpiredToken on ExpiredSignatureError
        raise InvalidToken("Invalid or expired token")
    
    # Convert payload dict to UserContext object
    # JWT uses 'sub' (subject) for user ID as per standard convention
    return UserContext(
        id=int(payload.get("sub")),
        username=payload.get("username"),
        email=payload.get("email")
    )
