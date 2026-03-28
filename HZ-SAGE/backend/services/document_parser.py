import io
from pypdf import PdfReader
from docx import Document

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from supported file formats."""
    text = ""
    file_extension = filename.split('.')[-1].lower()
    try:
        if file_extension == 'pdf':
            reader = PdfReader(io.BytesIO(file_content))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        elif file_extension == 'docx':
            try:
                doc = Document(io.BytesIO(file_content))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            except Exception as inner_e:
                if "zip file" in str(inner_e).lower() or "zipfile" in str(inner_e).lower():
                    raise ValueError("由于“File is not a zip file”，无法解析该 Word 文件。请确认此文件是原生的 .docx 格式，而不是将别的文件强行通过重命名后缀得来的。")
                raise inner_e
        elif file_extension == 'doc':
            raise ValueError("系统暂不支持包含二进制格式的 .doc 老版本 Word 文件，请您先在本地使用 Office 将其“另存为” .docx 后缀的新版格式再上传。")
        else:
            text = file_content.decode('utf-8', errors='ignore')
    except Exception as e:
        raise ValueError(f"Failed to parse file: {str(e)}")
    
    return text.strip()
