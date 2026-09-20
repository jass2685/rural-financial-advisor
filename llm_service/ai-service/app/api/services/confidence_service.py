from app.models.advisory_request import AdvisoryRequest

class ConfidenceService:
    @staticmethod
    def evaluate(req: AdvisoryRequest) -> dict:
        fin_status = "VERIFIED" if (req.financialInfo and req.financialInfo.monthlyRevenue is not None) else "INSUFFICIENT"
        mkt_status = "VERIFIED" if (req.marketInfo and req.marketInfo.localDemand) else "PARTIAL"
        scheme_status = "VERIFIED" if (req.schemeInfo and req.schemeInfo.schemeName) else "NOT_APPLICABLE"
        
        if fin_status == "INSUFFICIENT" and mkt_status == "PARTIAL":
            overall = "INSUFFICIENT"
        elif fin_status == "VERIFIED" and mkt_status == "VERIFIED":
            overall = "VERIFIED"
        else:
            overall = "PARTIAL"

        return {
            "overall": overall,
            "financial": fin_status,
            "market": mkt_status,
            "scheme": scheme_status
        }