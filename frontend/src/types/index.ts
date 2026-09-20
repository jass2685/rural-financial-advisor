export type CreditRisk = 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
export type DemandIntensity = 'High Growth' | 'Moderate' | 'Niche Emerging';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export interface LoanFormInput {
  location: string;
  dreamBusiness: string;
  ownCapital: number;
  monthlyIncome: number;
  tenureYears?: number;
  socialCategory?: 'General' | 'Special (Women/SC/ST/OBC/NER)';
}

export interface SchemeDetails {
  name: string;
  badge: string;
  subsidyPercent: number;
  subsidyAmount: number;
  maxLimit: number;
  collateralFree: boolean;
  interestSubvention: string;
  description: string;
  portalUrl: string;
}

export interface PlanEvaluationResult {
  id: string;
  maxSafeLoanAmount: number;
  totalSafeProjectBudget: number;
  estimatedEmi: number;
  matchedGovScheme: string;
  schemeDetails: SchemeDetails;
  creditRisk: CreditRisk;
  foirPercent: number;
  dscr: number;
  riskReason: string;
  recommendation: string;
  calculatedInterestRate: number;
  tenureMonths: number;
  userInput: LoanFormInput;
  createdAt: string;
}

export interface MilestoneStep {
  phase: string;
  timeline: string;
  action: string;
  deliverable: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface BusinessViability {
  explanation: string;
  keyFactors: string[];
}

export interface MarketOpportunity {
  summary: string;
  evidence: string[];
  confidence: ConfidenceLevel;
}

export interface FinancialExplanation {
  summary: string;
  cashFlowObservation: string;
  emiObservation: string;
  warnings: string[];
}

export interface RiskAnalysis {
  level: RiskLevel;
  explanation: string;
  riskFactors: string[];
  mitigation: string[];
}

export interface StressTest {
  explanation: string;
  observations: string[];
  warnings: string[];
}

export interface AiAdvisoryResult {
  // Core fields (always present)
  planId: string;
  verdict: string;
  localDemand: string;
  demandIntensity: DemandIntensity;
  targetCustomers: string[];
  competitiveEdge: string;
  keyFinancialRisks: string[];
  subsidyOptimizationTip: string;
  launchRoadmap: MilestoneStep[];
  marketScore: number;
  generatedAt: string;

  // Rich AI fields (present when LLM service is active)
  summary?: string;
  businessViability?: BusinessViability;
  marketOpportunity?: MarketOpportunity;
  financialExplanation?: FinancialExplanation;
  riskAnalysis?: RiskAnalysis;
  stressTest?: StressTest;
  swot?: SwotAnalysis;
  recommendations?: string[];
  nextSteps?: string[];
  confidence?: {
    overall?: string;
    financial?: string;
    market?: string;
    scheme?: string;
  };
  evidence?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ApiStatus {
  isBackendConnected: boolean;
  activeEndpoint: string;
  lastChecked: string;
}
