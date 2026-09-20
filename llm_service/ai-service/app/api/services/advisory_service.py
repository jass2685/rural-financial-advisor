import json
from datetime import datetime
from app.models.advisory_request import AdvisoryRequest
from app.api.services.context_builder import ContextBuilder
from app.api.services.confidence_service import ConfidenceService
from app.api.bedrock.client import BedrockClient
from app.api.prompts.advisory_prompt import get_system_prompt
from app.core.logging_config import logger


class AdvisoryService:
    def __init__(self):
        self.context_builder = ContextBuilder()
        self.bedrock_client = BedrockClient()

    def generate_advisory(self, req: AdvisoryRequest) -> dict:
        confidence = ConfidenceService.evaluate(req)
        context = self.context_builder.build_context(req)

        system_prompt = get_system_prompt(req.businessInfo.language)

        user_prompt = f"""Analyze the following verified backend data for a rural micro-enterprise advisory and generate structured JSON:

Context Data:
{json.dumps(context, indent=2)}

Advisory Request Summary:
- Business Type: {req.businessInfo.businessType or 'General micro-enterprise'}
- Location/District: {req.businessInfo.district or req.businessInfo.location or 'Rural India'}
- State: {req.businessInfo.state or 'India'}
- Language: {req.businessInfo.language}

Financial Snapshot:
- Project Cost: {('₹' + str(int(req.financialInfo.projectCost or 0))) if req.financialInfo else 'Not provided'}
- Loan Amount: {('₹' + str(int(req.financialInfo.loanAmount or 0))) if req.financialInfo else 'Not provided'}
- EMI: {('₹' + str(int(req.financialInfo.emi or 0)) + '/month') if req.financialInfo else 'Not provided'}
- Risk Level: {req.financialInfo.riskLevel if req.financialInfo else 'MEDIUM'}
- Scheme: {req.schemeInfo.schemeName if req.schemeInfo else 'PM Mudra Yojana'}
- Confidence: {confidence}

Return strictly valid JSON matching the exact schema in the system prompt. No markdown, no comments outside JSON.
"""

        try:
            llm_result = self.bedrock_client.invoke(system_prompt, user_prompt)
            # Ensure timestamp is always present
            if "generatedAt" not in llm_result or not llm_result.get("generatedAt"):
                llm_result["generatedAt"] = datetime.utcnow().isoformat() + "Z"
            logger.info(f"Advisory generated successfully for {req.businessInfo.businessType} in {req.businessInfo.district}")
            return llm_result
        except Exception as e:
            logger.error(f"Advisory generation failed: {str(e)}")
            # Final safety net — should rarely hit this since BedrockClient already has fallback
            raise RuntimeError(f"BEDROCK_ERROR: {str(e)}")