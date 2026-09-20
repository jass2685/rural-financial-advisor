import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Landmark, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { PlanEvaluationResult, CreditRisk } from '../types';
import { formatINR } from '../services/api';

interface ResultsSectionProps {
  result: PlanEvaluationResult;
  onGenerateAi: () => void;
  isAiLoading: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  result, 
  onGenerateAi, 
  isAiLoading 
}) => {
  const getRiskConfig = (risk: CreditRisk) => {
    switch (risk) {
      case 'LOW_RISK':
        return {
          label: 'Low Credit Risk • High Sanction Probability',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          dot: 'bg-emerald-600',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
        };
      case 'MODERATE_RISK':
        return {
          label: 'Moderate Credit Risk • Conditional Approval',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          dot: 'bg-amber-600',
          icon: <AlertTriangle className="w-4 h-4 text-amber-700" />,
        };
      case 'HIGH_RISK':
        return {
          label: 'High Credit Risk • Capital Restructuring Advised',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          dot: 'bg-rose-600',
          icon: <AlertOctagon className="w-4 h-4 text-rose-700" />,
        };
    }
  };

  const riskBadge = getRiskConfig(result.creditRisk);

  return (
    <section id="results-section" className="bg-white py-14 md:py-18 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider">
                Appraisal Report
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-mono text-gray-500">Ref: {result.id.slice(0, 8).toUpperCase()}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{new Date(result.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Banking Assessment & Sanction Limits
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
              Evaluated for <strong className="font-semibold text-gray-900">{result.userInput.dreamBusiness}</strong> in {result.userInput.location}
            </p>
          </div>

          {/* Institutional Credit Risk Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${riskBadge.bg} ${riskBadge.border} border text-xs font-medium ${riskBadge.text}`}>
            <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`} />
            <span>{riskBadge.label}</span>
          </div>
        </div>

        {/* 4 Financial KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Tile 1: Maximum Safe Loan Limit */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Max Safe Loan Amount
            </span>
            <div className="text-2xl font-semibold text-gray-900 font-mono tracking-tight">
              {formatINR(result.maxSafeLoanAmount)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Borrowing ceiling under 50% FOIR cap
            </p>
          </div>

          {/* Tile 2: Total Project Budget */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Total Project Budget
            </span>
            <div className="text-2xl font-semibold text-emerald-800 font-mono tracking-tight">
              {formatINR(result.totalSafeProjectBudget)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Loan + {formatINR(result.userInput.ownCapital)} equity contribution
            </p>
          </div>

          {/* Tile 3: Estimated Monthly EMI */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Estimated Monthly EMI
            </span>
            <div className="text-2xl font-semibold text-gray-900 font-mono tracking-tight">
              {formatINR(result.estimatedEmi)}
              <span className="text-xs font-normal font-sans text-gray-500">/mo</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {result.calculatedInterestRate || 9.5}% p.a. • {result.tenureMonths / 12} Years
            </p>
          </div>

          {/* Tile 4: FOIR Ratio */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              FOIR Ratio
            </span>
            <div className="text-2xl font-semibold text-gray-900 font-mono tracking-tight">
              {result.foirPercent}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {result.foirPercent >= 50 ? 'At the 50% FOIR ceiling' : 'Below 50% maximum limit (Safe Range)'}
            </p>
          </div>

        </div>

        {/* Technical Documentation Layout: Scheme Evaluation + Debt Service Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Section 1: Statutory Scheme Matching */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span className="text-xs font-mono uppercase text-gray-500 font-semibold flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-gray-500" />
                <span>Statutory Scheme Matching</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                {result.schemeDetails.badge || 'Zero Collateral'}
              </span>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-1.5">
              {result.matchedGovScheme}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {result.schemeDetails.description}
            </p>

            {/* Scheme Parameters Table */}
            <div className="border border-gray-200 rounded divide-y divide-gray-100 text-xs mb-4">
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Capital Subsidy Entitlement</span>
                <span className="font-mono font-medium text-emerald-700">
                  {formatINR(result.schemeDetails.subsidyAmount)} ({result.schemeDetails.subsidyPercent}%)
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Credit Guarantee Coverage</span>
                <span className="text-gray-900 font-medium">100% Collateral-Free (CGFMU)</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Interest Subvention</span>
                <span className="text-gray-900 font-medium">{result.schemeDetails.interestSubvention}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={result.schemeDetails.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <span>National Portal Filing Guidelines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] font-mono text-gray-400">DIC Priority Track</span>
            </div>
          </div>

          {/* Section 2: Debt Serviceability & Liquidity Ratios */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="pb-3 border-b border-gray-200 mb-3">
              <span className="text-xs font-mono uppercase text-gray-500 font-semibold">
                Debt Serviceability & Repayment Capacity
              </span>
            </div>

            {/* Underwriting Reasoning Note */}
            <div className="p-3 rounded bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed mb-4">
              {result.riskReason}
            </div>

            {/* Structured Financial Table */}
            <div className="border border-gray-200 rounded divide-y divide-gray-100 text-xs mb-4">
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Debt Service Coverage Ratio (DSCR)</span>
                <span className="font-mono font-medium text-gray-900">
                  {result.dscr.toFixed(2)}x (Benchmark: ≥ 1.20x)
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Net Disposable Surplus after Debt</span>
                <span className="font-mono font-medium text-gray-900">
                  {formatINR(result.userInput.monthlyIncome - result.estimatedEmi)}/mo
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-gray-500">Promoter Equity Stake</span>
                <span className="font-mono font-medium text-gray-900">
                  {Math.round((result.userInput.ownCapital / result.totalSafeProjectBudget) * 100)}% of Project Cost
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Underwriting Directive: </span>
              <span>{result.recommendation}</span>
            </div>
          </div>

        </div>

        {/* Action Panel to AI Strategic Advisory */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase font-bold text-emerald-800">
                Next Stage: Market Intelligence
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-semibold text-gray-900">
                Generate Full Executive Advisory Dossier
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-xl">
              Synthesizes district-level buyer offtake clusters (FPOs, mandis), operational SWOT analysis, 
              30% down-side revenue stress testing, and a 90-day bank submission roadmap.
            </p>
          </div>

          <button
            onClick={onGenerateAi}
            disabled={isAiLoading}
            id="generate-ai-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
          >
            {isAiLoading ? (
              <span>Evaluating Advisory Models...</span>
            ) : (
              <>
                <span>Generate Advisory Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};
