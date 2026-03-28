from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import sys
import os
import uuid
from typing import Dict, Any

from services.document_parser import extract_text_from_file
from services.ai_engine import execute_review_analysis
from services.report_generator import generate_docx_stream

from utils.auth import verify_token

router = APIRouter(prefix="/api/v1/review", tags=["Review"])

# Simple in-memory cache to temporarily hold report data for GET downloads
report_cache: Dict[str, Any] = {}

class ReportRequest(BaseModel):
    report_data: dict
    filename: str

ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.doc', '.txt'}

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    token: str = Depends(verify_token)
):
    # 1. 安全审查：校验文件扩展名
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"不支持的文件格式。允许的格式: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        contents = await file.read()
        # 2. 安全审查：限制文件大小 (例如 10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="文件过大，最大允许 10MB。")

        extracted_text = extract_text_from_file(contents, file.filename)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="无法从文件中提取文本或文件内容为空。")
            
        review_result = execute_review_analysis(extracted_text)
        
        if review_result.get("status") == "error":
            raise HTTPException(status_code=500, detail=review_result.get("message", "AI Engine Error"))
            
        return {"filename": file.filename, "report": review_result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"上传处理失败: {str(e)}")

import urllib.parse

@router.post("/prepare_download")
async def prepare_download(request: ReportRequest, token: str = Depends(verify_token)):
    """
    Step 1: Save the report data to a temporary memory cache and return a GET URL.
    This entirely avoids frontend Blob download failures in strict browsers.
    """
    report_id = str(uuid.uuid4())
    report_cache[report_id] = {
        "report_data": request.report_data,
        "filename": request.filename
    }
    return {"download_url": f"/api/v1/review/download/{report_id}"}


@router.get("/download/{report_id}")
async def fetch_download(report_id: str):
    """
    Step 2: Browser natively fetches the file via GET, guaranteeing correct filename & extension.
    """
    data = report_cache.get(report_id)
    if not data:
        raise HTTPException(status_code=404, detail="下载链接已过期或未找到")
        
    try:
        bio = generate_docx_stream(data["report_data"], data["filename"])
        encoded_filename = urllib.parse.quote(data["filename"])
        
        # Clean up memory
        del report_cache[report_id]
        
        # Ensure the filename header contains a safe ASCII fallback for ALL browsers,
        # otherwise Safari might silently drop the Content-Disposition header and use the UUID url!
        header_val = f"attachment; filename=\"AI_Review_Report.docx\"; filename*=utf-8''AI_Review_{encoded_filename}.docx"
        
        return StreamingResponse(
            bio,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": header_val}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
