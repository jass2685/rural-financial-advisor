import { LoanFormInput, PlanEvaluationResult, AiAdvisoryResult, CreditRisk, SchemeDetails } from '../types';

// Local dev: talks straight to the local servers.
// Docker/AWS build: nginx proxies /api -> Spring Boot and /ai -> FastAPI (set in frontend/Dockerfile).
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
export const AI_BASE_URL: string = import.meta.env.VITE_AI_BASE_URL ?? 'http://localhost:8000';

/**
 * Utility to format numbers into standard Indian Rupee notation (e.g., ₹1,80,000)
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format in readable Lakhs or Crores shorthand for stats
 */
export function formatLakhs(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

/**
 * Determines the best matched government scheme based on capital, location, and project size.
 */
export function determineGovScheme(
  projectBudget: number,
  opts?: { schemeName?: string; socialCategory?: string }
): SchemeDetails {
  // Prefer the scheme chosen by the Spring Boot engine so every screen shows the same scheme
  const backendScheme = opts?.schemeName;
  const isKishor = backendScheme ? backendScheme.includes('Kishor') : false;
  const isPmegp = backendScheme ? backendScheme.startsWith('PMEGP') : false;
  if (!isPmegp && !isKishor && projectBudget <= 50000) {
    return {
      name: 'PM Mudra Yojana (Shishu)',
      badge: 'Zero Collateral',
      subsidyPercent: 0,
      subsidyAmount: 0,
      maxLimit: 50000,
      collateralFree: true,
      interestSubvention: '7.5% - 9.0% Base Rate',
      description: 'Zero processing fee, immediate disbursement for micro-scale rural micro-enterprises.',
      portalUrl: 'https://www.mudra.org.in'
    };
  } else if (isKishor || (!isPmegp && projectBudget <= 500000)) {
    const subsidy = projectBudget * 0.15;
    return {
      name: 'PM Mudra - Kishor',
      badge: 'Guaranteed by CGFMU',
      subsidyPercent: 15,
      subsidyAmount: subsidy,
      maxLimit: 500000,
      collateralFree: true,
      interestSubvention: '8.50% - 9.85% p.a.',
      description: 'Ideal for equipment purchase and working capital. No third-party collateral required under Mudra Credit Guarantee.',
      portalUrl: 'https://www.mudra.org.in'
    };
  } else if (!isPmegp && projectBudget <= 1000000) {
    return {
      name: 'PM Mudra Yojana (Tarun)',
      badge: 'High Growth Micro-Cap',
      subsidyPercent: 20,
      subsidyAmount: projectBudget * 0.20,
      maxLimit: 1000000,
      collateralFree: true,
      interestSubvention: '8.80% - 10.25% p.a.',
      description: 'Tailored for expanding village manufacturing, cold rooms, sorting units, and tech-enabled agro logistics.',
      portalUrl: 'https://www.mudra.org.in'
    };
  } else {
    // PMEGP rural margin money: 25% General, 35% Special (Women/SC/ST/OBC/NER)
    const ruralSubsidyRate = opts?.socialCategory?.startsWith('Special') ? 0.35 : 0.25;
    const subsidyPct = Math.round(ruralSubsidyRate * 100);
    const subsidy = Math.min(projectBudget * ruralSubsidyRate, 5000000 * ruralSubsidyRate);
    return {
      name: 'PMEGP (Rural)',
      badge: `${subsidyPct}% Rural Subsidy`,
      subsidyPercent: subsidyPct,
      subsidyAmount: subsidy,
      maxLimit: 5000000,
      collateralFree: projectBudget <= 2500000,
      interestSubvention: 'Margin Money direct capital subsidy credited to bank account after 3-year lock-in.',
      description: 'Flagship central scheme for rural industrialization and agro-processing. ' + subsidyPct + '% government grant on project cost.',
      portalUrl: 'https://www.kviconline.gov.in/pmegpeportal'
    };
  }
}

/**
 * High-precision deterministic rural banking engine fallback
 */
function calculateDeterministicPlan(input: LoanFormInput): PlanEvaluationResult {
  const tenureYears = input.tenureYears || 5;
  const tenureMonths = tenureYears * 12;
  const annualInterestRate = 0.095; // 9.5% annual benchmark
  const monthlyRate = annualInterestRate / 12;

  // Maximum safe FOIR (Fixed Obligation to Income Ratio) = 45% of monthly income
  const maxSafeMonthlyEmi = input.monthlyIncome * 0.45;

  // Calculate maximum principal borrower can safely amortize given EMI cap
  // Formula: P = EMI * (1 - (1 + r)^-n) / r
  const rawMaxLoan = maxSafeMonthlyEmi * ((1 - Math.pow(1 + monthlyRate, -tenureMonths)) / monthlyRate);

  // Round safe loan to nearest sensible bank slab (nearest ₹5,000)
  const maxSafeLoanAmount = Math.max(25000, Math.round(rawMaxLoan / 5000) * 5000);

  // Exact EMI for this rounded safe loan
  const estimatedEmi = Math.round(
    (maxSafeLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const totalSafeProjectBudget = maxSafeLoanAmount + (input.ownCapital || 0);
  const schemeDetails = determineGovScheme(totalSafeProjectBudget, { socialCategory: input.socialCategory });

  // FOIR & Leverage metrics
  const foirPercent = Math.round((estimatedEmi / input.monthlyIncome) * 100);
  const equityRatio = input.ownCapital / (totalSafeProjectBudget || 1);

  // Risk Classification
  let creditRisk: CreditRisk = 'LOW_RISK';
  let riskReason = '';
  let recommendation = '';

  if (foirPercent <= 38 && equityRatio >= 0.15) {
    creditRisk = 'LOW_RISK';
    riskReason = `Comfortable debt serviceability (FOIR at ${foirPercent}% vs 45% ceiling) with healthy ${(equityRatio * 100).toFixed(0)}% owner equity.`;
    recommendation = `Optimal candidate for priority-sector fast-track approval under ${schemeDetails.name}. Maintain simple passbook records for the last 6 months.`;
  } else if (foirPercent <= 48 && equityRatio >= 0.08) {
    creditRisk = 'MODERATE_RISK';
    riskReason = `Moderate repayment load (${foirPercent}% of current monthly income). Safe if seasonal cashflow fluctuates within normal agricultural cycles.`;
    recommendation = `Bankers may request an active co-borrower (spouse/family member) or proof of auxiliary income. Consider a 6-year tenor to lower monthly EMI.`;
  } else {
    creditRisk = 'HIGH_RISK';
    riskReason = `Elevated debt leverage (${foirPercent}% of monthly income). Monthly EMI consumes over half of regular cashflow.`;
    recommendation = `To secure bank clearance, consider increasing personal capital contribution by ₹${(maxSafeLoanAmount * 0.15).toLocaleString('en-IN')} or starting with phased machinery procurement.`;
  }

  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    maxSafeLoanAmount,
    totalSafeProjectBudget,
    estimatedEmi,
    matchedGovScheme: schemeDetails.name,
    schemeDetails,
    creditRisk,
    foirPercent,
    dscr: parseFloat(((input.monthlyIncome * 0.75) / (estimatedEmi || 1)).toFixed(2)),
    riskReason,
    recommendation,
    calculatedInterestRate: 9.5,
    tenureMonths,
    userInput: input,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates rich, contextual AI strategy fallback based on Indian rural micro-economics
 */
function generateContextualAdvisory(planId: string, input: LoanFormInput, plan?: PlanEvaluationResult): AiAdvisoryResult {
  const loc = input.location.trim() || 'Rural India';
  const biz = input.dreamBusiness.trim() || 'Agro-Allied Enterprise';
  const safeLoanFormatted = formatINR(plan?.maxSafeLoanAmount || 200000);
  const totalBudgetFormatted = formatINR(plan?.totalSafeProjectBudget || 300000);
  const emiFormatted = formatINR(plan?.estimatedEmi || 4200);

  return {
    planId,
    verdict: `A project budget of ${totalBudgetFormatted} (with ${safeLoanFormatted} institutional debt) is fundamentally viable for ${biz} in the ${loc} cluster, provided working capital is insulated against 45-day local credit trade cycles. At ${emiFormatted}/month debt servicing, your operating margin must sustain at least 22-28% gross product margin after raw material and power expenses.`,
    localDemand: `The ${loc} catchment area displays sustained demand for decentralized ${biz} services due to rising regional transit costs and supply aggregation needs. Neighboring mandis, weekly haats, and Tier-3 rural micro-retailers currently rely on distant distributors—creating a 15-20% margin capture window for an agile local producer.`,
    demandIntensity: 'High Growth',
    targetCustomers: [
      `Local Farmer Producer Organizations (FPOs) and agri-cooperatives within 25 km of ${loc}`,
      `Semi-urban retail grocers, local eateries, and weekly rural market (Haat) vendors`,
      `Direct-to-consumer rural households seeking fresh, locally processed commodities`,
      `Government institutional buyers via GeM (Government e-Marketplace) portal`
    ],
    competitiveEdge: `By avoiding long-haul freight and intermediary trader markups, your ${biz} can offer 8-12% better spot pricing while delivering same-day fulfillment to ${loc} customers.`,
    keyFinancialRisks: [
      `Working capital lockup: Local buyers often request 15-30 day credit lines during harvest peaks.`,
      `Electricity tariff & backup: Essential to budget for rooftop solar or reliable 3-phase rural feeder power.`,
      `Seasonal volume fluctuation: Ensure off-season secondary processing or service bundling.`,
      `First-batch rejection risk: Set aside 5% of project budget for trial batch and quality testing.`
    ],
    subsidyOptimizationTip: `Apply for ${plan?.matchedGovScheme || 'PMEGP'} through your local District Industries Centre (DIC) or Lead District Bank before purchasing machinery to lock in capital subsidy.`,
    launchRoadmap: [
      {
        phase: 'Phase 1: DPR & Sanction',
        timeline: 'Days 1 - 30',
        action: `Draft Detailed Project Report (DPR) itemizing machinery quotes and submit under ${plan?.matchedGovScheme || 'Mudra'}. Open Udyam MSME registration simultaneously.`,
        deliverable: 'Bank In-Principle Sanction Letter & Subsidy Portal Token'
      },
      {
        phase: 'Phase 2: Setup & Licensing',
        timeline: 'Days 31 - 60',
        action: `Procure certified machinery with vendor warranty, secure local Gram Panchayat NOC / FSSAI license, and set up workshop in ${loc}. Install power backup.`,
        deliverable: 'Trial batch production and commercial quality verification'
      },
      {
        phase: 'Phase 3: Market Launch',
        timeline: 'Days 61 - 90',
        action: `Execute advance purchase agreements with 10+ local vendors, onboard on ONDC seller portal, and initiate localized WhatsApp Business catalog.`,
        deliverable: 'First commercial batch achieving ₹25,000+ monthly gross margin'
      }
    ],
    marketScore: 85,
    generatedAt: new Date().toISOString(),

    // Rich advisory fields — always populated in local fallback too
    summary: `Your ${biz} venture in ${loc} demonstrates strong market alignment and viable financial fundamentals. With ${plan?.matchedGovScheme || 'government scheme'} backing, the effective capital cost is reduced significantly. Disciplined cashflow management in the first 6 months is the critical success factor.`,
    businessViability: {
      explanation: `A ${biz} operation in ${loc} is fundamentally sound given the regional demand dynamics. The debt load of ${safeLoanFormatted} at ${emiFormatted}/month sits within acceptable serviceability bounds. Ensuring working capital is not over-leveraged during the first 6 months is the critical success factor.`,
      keyFactors: [
        `Strong alignment with ${plan?.matchedGovScheme || 'PM Mudra Yojana'} eligibility criteria`,
        `Local demand for ${biz} services in ${loc} is growing at 12-18% annually`,
        'Owner equity participation reduces bank exposure and signals financial commitment',
        'Phased machinery procurement limits upfront capex burn rate'
      ]
    },
    marketOpportunity: {
      summary: `The ${loc} catchment has a structural supply gap for ${biz} services. Rising regional transit costs give a locally-based unit a 10-18% freight cost advantage.`,
      evidence: [
        `District-level data shows 15-20% unmet demand for ${biz} output in ${loc}`,
        'FPO aggregation hubs within 25 km create built-in institutional offtake channels',
        'ONDC platform enables direct digital B2B ordering from rural producers',
        'Weekly haat vendor surveys indicate buyers travelling 30+ km for similar products'
      ],
      confidence: 'HIGH' as const
    },
    financialExplanation: {
      summary: `Monthly debt servicing of ${emiFormatted} is manageable with a target gross margin of 22-28%. Operating at 60-70% capacity utilization by Month 3 is recommended.`,
      cashFlowObservation: 'Cash inflows from institutional buyers typically arrive on Net-30 credit terms. Maintaining a 45-day working capital buffer prevents EMI default during lean seasons.',
      emiObservation: `The EMI falls within the RBI-recommended FOIR threshold. During agricultural off-seasons, pre-paying 1-2 EMIs builds a useful buffer.`,
      warnings: [
        'Avoid drawing the full loan amount in Month 1 — draw in tranches as machinery is installed',
        'Keep personal and business bank accounts completely separate from Day 1',
        'Register on GeM portal for institutional procurement orders within 30 days of launch'
      ]
    },
    riskAnalysis: {
      level: 'MEDIUM' as const,
      explanation: 'Overall risk is moderate. Primary risks are operational (first-year cashflow volatility) and market (buyer credit terms). Both are manageable with proper working capital planning.',
      riskFactors: [
        'Seasonal revenue fluctuation: harvest-linked demand creates 2-3 month revenue gaps',
        'Input cost volatility: raw material prices tied to agricultural commodity markets',
        'Power dependency: rural grid reliability can impact production continuity',
        'First-mover adoption curve: educating local buyers about quality/pricing takes 60-90 days'
      ],
      mitigation: [
        `Apply for ${plan?.matchedGovScheme || 'PMEGP'} Interest Subvention to lower effective borrowing cost`,
        'Install rooftop solar (eligible for PM Kusum subsidy) to reduce power risk',
        'Sign advance purchase agreements with 3-5 institutional buyers before commercial launch',
        'Join local MSME cluster for collective bargaining on raw material procurement'
      ]
    },
    stressTest: {
      explanation: 'Under a 30% revenue stress scenario (drought, supply chain disruption), the operation remains above EMI serviceability threshold with proper working capital reserves.',
      observations: [
        'A 30% revenue drop extends break-even by 3-4 months but does not threaten solvency',
        'A 20% input cost spike can be partially offset by price passthrough to end buyers'
      ],
      warnings: [
        'Do not scale capital expenditure until Month 6 cashflow is consistently positive',
        'Avoid high credit-term exposure to any single buyer exceeding 40% of monthly revenue'
      ]
    },
    swot: {
      strengths: [
        `First-mover advantage in ${loc} for ${biz} services`,
        `Eligible for ${plan?.matchedGovScheme || 'PM Mudra Yojana'} with capital subsidy`,
        'Owner equity demonstrates financial commitment — improves bank approval odds',
        'Low overhead rural location with access to raw material supply chains'
      ],
      weaknesses: [
        'Limited formal credit history may require additional documentation',
        'Single-owner structure creates key-person operational dependency',
        'Working capital management expertise needed in first 6 months'
      ],
      opportunities: [
        `District Industries Centre (DIC) in ${loc} provides free DPR drafting and scheme facilitation`,
        'ONDC rural seller onboarding enables direct digital sales to urban consumers',
        'PM Vishwakarma scheme provides additional tool/equipment grants for eligible trades',
        'FPO partnership can provide guaranteed offtake contract — reduces revenue risk'
      ],
      threats: [
        'Corporate-backed FMCG brands entering rural direct-to-home delivery channels',
        'Climate risk: erratic rainfall affecting agricultural supply chains',
        'FSSAI licensing delays can push commercial launch by 30-45 days'
      ]
    },
    recommendations: [
      `Apply for ${plan?.matchedGovScheme || 'PMEGP'} through your District Industries Centre (DIC) immediately`,
      'Register on Udyam (MSME) portal within 30 days of starting operations',
      'Open a dedicated current account with the lead district bank handling the scheme',
      'Procure FSSAI Basic registration (₹100/year) before first commercial batch',
      `Join the local ${loc} MSME cluster for collective insurance and raw material contracts`,
      'Install a basic accounting app (Vyapar/Tally) from Day 1 for GST compliance'
    ],
    nextSteps: [
      'Visit local DIC office with Aadhaar, PAN, and bank account details to start scheme application',
      'Draft a Detailed Project Report (DPR) with machinery quotes — DIC provides free templates',
      'Open MSME Udyam registration at udyamregistration.gov.in (free, 10 minutes)',
      'Get 3 machinery vendor quotes and verify their GST registration before finalizing',
      'Identify and sign preliminary MoU with 2-3 local institutional buyers (FPOs, mandis)'
    ],
    evidence: [
      `District-level MSME cluster report for ${loc} — 12-18% annual growth in ${biz} sector`,
      `RBI Priority Sector Lending guidelines — ${plan?.matchedGovScheme || 'PM Mudra'} eligible`,
      'NABARD Rural Infrastructure Development Fund data on district credit penetration',
      'PM Mudra Yojana annual report: 95%+ repayment rate for Kishor category loans'
    ]
  };
}

/**
 * POST /api/plans
 * Evaluates bank eligibility using Spring Boot API with fallback to deterministic calculator
 */
export async function createPlan(data: LoanFormInput): Promise<{ result: PlanEvaluationResult; isLiveApi: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Map to Spring Boot PlanRequest schema (businessType + location + ownCapital + monthlyIncome)
    const requestPayload = {
      location: data.location,
      businessType: data.dreamBusiness,
      dreamBusiness: data.dreamBusiness,
      ownCapital: Number(data.ownCapital),
      monthlyIncome: Number(data.monthlyIncome),
      tenureYears: data.tenureYears || 5
    };

    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const liveData = await response.json();
      console.log('[API] Live response from Spring Boot backend:', liveData);

      const schemeName = liveData.schemeName || liveData.matchedGovScheme || 'PM Mudra - Kishor';
      const totalBudget = Number(liveData.totalSafeProjectBudget) || (Number(liveData.maxSafeLoanAmount) + Number(data.ownCapital));
      const safeLoan = Number(liveData.maxSafeLoanAmount) || 0;
      const emi = Number(liveData.emi) || Number(liveData.estimatedEmi) || 0;
      const riskLevel = (liveData.riskLevel || liveData.creditRisk || 'LOW_RISK') as CreditRisk;
      const foir = Math.round((emi / (data.monthlyIncome || 1)) * 100);

      const mappedResult: PlanEvaluationResult = {
        id: liveData.id ? String(liveData.id) : `plan_${Date.now()}`,
        maxSafeLoanAmount: safeLoan,
        totalSafeProjectBudget: totalBudget,
        estimatedEmi: emi,
        matchedGovScheme: schemeName,
        schemeDetails: determineGovScheme(totalBudget, { schemeName, socialCategory: data.socialCategory }),
        creditRisk: riskLevel,
        foirPercent: foir,
        dscr: parseFloat(((data.monthlyIncome * 0.75) / (emi || 1)).toFixed(2)),
        riskReason: riskLevel === 'LOW_RISK'
          ? `Healthy repayment cushion with ${foir}% FOIR, approved by Spring Boot Banking Engine.`
          : riskLevel === 'MODERATE_RISK'
          ? `Repayment is at ${foir}% of monthly income. Spring Boot Engine recommends maintaining liquidity reserves.`
          : `High repayment leverage. Project requires additional capital or phased investments.`,
        recommendation: `Sanctioned under ${schemeName}. Priority Sector Lending documentation required.`,
        calculatedInterestRate: Number(liveData.annualInterestRate) || 9.5,
        tenureMonths: Number(liveData.tenureMonths) || (data.tenureYears || 5) * 12,
        userInput: data,
        createdAt: new Date().toISOString(),
      };

      return {
        result: mappedResult,
        isLiveApi: true,
      };
    }
    
    console.warn(`[API] Server responded with status ${response.status}. Using local simulation.`);
    return {
      result: calculateDeterministicPlan(data),
      isLiveApi: false,
    };
  } catch (err) {
    console.info('[API] Spring Boot backend at http://localhost:8080/api/plans is offline. Using local engine.', err);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      result: calculateDeterministicPlan(data),
      isLiveApi: false,
    };
  }
}

/**
 * POST /api/plans/{id}/advisory
 * Generates AI Strategic Advisory with Spring Boot backend endpoint and hyper-local fallback
 */
export async function generateAdvisory(
  planId: string,
  context?: { input: LoanFormInput; planResult?: PlanEvaluationResult }
): Promise<{ advisory: AiAdvisoryResult; isLiveApi: boolean }> {
  const mapResponseToAdvisory = (liveData: any): AiAdvisoryResult => ({
    planId,
    // Core display fields
    verdict: liveData.verdict || liveData.summary || 'AI advisory generated successfully.',
    localDemand: liveData.localDemand || liveData.marketOpportunity?.summary || `Market analysis for ${context?.input.location || 'your region'}.`,
    demandIntensity: liveData.demandIntensity || 'High Growth',
    targetCustomers: liveData.targetCustomers || [
      `Local FPOs and agri-cooperatives in ${context?.input.location || 'the district'}`,
      `Semi-urban retail grocers and weekly haat vendors`,
      `Direct rural B2C households`
    ],
    competitiveEdge: liveData.competitiveEdge || `Direct regional processing eliminates freight and intermediary markups in ${context?.input.location}.`,
    keyFinancialRisks: liveData.keyFinancialRisks || [
      `Working capital lockup: Maintain a 30-45 day cash buffer for buyer credit terms.`,
      `Power & Backup: Ensure rural 3-phase connection or install solar backup.`
    ],
    subsidyOptimizationTip: liveData.subsidyOptimizationTip || `Apply for ${context?.planResult?.matchedGovScheme || 'PMEGP'} through your local DIC before machinery purchase.`,
    launchRoadmap: liveData.launchRoadmap || [
      {
        phase: 'Phase 1: DPR & Sanction',
        timeline: 'Days 1 - 30',
        action: `Draft Detailed Project Report and submit under ${context?.planResult?.matchedGovScheme || 'Mudra'}.`,
        deliverable: 'Bank In-Principle Sanction Letter'
      },
      {
        phase: 'Phase 2: Setup & Licensing',
        timeline: 'Days 31 - 60',
        action: `Procure machinery, secure Gram Panchayat NOC, FSSAI license, and complete site setup.`,
        deliverable: 'Trial batch production certificate'
      },
      {
        phase: 'Phase 3: Market Launch',
        timeline: 'Days 61 - 90',
        action: `Execute supply agreements with 5+ local institutional buyers and onboard on ONDC.`,
        deliverable: 'First commercial batch with positive margin'
      }
    ],
    marketScore: liveData.marketScore || 85,
    generatedAt: liveData.generatedAt || new Date().toISOString(),

    // Rich LLM fields — pass through directly if present
    summary: liveData.summary,
    businessViability: liveData.businessViability,
    marketOpportunity: liveData.marketOpportunity,
    financialExplanation: liveData.financialExplanation,
    riskAnalysis: liveData.riskAnalysis,
    stressTest: liveData.stressTest,
    swot: liveData.swot,
    recommendations: liveData.recommendations,
    nextSteps: liveData.nextSteps,
    confidence: liveData.confidence,
    evidence: liveData.evidence,
  });

  // 1. Try Spring Boot backend endpoint first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${API_BASE_URL}/plans/${encodeURIComponent(planId)}/advisory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(context?.input || {}),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const liveData = await response.json();
      console.log('[API] Live Advisory response from Spring Boot:', liveData);
      return {
        advisory: mapResponseToAdvisory(liveData),
        isLiveApi: true,
      };
    }
  } catch (err) {
    console.info('[API] Spring Boot advisory endpoint at :8080 unreachable, checking Python AI Service directly...', err);
  }

  // 2. Direct fallback to Python FastAPI LLM Service (port 8000)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const pyPayload = {
      businessInfo: {
        businessType: context?.input.dreamBusiness || 'Rural Micro Enterprise',
        location: context?.input.location || 'Rural India',
        district: context?.input.location || 'Rural India',
        language: 'en',
      },
      financialInfo: {
        capital: context?.input.ownCapital || 50000,
        projectCost: context?.planResult?.totalSafeProjectBudget || 500000,
        loanAmount: context?.planResult?.maxSafeLoanAmount || 400000,
        emi: context?.planResult?.estimatedEmi || 8400,
        monthlyRevenue: context?.input.monthlyIncome || 35000,
        riskLevel: context?.planResult?.creditRisk || 'LOW_RISK',
      },
      schemeInfo: {
        schemeName: context?.planResult?.matchedGovScheme || 'PM Mudra Yojana',
      }
    };

    const pyResponse = await fetch(`${AI_BASE_URL}/v1/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pyPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (pyResponse.ok) {
      const pyData = await pyResponse.json();
      console.log('[API] Direct Live Advisory response from Python AI Service (:8000):', pyData);
      return {
        advisory: mapResponseToAdvisory(pyData),
        isLiveApi: true,
      };
    }
  } catch (pyErr) {
    console.info('[API] Python AI service at :8000 unreachable. Using local intelligent simulation.', pyErr);
  }

  // 3. Fallback: Local intelligent generator
  await new Promise(resolve => setTimeout(resolve, 600));
  const simulated = generateContextualAdvisory(
    planId,
    context?.input || { location: 'Rural India', dreamBusiness: 'Micro Enterprise', ownCapital: 100000, monthlyIncome: 35000 },
    context?.planResult
  );
  return {
    advisory: simulated,
    isLiveApi: false,
  };
}

/**
 * Sends a message to the AI Chat endpoint (Python :8000/v1/chat)
 */
export async function sendChatMessage(
  question: string,
  context: {
    businessType?: string;
    location?: string;
    loanAmount?: number;
    emi?: number;
    schemeName?: string;
    riskLevel?: string;
    language?: string;
  }
): Promise<{ answer: string; sources?: string[]; isLiveApi: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${AI_BASE_URL}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, ...context }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.answer) {
        return { answer: data.answer, sources: data.sources || [], isLiveApi: true };
      }
    }
  } catch (err) {
    console.info('[Chat API] Python chat endpoint unreachable, using local intelligence engine.');
  }

  return { answer: '', sources: [], isLiveApi: false };
}

/**
 * Checks connectivity to both microservices (Spring Boot :8080 and Python :8000)
 */
export async function checkServicesHealth(): Promise<{ springBoot: boolean; pythonLlm: boolean }> {
  let springBoot = false;
  let pythonLlm = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/plans/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    springBoot = res.ok;
  } catch {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${AI_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    pythonLlm = res.ok;
  } catch {}

  return { springBoot, pythonLlm };
}

