from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class BiddingExtractionRequest(BaseModel):
    filename: str
    content: str

class BiddingFormField(BaseModel):
    project_name: str
    project_code: str
    project_category: str # 政府采购-货物, 政府采购-工程, 政府采购-服务, 工程建设项目, 遴选/入围, 阳光平台
    budget_amount: float
    agent_name: str
    agent_contact: str
    opening_time: str
    opening_location: str
    supplier_qualifications: List[str]
    technical_specs: List[Dict[str, Any]]
    evaluation_method: str # 综合评分/最低价

class BiddingGenerationRequest(BaseModel):
    form_data: BiddingFormField
    template_id: str = "gansu_v2024_standard"
