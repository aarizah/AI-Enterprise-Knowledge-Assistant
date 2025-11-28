from fastapi import APIRouter, Depends

from app.core.security import get_and_verify_user
from app.modules.chat.schemas import QueryRequest
from app.modules.chat.services import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_chat_service() -> ChatService:
    return ChatService()


@router.post("/answer")
async def answer_query(
    request: QueryRequest,
    user: dict = Depends(get_and_verify_user),
    service: ChatService = Depends(get_chat_service),
):
    return service.answer_query(request.query)

