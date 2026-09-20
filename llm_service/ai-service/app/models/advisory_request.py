from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BusinessInfo(BaseModel):
    businessType: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    language: str = Field(default="en", description="Supported: en, hi, pa")

class FinancialInfo(BaseModel):
    capital: Optional[float] = None
    projectCost: Optional[float] = None
    loanAmount: Optional[float] = None
    interestRate: Optional[float] = None
    tenure: Optional[int] = None
    emi: Optional[float] = None
    monthlyRevenue: Optional[float] = None
    monthlyExpenses: Optional[float] = None
    monthlyProfit: Optional[float] = None
    riskLevel: Optional[str] = None

class MarketInfo(BaseModel):
    localDemand: Optional[str] = None
    marketData: Optional[Dict[str, Any]] = None
    competitorData: Optional[List[Dict[str, Any]]] = None
    priceData: Optional[Dict[str, Any]] = None
    demandForecast: Optional[str] = None

class SchemeInfo(BaseModel):
    schemeName: Optional[str] = None
    schemeEligibility: Optional[bool] = None
    subsidy: Optional[float] = None
    schemeEvidence: Optional[str] = None

class StressTestInfo(BaseModel):
    revenueDropPercent: Optional[float] = None
    expenseIncreasePercent: Optional[float] = None
    stressedProfit: Optional[float] = None
    stressedEMIAbility: Optional[bool] = None
    stressedRiskLevel: Optional[str] = None

class AdvisoryRequest(BaseModel):
    businessInfo: BusinessInfo
    financialInfo: Optional[FinancialInfo] = None
    marketInfo: Optional[MarketInfo] = None
    schemeInfo: Optional[SchemeInfo] = None
    stressTestInfo: Optional[StressTestInfo] = None
    evidence: Optional[List[str]] = Field(default_factory=list)
    dataConfidence: Optional[str] = "PARTIAL"
    dataSources: Optional[List[str]] = Field(default_factory=list)
