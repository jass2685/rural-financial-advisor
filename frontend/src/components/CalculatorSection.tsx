import React, { useState } from 'react';
import { Loader2, Info, ChevronRight } from 'lucide-react';
import { LoanFormInput } from '../types';
import { formatINR } from '../services/api';
import { estimateLoanPlan } from '../services/estimate';

interface CalculatorSectionProps {
  onSubmit: (formData: LoanFormInput) => void;
  isLoading: boolean;
}

const LOCATION_SUGGESTIONS = [
  'Nashik, Maharashtra',
  'Belagavi, Karnataka',
  'Varanasi, Uttar Pradesh',
  'Satara, Maharashtra',
  'Cuttack, Odisha',
  'Guntur, Andhra Pradesh'
];

const BUSINESS_SUGGESTIONS = [
  'Dairy & Milk Chilling Unit',
  'Solar-Powered Cold Storage',
  'Organic Spice & Flour Mill',
  'Poultry & Layer Hatchery',
  'Agro-Logistics & Transport',
  'Bio-Fertilizer & Compost Plant'
];

const CAPITAL_PRESETS = [50000, 100000, 250000, 500000];
const INCOME_PRESETS = [25000, 45000, 75000, 120000];

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LoanFormInput>({
    location: 'Nashik, Maharashtra',
    dreamBusiness: 'Solar-Powered Cold Storage',
    ownCapital: 150000,
    monthlyIncome: 45000,
    tenureYears: 5,
    socialCategory: 'General'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }
    if (!formData.dreamBusiness.trim()) {
      errs.dreamBusiness = 'Business type is required';
    }
    if (formData.ownCapital === undefined || formData.ownCapital < 0) {
      errs.ownCapital = 'Enter available equity capital';
    }
    if (!formData.monthlyIncome || formData.monthlyIncome < 5000) {
      errs.monthlyIncome = 'Monthly income must be at least ₹5,000';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Live preview: same rules as the Spring Boot engine, so it matches the final result
  const estimate = estimateLoanPlan(formData.ownCapital, formData.monthlyIncome, formData.tenureYears || 5);

  return (
    <section id="calculator-section" className="bg-gray-50/50 py-14 md:py-18 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider block mb-1">
            Credit Assessment Tool
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Institutional Credit Sizing Calculator
          </h2>
          <p className="mt-1 text-sm text-gray-600 max-w-2xl">
            Input enterprise details and verified household cashflow to compute conservative borrowing ceilings 
            under Reserve Bank of India Priority Sector Lending standards.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left, Live Parameter Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Underwriting Form (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section A: Business Information */}
              <div>
                <h3 className="text-xs font-mono uppercase text-gray-500 font-semibold tracking-wider pb-2 border-b border-gray-100 mb-4">
                  1. Business Information
                </h3>

                <div className="space-y-4">
                  {/* Field 1: Location */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Enterprise Location (District / Town)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        if (errors.location) setErrors({ ...errors, location: '' });
                      }}
                      placeholder="e.g. Nashik, Maharashtra"
                      className={`w-full px-3 py-2 text-sm rounded-md bg-white border ${
                        errors.location ? 'border-red-400' : 'border-gray-300 focus:border-emerald-600'
                      } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors`}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-600 mt-1">{errors.location}</p>
                    )}

                    {/* Quick location chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {LOCATION_SUGGESTIONS.slice(0, 4).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormData({ ...formData, location: loc })}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-colors cursor-pointer"
                        >
                          {loc.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 2: Target Business Idea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Target MSME Activity
                    </label>
                    <input
                      type="text"
                      value={formData.dreamBusiness}
                      onChange={(e) => {
                        setFormData({ ...formData, dreamBusiness: e.target.value });
                        if (errors.dreamBusiness) setErrors({ ...errors, dreamBusiness: '' });
                      }}
                      placeholder="e.g. Solar-Powered Cold Storage"
                      className={`w-full px-3 py-2 text-sm rounded-md bg-white border ${
                        errors.dreamBusiness ? 'border-red-400' : 'border-gray-300 focus:border-emerald-600'
                      } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors`}
                    />
                    {errors.dreamBusiness && (
                      <p className="text-xs text-red-600 mt-1">{errors.dreamBusiness}</p>
                    )}

                    {/* Quick business chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {BUSINESS_SUGGESTIONS.slice(0, 3).map((biz) => (
                        <button
                          key={biz}
                          type="button"
                          onClick={() => setFormData({ ...formData, dreamBusiness: biz })}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-colors cursor-pointer truncate max-w-[200px]"
                        >
                          {biz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: Financial Information */}
              <div className="pt-2">
                <h3 className="text-xs font-mono uppercase text-gray-500 font-semibold tracking-wider pb-2 border-b border-gray-100 mb-4">
                  2. Financial Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Field 3: Available Equity Capital */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-700">
                        Available Equity Capital
                      </label>
                      <span className="text-xs font-mono font-medium text-emerald-700">
                        {formatINR(formData.ownCapital)}
                      </span>
                    </div>

                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={formData.ownCapital || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, ownCapital: Number(e.target.value) });
                        if (errors.ownCapital) setErrors({ ...errors, ownCapital: '' });
                      }}
                      className={`w-full px-3 py-2 text-sm rounded-md bg-white border ${
                        errors.ownCapital ? 'border-red-400' : 'border-gray-300 focus:border-emerald-600'
                      } text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors`}
                    />
                    {errors.ownCapital && (
                      <p className="text-xs text-red-600 mt-1">{errors.ownCapital}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {CAPITAL_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, ownCapital: preset })}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors border cursor-pointer ${
                            formData.ownCapital === preset
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {formatINR(preset)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 4: Monthly Household Income */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-700">
                        Monthly Net Cashflow
                      </label>
                      <span className="text-xs font-mono font-medium text-emerald-700">
                        {formatINR(formData.monthlyIncome)}/mo
                      </span>
                    </div>

                    <input
                      type="number"
                      min="5000"
                      step="2000"
                      value={formData.monthlyIncome || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, monthlyIncome: Number(e.target.value) });
                        if (errors.monthlyIncome) setErrors({ ...errors, monthlyIncome: '' });
                      }}
                      className={`w-full px-3 py-2 text-sm rounded-md bg-white border ${
                        errors.monthlyIncome ? 'border-red-400' : 'border-gray-300 focus:border-emerald-600'
                      } text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors`}
                    />
                    {errors.monthlyIncome && (
                      <p className="text-xs text-red-600 mt-1">{errors.monthlyIncome}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {INCOME_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, monthlyIncome: preset })}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors border cursor-pointer ${
                            formData.monthlyIncome === preset
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {formatINR(preset)}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section C: Loan Requirements */}
              <div className="pt-2">
                <h3 className="text-xs font-mono uppercase text-gray-500 font-semibold tracking-wider pb-2 border-b border-gray-100 mb-4">
                  3. Loan Requirements & Category
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Field 5: Tenure Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-700">
                        Target Amortization Tenure
                      </label>
                      <span className="text-xs font-mono text-gray-800 font-medium">
                        {formData.tenureYears || 5} Years ({(formData.tenureYears || 5) * 12} Mos)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.tenureYears || 5}
                      onChange={(e) => setFormData({ ...formData, tenureYears: Number(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                    />

                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>1 Year</span>
                      <span>5 Years (Standard)</span>
                      <span>10 Years</span>
                    </div>
                  </div>

                  {/* Field 6: Social Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Beneficiary Category (Subsidy Tier)
                    </label>

                    <select
                      value={formData.socialCategory || 'General'}
                      onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    >
                      <option value="General">General Category (25% Rural Subsidy)</option>
                      <option value="Special">Special / SC / ST / OBC (35% Rural Subsidy)</option>
                      <option value="Women">Women Entrepreneur (Special 35% Subsidy + Margin Relief)</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Form Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  id="evaluate-plan-btn"
                  className="w-full py-2.5 px-4 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Computing Institutional Limits...</span>
                    </>
                  ) : (
                    <>
                      <span>Calculate Eligibility</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: Live Underwriting Preview Card (5 columns) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-6 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-500 block">
                  Live Sizing Preview
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  Pre-Submission Estimation
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Eligible</span>
              </span>
            </div>

            {/* Estimated Loan Amount */}
            <div className="p-3.5 bg-gray-50 rounded border border-gray-200 mb-4">
              <span className="text-xs text-gray-500 font-medium block">
                Maximum Eligible Loan (Approx.)
              </span>
              <div className="text-2xl font-semibold text-gray-900 font-mono tracking-tight mt-0.5">
                {formatINR(estimate.maxSafeLoanAmount)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mt-1 pt-1 border-t border-gray-200">
                <span>Total Project: {formatINR(estimate.totalProjectBudget)}</span>
                <span>Margin: {formatINR(formData.ownCapital)}</span>
              </div>
            </div>

            {/* Key Ratios Table */}
            <div className="space-y-2 text-xs border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Estimated Monthly EMI</span>
                <span className="font-mono font-medium text-gray-900">{formatINR(estimate.emi)}/mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Interest Rate • Tenure</span>
                <span className="font-mono font-medium text-gray-900">{estimate.annualInterestRate}% p.a. • {estimate.tenureMonths / 12} Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Fixed Obligation (FOIR)</span>
                <span className="font-mono font-medium text-emerald-700">{estimate.foirPercent}% (≤ 50% RBI Cap)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Projected DSCR</span>
                <span className="font-mono font-medium text-gray-900">{estimate.dscr.toFixed(2)}x ({estimate.dscr >= 1.2 ? 'Healthy' : 'Below 1.20x benchmark'})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Recommended Scheme</span>
                <span className="font-medium text-gray-900">{estimate.schemeName}</span>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="p-3 bg-gray-50 rounded text-xs text-gray-600 flex items-start gap-2 border border-gray-200">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Click <strong>Calculate Eligibility</strong> to trigger the Spring Boot backend engine, 
                verify exact interest subventions, and generate the formal appraisal blueprint.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
