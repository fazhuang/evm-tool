from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Dict, Any
from models.construction import BiddingFormField, BiddingGenerationRequest
from services.document_assembler import assemble_gansu_bidding_doc
from services.document_parser import extract_text_from_file
from ai_core.rag_engine import analyze_document_with_ai
from utils.auth import verify_token
from fastapi.responses import StreamingResponse
import io

router = APIRouter(prefix="/api/v1/construction", tags=["Construction"])

@router.post("/extract_params")
async def extract_bidding_params(file: UploadFile = File(...), token: str = Depends(verify_token)):
    """Upload a client requirement document and extract core parameters via AI."""
    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    
    # We use the existing analyze_document_with_ai but format it for the construction form
    raw_analysis = analyze_document_with_ai(text)
    
    # Map the AI extraction to form fields (Mocking specific mapping for demo)
    # In a production system, we'd have a specific "parameter_extration" prompt
    extracted_info = raw_analysis.get("核心信息", [])
    
    project_name = "未命名项目"
    budget = 0.0
    quals = []
    
    for item in extracted_info:
        desc = item.get("描述", "").lower()
        sugg = item.get("建议", "")
        if "名称" in desc or "项目" in desc:
            project_name = sugg
        elif "预算" in desc or "金额" in desc:
            try: budget = float(''.join(filter(str.isdigit, sugg.replace('.', '')))) / 100 
            except: pass
        elif "资质" in desc or "要求" in desc:
            quals.append(sugg)

    return {
        "status": "success",
        "data": {
            "project_name": project_name,
            "budget_amount": budget,
            "supplier_qualifications": quals,
            "raw_text_hint": text[:500]
        }
    }

@router.post("/generate_doc")
async def generate_bidding_document(data: BiddingFormField, token: str = Depends(verify_token)):
    """Generate the standardized Word document based on the validated form data."""
    try:
        # 1. Assemble Doc
        doc_stream = assemble_gansu_bidding_doc(data.dict())
        
        # 2. Return as stream
        filename = f"招标文件_{data.project_name}.docx"
        return StreamingResponse(
            doc_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
