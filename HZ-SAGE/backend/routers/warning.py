from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.ai_engine import execute_operation_diagnosis

router = APIRouter(prefix="/api/v1/warning", tags=["Warning"])

class WarningRequest(BaseModel):
    user_issue: str

@router.post("/diagnose")
async def diagnose_issue(request: WarningRequest):
    try:
        diagnosis = execute_operation_diagnosis(request.user_issue)
        return {"diagnosis": diagnosis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
