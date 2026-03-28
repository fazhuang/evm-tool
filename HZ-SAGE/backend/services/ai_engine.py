import sys
import os

# Ensure the local ai_core package is found
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.append(backend_root)

from ai_core.rag_engine import analyze_document_with_ai, operation_warning_agent

def execute_review_analysis(extracted_text: str) -> dict:
    """Wrapper for the core RAG logic for document review."""
    return analyze_document_with_ai(extracted_text)

def execute_operation_diagnosis(user_issue: str) -> dict:
    """Wrapper for the AI operation warning expert."""
    return operation_warning_agent(user_issue)
