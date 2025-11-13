from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.environment import settings

ALGORITHM = settings.algorithm
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login") 

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    response = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)
    print ("Generated JWT:", response)  # Debug line
    return response

def decode_access_token(token: str) -> dict | None:
    print("Decoding JWT:", token)  # Debug line
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        # Token expirado
        return None
    except JWTError:
        # Token inválido (manipulado, firma mala, etc.)
        return None
    

from fastapi import Request

def get_and_verify_user(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    print("Token recibido del Depends:", token)
    print("Authorization Header:", request.headers.get("authorization"))
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
