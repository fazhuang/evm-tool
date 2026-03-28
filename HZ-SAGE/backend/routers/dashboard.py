from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

from services.report_generator import generate_pdf_stream

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

class ReminderRequest(BaseModel):
    project_name: str
    manager: str

@router.get("/metrics")
async def get_metrics():
    # Mock data to simulate the previous functionality
    data = {
        "monthly_projects": {"value": "42 个", "change": "12%"},
        "team_load": {"value": "85%", "change": "-5%"},
        "api_stability": {"value": "稳定", "change": "99.9%"},
        "chart_data": pd.DataFrame(
            np.random.randn(20, 3),
            columns=['电子标书制作', '在线开标模拟', '系统集成测试']
        ).to_dict(orient="records"),
        "satisfaction": 85
    }
    
    # Check for projects warning
    backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(backend_root, "projects.csv")
    warning_projects = []
    
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        df['开标日期'] = pd.to_datetime(df['开标日期'])
        df['距离天数'] = (df['开标日期'] - pd.Timestamp('today')).dt.days
        df['预警'] = (df['电子化进度'] < 50) & (df['距离天数'] <= 3)
        warning_projects = df[df['预警']].to_dict(orient="records")
        for proj in warning_projects:
            proj['开标日期'] = str(proj['开标日期']) # Ensure JSON serializable
            
    data["warnings"] = warning_projects
    return data

@router.post("/generate_reminder")
async def generate_reminder(request: ReminderRequest):
    try:
        bio = generate_pdf_stream(request.project_name, request.manager)
        return StreamingResponse(
            bio,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={request.project_name}_催办函.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
