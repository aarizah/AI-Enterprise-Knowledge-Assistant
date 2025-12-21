from fastapi import APIRouter, Depends, Request

from app.core.security import get_and_verify_user
from app.modules.chat.schemas import QueryRequest
from app.modules.chat.services import ChatService
from app.core.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_chat_service() -> ChatService:
    return ChatService()

@router.post("/answer")
async def answer_query(
    request_body: QueryRequest,
    request: Request,
    user: dict = Depends(get_and_verify_user),
    service: ChatService = Depends(get_chat_service),
    db=Depends(get_db)
):
    return service.answer_query(request_body.query, request, user, db)

