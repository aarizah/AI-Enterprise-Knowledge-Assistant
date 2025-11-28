from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_path: Optional[str]
    file_type: str
    upload_date: datetime
    user_id: Optional[int]
    chunks_count: int
    file_size_bytes: Optional[int]
    status: str
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    total: int
    documents: List[DocumentResponse]
