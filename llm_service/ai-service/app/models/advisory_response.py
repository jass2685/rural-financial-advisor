from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class BusinessViability(BaseModel):
    explanation: str
    keyFactors: List[str]

class MarketOpportunity(BaseModel):
    summary: str
    evidence: List[str]
    confidence: str

class FinancialExplanation(BaseModel):
    summary: str
    cashFlowObservation: str
    emiObservation: str
    warnings: List[str]

class RiskAnalysis(BaseModel):
    level: str
    explanation: str
    riskFactors: List[str]
    mitigation: List[str]

class StressTest(BaseModel):
    explanation: str
    observations: List[str]
    warnings: List[str]

class SWOT(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class ConfidenceScore(BaseModel):
    overall: str
    financial: str
    market: str
    scheme: Optional[str] = "NOT_APPLICABLE"

class AdvisoryResponse(BaseModel):
    status: str
    message: Optional[str] = None
    missingData: Optional[List[str]] = None
    summary: Optional[str] = None
    businessViability: Optional[BusinessViability] = None
    marketOpportunity: Optional[MarketOpportunity] = None
    financialExplanation: Optional[FinancialExplanation] = None
    riskAnalysis: Optional[RiskAnalysis] = None
    stressTest: Optional[StressTest] = None
    swot: Optional[SWOT] = None
    recommendations: Optional[List[str]] = None
    nextSteps: Optional[List[str]] = None
    confidence: Optional[ConfidenceScore] = None
    evidence: Optional[List[str]] = None