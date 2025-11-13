from fastapi import FastAPI
import uvicorn
from app.modules.auth.router import router as auth_router
from app.modules.AI.router import router as ai_router
from app.core.database import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Dev CORS: wildcard origins with no credentials and explicit methods/headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ai_router)

init_db()

if __name__ == "__main__":
    port = 8000
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
