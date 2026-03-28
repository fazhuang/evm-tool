from fastapi import APIRouter, HTTPException, Depends
import os
from typing import Dict, Any
from pydantic import BaseModel
from services.settings_service import load_settings, save_settings
from utils.auth import verify_token

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])

class SettingsUpdate(BaseModel):
    settings: Dict[str, Any]

class AdminPasscode(BaseModel):
    passcode: str

@router.post("/verify_passcode")
async def verify_admin_passcode(data: AdminPasscode, token: str = Depends(verify_token)):
    """Verify the administrative passcode to enter settings."""
    correct_passcode = os.getenv("ADMIN_PASSCODE", "admin888")
    if data.passcode == correct_passcode:
        return {"status": "success", "message": "Access granted."}
    else:
        raise HTTPException(status_code=403, detail="Invalid admin passcode.")

@router.get("/")
async def get_current_settings(token: str = Depends(verify_token)):
    """Fetch current system configuration."""
    return load_settings()

@router.post("/")
async def update_settings(update: SettingsUpdate, token: str = Depends(verify_token)):
    """Update system configuration."""
    if save_settings(update.settings):
        return {"status": "success", "message": "Settings updated successfully."}
    else:
        raise HTTPException(status_code=500, detail="Failed to persist settings.")

@router.get("/public")
async def get_public_settings():
    """Fetch non-sensitive settings (e.g. version) without auth."""
    settings = load_settings()
    return {
        "system_version": settings.get("system_version"),
        "ui_theme": settings.get("ui_theme"),
        "ui_language": settings.get("ui_language")
    }
