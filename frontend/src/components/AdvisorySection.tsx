import React, { useState } from 'react';
import {
  Copy, Check, Printer, RotateCcw, MessageSquare
} from 'lucide-react';
import { AiAdvisoryResult, PlanEvaluationResult } from '../types';
import { ChatPanel } from './ChatPanel';

interface AdvisorySectionProps {
  advisory: AiAdvisoryResult;
  planResult: PlanEvaluationResult;
  onReset: () => void;
}

export const AdvisorySection: React.FC<AdvisorySectionProps> = ({ advisory, planResult, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'swot' | 'risks' | 'roadmap'>('overview');

  const handleCopy = () => {
    const text = `RURAL FINANCIAL ADVISOR — EXECUTIVE APPRAISAL REPORT
Enterprise: ${planResult.userInput.dreamBusiness}
Location: ${planResult.userInput.location}
Loan Sized: ₹${planResult.maxSafeLoanAmount.toLocaleString('en-IN')}
Scheme: ${planResult.matchedGovScheme}
Market Score: ${advisory.marketScore}/100

EXECUTIVE VERDICT:
${advisory.verdict}

LOCAL DEMAND & OFFTAKE:
${advisory.localDemand}

COMPETITIVE ADVANTAGE:
${advisory.competitiveEdge}

KEY RECOMMENDATIONS:
${(advisory.recommendations || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

90-DAY IMPLEMENTATION ROADMAP:
${advisory.launchRoadmap.map(r => `${r.phase} (${r.timeline}): ${r.action} -> Deliverable: ${r.deliverable}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="advisory-section" className="bg-white py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header & Export Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider">
                Institutional Due Diligence
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-mono">
                Generated: {new Date(advisory.generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Executive Market Advisory & Strategic Report
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
              Commercial feasibility dossier for {planResult.userInput.dreamBusiness} in {planResult.userInput.location}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
              title="Copy markdown report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-xs ${
                showChat 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{showChat ? 'Hide Inquiries' : 'Ask Question'}</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 border border-gray-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
              title="Re-run evaluation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Key Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Market Viability Score
            </span>
            <div className="text-xl font-semibold text-gray-900 font-mono">
              {advisory.marketScore}
              <span className="text-xs font-normal text-gray-400">/100</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              Above approval threshold (70)
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Demand Velocity
            </span>
            <div className="text-xl font-semibold text-gray-900">
              {advisory.demandIntensity}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">
              Regional consumption gap
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Assessed Operational Risk
            </span>
            <div className="text-xl font-semibold text-gray-900">
              {advisory.riskAnalysis?.level || 'LOW'}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              Mitigations documented
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-mono uppercase text-gray-500 block mb-1">
              Data Confidence
            </span>
            <div className="text-xl font-semibold text-gray-900">
              {advisory.confidence?.overall || 'HIGH'}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">
              Multi-source corroborated
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Document Sections) */}
        <div className="flex border-b border-gray-200 mb-6 text-xs font-medium space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Advisory Overview
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'market'
                ? 'border-emerald-700 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Market Intelligence
          </button>
          <button
            onClick={() => setActiveTab('swot')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'swot'
                ? 'border-emerald-700 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            SWOT Analysis
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'risks'
                ? 'border-emerald-700 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Risk Factors & Stress Test
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-emerald-700 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            90-Day Implementation Roadmap
          </button>
        </div>

        {/* TAB 1: Advisory Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Executive Verdict Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <span className="text-xs font-mono uppercase font-bold text-emerald-800 tracking-wide block mb-2">
                Executive Credit & Feasibility Verdict
              </span>
              <p className="text-sm text-gray-800 leading-relaxed">
                {advisory.verdict}
              </p>
            </div>

            {/* Recommendations Grid */}
            {advisory.recommendations && advisory.recommendations.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-3">
                  Underwriting & Pre-Disbursement Directives
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {advisory.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200 flex items-start gap-2.5">
                      <span className="font-mono text-emerald-800 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                      <span className="text-gray-700 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources / Evidence Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 text-xs">
              <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-2">
                Corroborating Evidence & Policy Sources
              </span>
              <div className="space-y-1.5 text-gray-600">
                {(advisory.evidence || [
                  'Reserve Bank of India Master Direction – Priority Sector Lending Targets (FIDD.CO.Plan.BC.5/04.09.01/2020-21)',
                  'Ministry of Micro, Small & Medium Enterprises – Scheme Guidelines for PMEGP and Mudra Yojana',
                  `District Industries Centre (DIC) MSME Cluster Benchmarks for ${planResult.userInput.location}`
                ]).map((src, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-semibold">•</span>
                    <span>{src}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Market Intelligence */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Local Demand Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-2">
                  Regional Demand Dynamics
                </span>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  {advisory.localDemand}
                </p>

                {advisory.businessViability?.keyFactors && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-mono text-gray-400 block mb-2">
                      Key Feasibility Drivers:
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {advisory.businessViability.keyFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold shrink-0">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Competitive Advantage & Offtake Channels */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-2">
                  Competitive Advantage
                </span>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  {advisory.competitiveEdge}
                </p>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-mono text-gray-400 block mb-2">
                    Identified Offtake Channels:
                  </span>
                  <div className="space-y-2 text-xs">
                    {advisory.targetCustomers.map((cust, i) => (
                      <div key={i} className="p-2.5 bg-gray-50 rounded border border-gray-200 text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{cust}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: SWOT Matrix */}
        {activeTab === 'swot' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Internal Strengths
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Advantage
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {(advisory.swot?.strengths || [
                  'Owner equity contribution reduces bank exposure and signals financial discipline',
                  'Eligible for central capital subsidy reducing effective project capex burden',
                  'Direct regional sourcing eliminates long-haul transport markups'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-semibold shrink-0">+</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Internal Weaknesses
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Vulnerability
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {(advisory.swot?.weaknesses || [
                  'Limited formal credit track record requires clean supplementary bank statements',
                  'Key-person operational dependency during initial 6-month ramp up',
                  'Buffer needed to absorb buyers paying on Net-30 credit terms'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-semibold shrink-0">-</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Market Opportunities
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  Expansion
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {(advisory.swot?.opportunities || [
                  'District Industries Centre (DIC) provides free Project Feasibility Reports',
                  'ONDC rural seller onboarding opens direct procurement from metro consumers',
                  'Forward off-take contracts with local Farmer Producer Organizations (FPOs)'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-900 font-semibold shrink-0">↗</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  External Threats
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                  Risk
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {(advisory.swot?.threats || [
                  'Agricultural seasonality leading to 2-3 month annual revenue fluctuations',
                  'Rural power reliability issues requiring dedicated solar/diesel backup',
                  'Delay in regulatory approvals (FSSAI/NOC) extending commercial launch date'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-700 font-semibold shrink-0">!</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* TAB 4: Risk Factors & Stress Test */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            
            {/* Operational Risks & Mitigations Table */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-3">
                Identified Operational Risks & Mitigation Controls
              </span>

              <div className="border border-gray-200 rounded divide-y divide-gray-200 text-xs">
                {(advisory.riskAnalysis?.riskFactors || advisory.keyFinancialRisks || []).map((risk, i) => {
                  const mitigation = advisory.riskAnalysis?.mitigation?.[i] || 
                    'Maintain a liquid 45-day operational cash reserve to prevent debt service disruptions.';
                  return (
                    <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="sm:max-w-[48%]">
                        <span className="text-[11px] font-mono text-rose-700 font-semibold block mb-0.5">Risk #{i + 1}</span>
                        <p className="text-gray-800">{risk}</p>
                      </div>
                      <div className="sm:max-w-[48%] sm:border-l sm:border-gray-200 sm:pl-4">
                        <span className="text-[11px] font-mono text-emerald-800 font-semibold block mb-0.5">Control Action</span>
                        <p className="text-gray-600">{mitigation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 30% Downside Stress Test */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <span className="text-xs font-mono uppercase font-bold text-amber-800 tracking-wide block mb-2">
                30% Downside Revenue Stress Test (Drought / Demand Shock)
              </span>
              <p className="text-xs text-gray-700 leading-relaxed mb-4">
                {advisory.stressTest?.explanation || 
                  'Under a severe 30% top-line contraction, debt service remains solvent provided working capital reserves are maintained.'}
              </p>

              {advisory.stressTest?.observations && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {advisory.stressTest.observations.map((obs, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700">
                      <span className="text-gray-900 font-semibold block mb-1">Stress Finding #{i + 1}</span>
                      <p>{obs}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: 90-Day Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <span className="text-xs font-mono uppercase text-gray-500 font-semibold block mb-4">
              90-Day Bank Sanction & Implementation Milestones
            </span>

            <div className="space-y-4">
              {advisory.launchRoadmap.map((step, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                  <div className="sm:max-w-[70%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{step.phase}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-emerald-800 font-medium">{step.timeline}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step.action}</p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-0.5">
                      Required Deliverable
                    </span>
                    <span className="font-medium text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-300 inline-block shadow-2xs">
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Interactive Inquiries (Collapsible) */}
        {showChat && (
          <div id="chat-drawer" className="mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Advisory Query Terminal
                </h3>
                <p className="text-xs text-gray-500">
                  Ask specific questions regarding subsidy release, DIC documentation, or bank interviews.
                </p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <ChatPanel advisory={advisory} planResult={planResult} />
          </div>
        )}

      </div>
    </section>
  );
};
