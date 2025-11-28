from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class UserContext(BaseModel):
    """Contexto de usuario para uso interno en services"""
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True