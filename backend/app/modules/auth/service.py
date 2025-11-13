from app.modules.auth.utils import hash_password, verify_password
from app.modules.users.repository import UserRepository
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse

SECRET_KEY = "clave_super_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, data: RegisterRequest):
        hashed = hash_password(data.password)
        user = self.user_repo.create_user(data.username, data.email, hashed)
        return user
    def login(self, data: LoginRequest):
        user = self.user_repo.get_by_email(data.email)
        if user and verify_password(data.password, user.hashed_password):
            return user
        return None
