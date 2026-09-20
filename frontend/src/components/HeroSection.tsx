import React from 'react';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  return (
    <section id="hero-section" className="bg-white border-b border-gray-200">
      
      {/* ── MAIN HERO: 2-Column (Text Left, Realistic Dashboard Preview Right) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 md:pt-16 md:pb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description & CTAs */}
          <div className="lg:col-span-7">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium tracking-wide mb-4">
              <span>DATA-DRIVEN CREDIT ADVISORY</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-gray-900 tracking-tight leading-[1.2] mb-4">
              Credit Sizing & Policy Advisory for Rural Micro-Enterprises
            </h1>

            {/* Short Professional Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-xl">
              An institutional underwriting platform combining deterministic banking formulas (FOIR & DSCR) 
              with statutory scheme matching (PMEGP, Mudra) and localized market intelligence to de-risk rural business loans.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={onCtaClick}
                id="hero-cta-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Launch Eligibility Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculator-section"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium text-sm transition-colors shadow-xs"
              >
                <span>Explore Parameters</span>
              </a>
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Conforming to Reserve Bank of India Priority Sector Lending (PSL) guidelines</span>
            </p>
          </div>

          {/* Right Column: Realistic Product Interface Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              
              {/* Terminal / Dashboard Header Bar */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-mono font-medium text-gray-700">
                    CREDIT EVALUATION DOSSIER
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  REF: PSL-MH-8402
                </span>
              </div>

              {/* Card Body with Key Financial Outputs */}
              <div className="p-5 space-y-4">
                
                {/* Enterprise Name & Target */}
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-[11px] font-mono uppercase text-gray-400 block mb-0.5">
                    Applicant Profile
                  </span>
                  <div className="text-sm font-semibold text-gray-900">
                    Solar Cold Storage Unit • Nashik, Maharashtra
                  </div>
                  <span className="text-xs text-gray-500">
                    Equity Margin: ₹1,50,000 • Monthly Income: ₹45,000
                  </span>
                </div>

                {/* Primary Metric: Eligible Loan Amount */}
                <div className="p-3.5 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium block">
                      Maximum Eligible Loan
                    </span>
                    <div className="text-2xl font-semibold text-gray-900 font-mono tracking-tight">
                      ₹8,50,000
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Approved Ceiling
                    </span>
                    <span className="block text-[11px] text-gray-500 font-mono mt-1">
                      Project: ₹10.0L
                    </span>
                  </div>
                </div>

                {/* 2-Column Financial Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* DSCR */}
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <span className="text-[11px] text-gray-500 block mb-0.5">
                      DSCR Ratio
                    </span>
                    <div className="text-lg font-semibold text-gray-900 font-mono">
                      1.42x
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Within safe range
                    </span>
                  </div>

                  {/* FOIR */}
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <span className="text-[11px] text-gray-500 block mb-0.5">
                      FOIR Ratio
                    </span>
                    <div className="text-lg font-semibold text-gray-900 font-mono">
                      38.0%
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Below 50% limit
                    </span>
                  </div>

                </div>

                {/* Scheme Match & Amortization Row */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Matched Scheme</span>
                    <span className="font-semibold text-gray-900">PMEGP (Rural 35%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block">Monthly Repayment</span>
                    <span className="font-semibold font-mono text-gray-900">₹18,500/mo</span>
                  </div>
                </div>

              </div>

              {/* Status Footer */}
              <div className="px-4 py-2.5 bg-emerald-50/60 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sanction Probability: High</span>
                </span>
                <span className="font-mono text-emerald-800 text-[11px]">
                  Zero Collateral (CGFMU)
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 7: KEY METRICS STRIP (Horizontal with Subtle Vertical Separators) ── */}
      <div className="border-t border-gray-200 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            {/* Metric 1 */}
            <div className="pt-3 md:pt-0 md:px-4 first:pl-0">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-mono block mb-1">
                Banking Cap
              </span>
              <div className="text-sm font-semibold text-gray-900">
                RBI 50% FOIR Limit
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Statutory debt repayment boundary
              </p>
            </div>

            {/* Metric 2 */}
            <div className="pt-3 md:pt-0 md:px-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-mono block mb-1">
                Collateral Waiver
              </span>
              <div className="text-sm font-semibold text-gray-900">
                Up to ₹10 Lakhs (CGFMU)
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Central credit guarantee coverage
              </p>
            </div>

            {/* Metric 3 */}
            <div className="pt-3 md:pt-0 md:px-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-mono block mb-1">
                Subsidy Scope
              </span>
              <div className="text-sm font-semibold text-gray-900">
                15% – 35% PMEGP / Mudra
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Back-ended capital subsidy credit
              </p>
            </div>

            {/* Metric 4 */}
            <div className="pt-3 md:pt-0 md:px-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-mono block mb-1">
                Execution Architecture
              </span>
              <div className="text-sm font-semibold text-gray-900">
                Java + FastAPI + Bedrock
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Deterministic core with RAG advisory
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── SECTION 8: HOW IT WORKS SECTION (Numbered Editorial Workflow) ── */}
      <div id="how-it-works" className="border-t border-gray-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <span className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider block mb-1">
              Methodology
            </span>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              From Data to Decisions: A four-step institutional workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 01 */}
            <div className="p-5 bg-gray-50/50 rounded-lg border border-gray-200">
              <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                01
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                Deterministic Math Engine
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calculates maximum safe borrowing power, project equity contribution, and monthly amortized EMI 
                using conservative banking formulas. Zero hallucinations in financial figures.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-5 bg-gray-50/50 rounded-lg border border-gray-200">
              <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                02
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                Scheme & Subsidy Matching
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Maps applicant profile against active Ministry of MSME guidelines (PMEGP, Mudra, Stand-Up India) 
                to determine exact subsidy tiers and collateral-free guarantee eligibility.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-5 bg-gray-50/50 rounded-lg border border-gray-200">
              <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                03
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                Market Advisory & RAG
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Cross-references regional supply gaps, district-level buyer clusters (FPOs, mandis), 
                and down-side risk scenarios via verified vector retrieval and foundational models.
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-5 bg-gray-50/50 rounded-lg border border-gray-200">
              <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                04
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                Actionable Output
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Generates a bank-ready appraisal dossier, complete with debt service schedules, 
                risk mitigation checklists, and a 90-day commercialization roadmap for lead bank submission.
              </p>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
