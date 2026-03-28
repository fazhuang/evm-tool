from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 加载同目录下的 .env 文件中的环境变量
load_dotenv()

from utils.auth import verify_token

from routers import review, warning, dashboard, settings
from services.settings_service import get_setting

app = FastAPI(
    title="HZ-SAGE Platform API",
    description="Backend API for AI Document Review and Operation Diagnostics",
    version="1.0.0"
)

# Allow React app (Vite default port 5173) to access the API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(review.router)
app.include_router(warning.router, dependencies=[Depends(verify_token)])
app.include_router(dashboard.router, dependencies=[Depends(verify_token)])
app.include_router(settings.router) # Auth handled inside

@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "message": "HZ-SAGE Backend is running.",
        "version": get_setting("system_version")
    }
