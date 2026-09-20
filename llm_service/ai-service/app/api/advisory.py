from fastapi import APIRouter, HTTPException, status
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.advisory_request import AdvisoryRequest
from app.api.services.advisory_service import AdvisoryService
from app.api.bedrock.client import BedrockClient

router = APIRouter()
advisory_service = AdvisoryService()
bedrock_client = BedrockClient()


class ChatRequest(BaseModel):
    question: str
    businessType: Optional[str] = "micro-enterprise"
    location: Optional[str] = "Rural India"
    loanAmount: Optional[float] = 0.0
    emi: Optional[float] = 0.0
    schemeName: Optional[str] = "PM Mudra Yojana"
    riskLevel: Optional[str] = "LOW_RISK"
    language: str = Field(default="en")


class ChatResponse(BaseModel):
    status: str = "SUCCESS"
    answer: str
    sources: List[str] = Field(default_factory=list)


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}


@router.post("/v1/advisory")
def create_advisory(request: AdvisoryRequest):
    try:
        result = advisory_service.generate_advisory(request)
        return result
    except RuntimeError as re:
        err_str = str(re)
        if "BEDROCK_RATE_LIMIT" in err_str:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={"status": "ERROR", "errorCode": "BEDROCK_RATE_LIMIT", "message": "AI service rate limit exceeded."}
            )
        elif "BEDROCK_UNAVAILABLE" in err_str:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={"status": "ERROR", "errorCode": "BEDROCK_UNAVAILABLE", "message": "AI service is temporarily unavailable."}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={"status": "ERROR", "errorCode": "AI_INTERNAL_ERROR", "message": err_str}
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "ERROR", "errorCode": "INTERNAL_ERROR", "message": "An unexpected error occurred."}
        )


@router.post("/v1/chat", response_model=ChatResponse)
def chat_with_advisor(req: ChatRequest):
    try:
        context = {
            "businessType": req.businessType,
            "location": req.location,
            "loanAmount": req.loanAmount,
            "emi": req.emi,
            "schemeName": req.schemeName,
            "riskLevel": req.riskLevel,
            "language": req.language,
        }
        answer = bedrock_client.invoke_chat(req.question, context)
        sources = [
            f"Government Scheme Guidelines: {req.schemeName}",
            f"District MSME Benchmarks: {req.location}",
            "Reserve Bank of India PSL Circulars",
        ]
        return ChatResponse(status="SUCCESS", answer=answer, sources=sources)
    except Exception as e:
        return ChatResponse(
            status="ERROR",
            answer=f"Unable to process query currently. Details: {str(e)}",
            sources=[]
        )