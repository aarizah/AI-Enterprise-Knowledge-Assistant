from app.core.security import hash_password, verify_password
from app.modules.users.repository import UserRepository
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.modules.auth.exceptions import EmailAlreadyExists, InvalidCredentials
from app.core.security import create_access_token

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, data: RegisterRequest):
        # Check if email already exists
        if self.user_repo.get_by_email(data.email):
            raise EmailAlreadyExists("Email already registered")
        
        hashed = hash_password(data.password)
        user = self.user_repo.create_user(data.username, data.email, hashed)
        return user
    def login(self, data: LoginRequest):
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise InvalidCredentials("Invalid email or password")
        
        token = create_access_token({
            "sub": str(user.id),
            "email": user.email,
            "username": user.username
        })
        return {"access_token": token, "token_type": "bearer"}
