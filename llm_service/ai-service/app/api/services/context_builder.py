from typing import Dict, Any
from app.models.advisory_request import AdvisoryRequest
from app.api.rag.retriever import EvidenceRetriever

class ContextBuilder:
    def __init__(self):
        self.retriever = EvidenceRetriever()

    def build_context(self, req: AdvisoryRequest) -> Dict[str, Any]:
        missing_data = []
        
        fin = req.financialInfo
        if not fin or fin.monthlyRevenue is None or fin.projectCost is None:
            missing_data.append("critical financial metrics (revenue or project cost)")
            
        mkt = req.marketInfo
        if not mkt or not mkt.localDemand:
            missing_data.append("local market demand metrics")

        retrieved_evidence = self.retriever.retrieve_relevant_evidence(
            district=req.businessInfo.district or "unknown",
            business_type=req.businessInfo.businessType or "general"
        )

        context = {
            "verified_financial_data": fin.dict() if fin else {},
            "verified_market_data": mkt.dict() if mkt else {},
            "verified_scheme_data": req.schemeInfo.dict() if req.schemeInfo else {},
            "risk_data": {"riskLevel": fin.riskLevel if fin else "UNKNOWN"},
            "stress_test_data": req.stressTestInfo.dict() if req.stressTestInfo else {},
            "evidence": [e.content for e in retrieved_evidence] + (req.evidence or []),
            "missing_data": missing_data
        }
        return context