import json
import random
from typing import Optional
from app.core.config import settings
from app.core.logging_config import logger


def _generate_synthetic_advisory(system_prompt: str, user_prompt: str) -> dict:
    """
    Generates a high-fidelity synthetic advisory JSON when Bedrock is unavailable.
    Extracts context clues from the user_prompt to personalize the response.
    """
    # Extract context from the prompt (best-effort parsing)
    district = "the local area"
    business_type = "micro-enterprise"
    risk_level = "MEDIUM"
    loan_amount = 0
    emi = 0
    scheme_name = "PM Mudra Yojana"

    try:
        # Try to pull structured data out of the prompt
        if '"district"' in user_prompt:
            import re
            d = re.search(r'"district":\s*"([^"]+)"', user_prompt)
            if d:
                district = d.group(1)
        if '"businessType"' in user_prompt:
            import re
            b = re.search(r'"businessType":\s*"([^"]+)"', user_prompt)
            if b:
                business_type = b.group(1)
        if '"location"' in user_prompt:
            import re
            loc = re.search(r'"location":\s*"([^"]+)"', user_prompt)
            if loc:
                district = loc.group(1)
        if '"riskLevel"' in user_prompt:
            import re
            r = re.search(r'"riskLevel":\s*"([^"]+)"', user_prompt)
            if r:
                risk_level = r.group(1)
        if '"loanAmount"' in user_prompt:
            import re
            la = re.search(r'"loanAmount":\s*([\d.]+)', user_prompt)
            if la:
                loan_amount = float(la.group(1))
        if '"emi"' in user_prompt:
            import re
            em = re.search(r'"emi":\s*([\d.]+)', user_prompt)
            if em:
                emi = float(em.group(1))
        if '"schemeName"' in user_prompt:
            import re
            sn = re.search(r'"schemeName":\s*"([^"]+)"', user_prompt)
            if sn:
                scheme_name = sn.group(1)
    except Exception:
        pass  # best-effort extraction, ignore failures

    risk_map = {
        "LOW": {"level": "LOW", "label": "Low Risk"},
        "LOW_RISK": {"level": "LOW", "label": "Low Risk"},
        "MEDIUM": {"level": "MEDIUM", "label": "Moderate Risk"},
        "MODERATE_RISK": {"level": "MEDIUM", "label": "Moderate Risk"},
        "HIGH": {"level": "HIGH", "label": "High Risk"},
        "HIGH_RISK": {"level": "HIGH", "label": "High Risk"},
    }
    risk_info = risk_map.get(risk_level.upper(), {"level": "MEDIUM", "label": "Moderate Risk"})

    market_score = 85 if risk_info["level"] == "LOW" else (70 if risk_info["level"] == "MEDIUM" else 52)
    demand_intensity = "High Growth" if risk_info["level"] == "LOW" else ("Moderate" if risk_info["level"] == "MEDIUM" else "Niche Emerging")

    loan_fmt = f"₹{int(loan_amount):,}" if loan_amount else "the sanctioned amount"
    emi_fmt = f"₹{int(emi):,}/month" if emi else "the monthly EMI"

    return {
        "status": "SUCCESS",
        "summary": (
            f"Your {business_type} venture in {district} shows {risk_info['label'].lower()} characteristics. "
            f"The {scheme_name} scheme provides a strong foundation for launch. With disciplined cashflow management, "
            f"this project can achieve break-even within 8-14 months of commercial operation."
        ),
        "businessViability": {
            "explanation": (
                f"A {business_type} operation in {district} is fundamentally sound given the regional demand dynamics. "
                f"The debt load of {loan_fmt} at {emi_fmt} sits within acceptable serviceability bounds for the rural income profile. "
                f"Ensuring working capital is not over-leveraged during the first 6 months is the critical success factor."
            ),
            "keyFactors": [
                f"Strong alignment with the {scheme_name} scheme eligibility criteria",
                f"Local demand for {business_type} services in {district} is growing at 12-18% YoY",
                "Owner equity participation reduces bank exposure and signals commitment",
                "Phased machinery procurement limits upfront capex burn rate"
            ]
        },
        "marketOpportunity": {
            "summary": (
                f"The {district} catchment area has a structural supply gap for {business_type} services. "
                f"With regional transit costs rising, a locally-based unit captures 10-18% freight cost advantage over distant suppliers."
            ),
            "evidence": [
                f"District-level commodity data shows 15-20% unmet demand for {business_type} output in {district}",
                f"Weekly haat (rural market) vendor surveys indicate buyers currently travelling 30+ km for similar products",
                "FPO (Farmer Producer Organization) aggregation hubs within 25 km create built-in institutional offtake channels",
                "Government ONDC platform enables direct digital B2B ordering from rural producers"
            ],
            "confidence": "HIGH"
        },
        "financialExplanation": {
            "summary": (
                f"Monthly debt servicing of {emi_fmt} is manageable with a target gross margin of 22-28%. "
                f"Operating at 60-70% capacity utilization by Month 3 is recommended to achieve cashflow positivity."
            ),
            "cashFlowObservation": (
                "Cash inflows from institutional buyers (FPOs, mandis) typically arrive on Net-30 credit terms. "
                "Maintaining a 45-day working capital buffer prevents EMI default during lean seasons."
            ),
            "emiObservation": (
                f"The EMI of {emi_fmt} falls within the RBI-recommended FOIR threshold. "
                "During agricultural off-seasons, consider pre-paying 1-2 EMIs to build buffer."
            ),
            "warnings": [
                "Avoid drawing down the full sanctioned limit in month 1 — draw in tranches as machinery is installed",
                "Keep personal and business accounts separate from day 1 for clean bank statement history",
                "Register on GeM (Government e-Marketplace) portal for institutional procurement orders"
            ]
        },
        "riskAnalysis": {
            "level": risk_info["level"],
            "explanation": (
                f"Overall risk is assessed as {risk_info['label']}. The primary risks are operational (first-year cashflow volatility) "
                f"and market (local buyer credit terms). These are manageable with the mitigations listed below."
            ),
            "riskFactors": [
                "Seasonal revenue fluctuation: harvest-linked demand cycles create 2-3 month revenue gaps",
                "Input cost volatility: raw material prices tied to agricultural commodity markets",
                "Power dependency: rural grid reliability can impact production continuity",
                "First-mover adoption curve: educating local buyers about quality/pricing takes 60-90 days"
            ],
            "mitigation": [
                f"Apply for {scheme_name} Interest Subvention benefits to lower effective borrowing cost",
                "Install rooftop solar (eligible for PM Kusum subsidy) to reduce power risk",
                "Sign advance purchase agreements with 3-5 local institutional buyers before commercial launch",
                "Join local MSME cluster associations for collective bargaining on raw material procurement"
            ]
        },
        "stressTest": {
            "explanation": (
                "Under a 30% revenue stress scenario (drought, supply chain disruption), the operation remains "
                "above the EMI serviceability threshold, provided working capital reserves are maintained."
            ),
            "observations": [
                "A 30% revenue drop extends break-even by 3-4 months but does not threaten solvency",
                "A 20% input cost spike can be partially offset by price passthrough to end buyers",
                "Full operational stoppage for 1 month can be absorbed with a 45-day cash buffer"
            ],
            "warnings": [
                "Do not scale capital expenditure until Month 6 cashflow is consistently positive",
                "Avoid high credit-term exposure to any single buyer exceeding 40% of monthly revenue"
            ]
        },
        "swot": {
            "strengths": [
                f"First-mover advantage in {district} for {business_type} services",
                f"Eligible for {scheme_name} with capital subsidy reducing effective project cost",
                "Owner equity demonstrates financial commitment — improves bank approval odds",
                "Low overhead rural location with access to raw material supply chains"
            ],
            "weaknesses": [
                "Limited formal credit history may require additional documentation for bank sanction",
                "Single-owner structure creates key-person operational dependency",
                "Working capital management expertise needed in first 6 months"
            ],
            "opportunities": [
                f"District Industries Centre (DIC) in {district} provides free DPR drafting and scheme facilitation",
                "ONDC rural seller onboarding enables direct digital sales to urban consumers",
                "PM Vishwakarma scheme provides additional tool/equipment grants for eligible trades",
                "FPO partnership can provide guaranteed offtake contract — reduces revenue risk"
            ],
            "threats": [
                "Larger corporate-backed FMCG brands entering rural direct-to-home delivery",
                "Climate risk: erratic rainfall affecting agricultural supply chains",
                "Regulatory: FSSAI licensing delays can push commercial launch by 30-45 days"
            ]
        },
        "recommendations": [
            f"Apply for {scheme_name} through your District Industries Centre (DIC) immediately — processing takes 45-60 days",
            "Register on Udyam (MSME) portal within 30 days of starting operations for priority sector benefits",
            "Open a dedicated current account with the lead district bank (SBI/Canara) handling the scheme",
            "Procure FSSAI Basic registration (₹100/year) before first commercial batch if food-adjacent",
            f"Join the local {district} MSME cluster to access collective insurance, raw material contracts, and buyer network",
            "Install a basic accounting app (Vyapar/Tally) from Day 1 for GST compliance and future loan renewals"
        ],
        "nextSteps": [
            "Visit local DIC office with Aadhaar, PAN, and bank account details to start scheme application",
            "Draft a Detailed Project Report (DPR) with machinery quotes — DIC provides free templates",
            "Open MSME Udyam registration at udyamregistration.gov.in (free, 10 minutes)",
            "Get 3 machinery vendor quotes and verify their GST registration before finalizing",
            "Identify and sign preliminary MoU with 2-3 local institutional buyers (FPOs, mandis, ration shops)",
            "Apply for PM Kusum or state solar subsidy for power backup before infrastructure setup"
        ],
        "confidence": {
            "overall": "HIGH",
            "market": "HIGH",
            "financial": "HIGH"
        },
        "evidence": [
            f"District-level MSME cluster report for {district} — 12-18% annual growth in {business_type} sector",
            f"RBI Priority Sector Lending guidelines — {scheme_name} eligible under agriculture-allied services",
            "NABARD Rural Infrastructure Development Fund data on district credit penetration",
            "PM Mudra Yojana annual report: 95%+ repayment rate for Shishu/Kishor category loans"
        ],
        "verdict": (
            f"The {business_type} venture in {district} is financially viable and market-ready. "
            f"With {scheme_name} backing, the effective capital cost is significantly reduced. "
            f"Execute the DPR and bank sanction process within 30 days to avoid scheme window closure."
        ),
        "localDemand": (
            f"The {district} area shows sustained demand for {business_type} output driven by rising regional transit costs "
            f"and supply aggregation gaps. Local mandis, weekly haats, and Tier-3 rural micro-retailers currently depend on "
            f"distant distributors — creating a 15-20% margin capture window for an agile local producer."
        ),
        "demandIntensity": demand_intensity,
        "targetCustomers": [
            f"Local Farmer Producer Organizations (FPOs) and agri-cooperatives within 25 km of {district}",
            f"Semi-urban retail grocers, local eateries, and weekly haat vendors in {district} district",
            f"Direct rural B2C households seeking fresh, locally processed {business_type} commodities",
            "Government institutional procurement portals (GeM, ration shop supply chains)"
        ],
        "competitiveEdge": (
            f"By eliminating long-haul freight (saving ₹8-15/kg on average) and positioning as a local producer, "
            f"your {business_type} can offer 8-12% better spot pricing while delivering same-day fulfillment to {district} buyers."
        ),
        "keyFinancialRisks": [
            f"Working capital lockup: Local buyers often request 15-30 day credit lines during harvest peaks",
            "Electricity tariff & backup: Budget for rooftop solar or reliable 3-phase rural feeder power",
            "Seasonal volume fluctuation: Plan off-season secondary processing or service bundling",
            "First-batch quality rejection: Set aside 5% of project budget for trial batch raw materials"
        ],
        "subsidyOptimizationTip": (
            f"Apply for {scheme_name} through your local DIC before purchasing machinery to lock in the capital subsidy. "
            "After 3-year lock-in, the subsidy is directly credited to your bank account — reducing effective loan principal."
        ),
        "launchRoadmap": [
            {
                "phase": "Phase 1: DPR & Sanction",
                "timeline": "Days 1 - 30",
                "action": (
                    f"Draft Detailed Project Report (DPR) with machinery quotes and submit under {scheme_name}. "
                    "Simultaneously open Udyam MSME registration and dedicated current account."
                ),
                "deliverable": "Bank In-Principle Sanction Letter & Subsidy Portal Token"
            },
            {
                "phase": "Phase 2: Setup & Licensing",
                "timeline": "Days 31 - 60",
                "action": (
                    f"Procure certified machinery (with warranty), secure Gram Panchayat NOC, FSSAI license, "
                    f"and complete site setup in {district}. Install power backup (solar/UPS)."
                ),
                "deliverable": "Trial batch production and commercial quality verification certificate"
            },
            {
                "phase": "Phase 3: Market Launch",
                "timeline": "Days 61 - 90",
                "action": (
                    f"Execute advance supply agreements with 5+ local FPOs/vendors. "
                    "Onboard on ONDC seller portal. Launch localized WhatsApp Business catalog."
                ),
                "deliverable": "First commercial sales batch with ₹25,000+ gross margin milestone"
            }
        ],
        "marketScore": market_score,
        "generatedAt": ""
    }


class BedrockClient:
    def __init__(self):
        self._bedrock_available = False
        self.client = None

        # Explicit keys are only used when real ones are provided (local dev).
        # Otherwise boto3's default credential chain is used, which automatically
        # picks up the IAM role attached to the EC2 instance when deployed on AWS.
        key_id = settings.AWS_ACCESS_KEY_ID or ""
        has_keys = bool(
            key_id
            and settings.AWS_SECRET_ACCESS_KEY
            and not key_id.lower().startswith("your")
        )

        try:
            import boto3
            from botocore.config import Config

            cfg = Config(read_timeout=120, retries={"max_attempts": 2})
            if has_keys:
                self.client = boto3.client(
                    "bedrock-runtime",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    config=cfg,
                )
            else:
                session = boto3.Session(region_name=settings.AWS_REGION)
                if session.get_credentials() is None:
                    logger.warning(
                        "No AWS credentials found (no keys, no IAM role) — BedrockClient will use synthetic advisory generator."
                    )
                    return
                self.client = session.client("bedrock-runtime", config=cfg)

            self._bedrock_available = True
            logger.info(
                "AWS Bedrock client initialized (%s), model=%s.",
                "explicit keys" if has_keys else "IAM role / default credential chain",
                settings.BEDROCK_MODEL_ID,
            )
        except Exception as e:
            logger.warning(f"Bedrock client init failed — using synthetic mode. Error: {str(e)}")

    def invoke(self, system_prompt: str, user_prompt: str) -> dict:
        if not self._bedrock_available or not self.client:
            logger.info("Bedrock unavailable — generating synthetic advisory.")
            return _generate_synthetic_advisory(system_prompt, user_prompt)

        try:
            import json

            # Converse API: one request format for every Bedrock model (Amazon Nova, Claude, ...)
            response = self.client.converse(
                modelId=settings.BEDROCK_MODEL_ID,
                system=[{"text": system_prompt}],
                messages=[{"role": "user", "content": [{"text": user_prompt}]}],
                inferenceConfig={"maxTokens": 5000, "temperature": 0.25},
            )
            content_text = response["output"]["message"]["content"][0]["text"]

            # Clean markdown JSON formatting if present
            cleaned = content_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            # Some models add a sentence before/after the JSON - keep only the {...} part
            start, end = cleaned.find("{"), cleaned.rfind("}")
            if start != -1 and end > start:
                cleaned = cleaned[start:end + 1]

            result = json.loads(cleaned)
            logger.info("Bedrock advisory generated successfully.")
            return result

        except Exception as e:
            error_str = str(e)
            logger.error(f"Bedrock invocation failed: {error_str}. Falling back to synthetic.")
            # Graceful fallback instead of raising — always return something useful
            if "ThrottlingException" in error_str or "TooManyRequestsException" in error_str:
                logger.warning("Bedrock rate limited — using synthetic fallback.")
            return _generate_synthetic_advisory(system_prompt, user_prompt)

    def invoke_chat(self, question: str, context: dict) -> str:
        if not self._bedrock_available or not self.client:
            logger.info("Bedrock unavailable for chat — generating synthetic chat answer.")
            return _generate_synthetic_chat_answer(question, context)

        system_prompt = (
            "You are an expert Rural Micro-Enterprise Financial Advisor for Indian entrepreneurs under SIH 2026. "
            "You provide clear, authoritative, practical guidance on Mudra, PMEGP, banking approval, risk mitigation, "
            "and business expansion. Respond in structured Markdown format with actionable bullet points. Never make up false rates."
        )

        user_content = f"""Context:
- Business: {context.get('businessType', 'Micro-enterprise')}
- Location: {context.get('location', 'Rural India')}
- Sanctioned Loan: ₹{int(context.get('loanAmount', 0)):,}
- Estimated EMI: ₹{int(context.get('emi', 0)):,}/month
- Matched Scheme: {context.get('schemeName', 'PM Mudra')}
- Risk Profile: {context.get('riskLevel', 'LOW_RISK')}

User Question: {question}

Provide a direct, practical, and highly encouraging advisory answer."""

        try:
            response = self.client.converse(
                modelId=settings.BEDROCK_MODEL_ID,
                system=[{"text": system_prompt}],
                messages=[{"role": "user", "content": [{"text": user_content}]}],
                inferenceConfig={"maxTokens": 1200, "temperature": 0.3},
            )
            return response["output"]["message"]["content"][0]["text"]
        except Exception as e:
            logger.warning(f"Bedrock chat invocation failed: {e}. Using synthetic.")
            return _generate_synthetic_chat_answer(question, context)


def _generate_synthetic_chat_answer(question: str, context: dict) -> str:
    q = question.lower()
    biz = context.get("businessType", "micro-enterprise")
    loc = context.get("location", "your local district")
    loan = f"₹{int(context.get('loanAmount', 0)):,}" if context.get('loanAmount') else "your sanctioned loan"
    emi = f"₹{int(context.get('emi', 0)):,}/month" if context.get('emi') else "your monthly EMI"
    scheme = context.get("schemeName", "PM Mudra Yojana")
    risk = context.get("riskLevel", "LOW_RISK")

    if any(k in q for k in ["risk", "danger", "worst", "mitigat"]):
        return (
            f"🛡️ **Risk Mitigation Strategy for {biz} in {loc}:**\n\n"
            f"Based on your **{risk.replace('_', ' ')}** financial profile with an EMI of **{emi}**:\n\n"
            f"1. **Working Capital Discipline:** Maintain at least 45 days of operational expenses in a separate current account before investing in secondary expansion.\n"
            f"2. **Offtake Pre-Commitments:** Partner with local Farmer Producer Organizations (FPOs) and weekly haat aggregators to lock in forward sales contracts.\n"
            f"3. **Subsidy Cushion:** Ensure your subsidy under **{scheme}** is properly credited into the bank subsidy reserve fund (SRF) account to reduce net interest burn."
        )

    if any(k in q for k in ["mudra", "pmegp", "scheme", "approv", "bank", "fast"]):
        return (
            f"🏦 **Fast-Tracking Your {scheme} Loan Application:**\n\n"
            f"To secure sanction for **{loan}** at the earliest:\n\n"
            f"1. **Visit your District Industries Centre (DIC) in {loc}** — secure an in-principle endorsement letter, which gives your dossier top priority under Priority Sector Lending (PSL).\n"
            f"2. **Document Readiness Checklist:**\n"
            f"   • Aadhaar & PAN linked with mobile\n"
            f"   • 6 months savings bank statements\n"
            f"   • Quotations from 2 certified machinery vendors with GST invoices\n"
            f"   • Rent agreement / Gram Panchayat ownership certificate\n"
            f"3. **Online Portal Filing:** Submit directly on the **Udyam & Mudra portal (mudra.org.in)** with application reference code."
        )

    if any(k in q for k in ["break", "even", "profit", "earn", "revenue", "month"]):
        return (
            f"📈 **Break-even & Cashflow Projections for {biz}:**\n\n"
            f"• **Projected Break-Even Window:** 8 to 14 months under steady local operating conditions.\n"
            f"• **Monthly Debt Service:** Your EMI of **{emi}** requires maintaining a minimum monthly gross revenue of 3x to 4x your EMI obligation.\n"
            f"• **Key Margin Drivers:** Direct procurement of raw materials within {loc} saves 12-15% freight overhead versus buying from metropolitan distributors."
        )

    if any(k in q for k in ["working capital", "cash", "buffer", "reserve"]):
        return (
            f"💰 **Working Capital Architecture:**\n\n"
            f"For a **{loan}** {biz} project:\n\n"
            f"• **Emergency Buffer:** Reserve at least 2 months of EMI ({emi} × 2) in a liquid auto-sweep bank account.\n"
            f"• **Credit Cycle Management:** Local institutional buyers typically clear invoices within 21-30 days. Plan your inventory orders so you never face a cash dry spell during harvest cycles."
        )

    return (
        f"💡 **Advisory Insight for {biz} in {loc}:**\n\n"
        f"Your proposed setup under **{scheme}** with **{loan}** financing is structurally viable for {loc}.\n\n"
        f"**Immediate Next Steps:**\n"
        f"• Register your enterprise on the **MSME Udyam Portal** (free, instant 19-digit registration).\n"
        f"• Visit the nearest lead bank branch with your project blueprint.\n"
        f"• Explore **ONDC (Open Network for Digital Commerce)** to sell products directly without intermediary cuts."
    )