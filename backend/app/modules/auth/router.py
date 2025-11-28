from fastapi import APIRouter, Depends, status
from app.modules.auth.schemas import RegisterRequest, LoginRequest
from app.modules.auth.service import AuthService
from app.modules.users.repository import UserRepository, get_user_repo
from app.core.security import get_and_verify_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(user_repo: UserRepository = Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(data: RegisterRequest,auth_service: AuthService = Depends(get_auth_service)):
    user = auth_service.register(data)
    return {"message": "User registered successfully", "user_id": user.id}

@router.post("/login")
def login_user( data: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(data)


@router.get("/me")
def get_current_user(user: dict = Depends(get_and_verify_user)):
    return {"user": user}
