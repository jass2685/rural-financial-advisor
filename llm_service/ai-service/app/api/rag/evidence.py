from pydantic import BaseModel
from typing import Optional

class EvidenceItem(BaseModel):
    source_id: str
    title: str
    content: str
    verified: bool = True
