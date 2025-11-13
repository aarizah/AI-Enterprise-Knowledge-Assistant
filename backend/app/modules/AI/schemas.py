#Defines how is exchanged the information between client and API (Pydantic)
from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str


