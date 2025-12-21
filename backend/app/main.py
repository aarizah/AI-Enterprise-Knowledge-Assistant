from fastapi import FastAPI
import uvicorn
from app.core.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.modules.auth import init_module as init_auth
from app.modules.chat import init_module as init_chat
from app.modules.documents import init_module as init_documents
from app.modules.health import init_module as init_health
from app.modules.analytics import init_module as init_analytics
from app.core.exceptions import register_core_exception_handlers
from app.core.observability import ObservationMiddleware

app = FastAPI()

# Dev CORS: Allow frontend origin with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://eka-ten.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.add_middleware(ObservationMiddleware)

register_core_exception_handlers(app)

# Initialize modules
init_health(app)
init_auth(app)
init_chat(app)
init_documents(app)
init_analytics(app)

init_db()

if __name__ == "__main__":
    port = 8000
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
