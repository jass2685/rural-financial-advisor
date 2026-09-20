/**
 * Client-side mirror of the Spring Boot FinanceEngine
 * (backend/src/main/java/com/example/hackathon/service/FinanceEngine.java).
 *
 * It lets the live preview in the form show the same numbers the backend returns after
 * "Calculate Eligibility". If you change the rules in FinanceEngine, change them here too.
 */
export interface LoanEstimate {
  schemeName: string;
  annualInterestRate: number; // percent, e.g. 11
  tenureMonths: number;
  maxSafeLoanAmount: number;
  totalProjectBudget: number;
  emi: number;
  foirPercent: number;
  dscr: number;
}

export function estimateLoanPlan(ownCapital: number, monthlyIncome: number, tenureYears: number): LoanEstimate {
  const capital = Math.max(0, Math.round(ownCapital || 0));
  const income = Math.max(0, Math.round(monthlyIncome || 0));
  const years = Math.max(1, Math.min(10, Math.round(tenureYears || 5)));
  const tenureMonths = years * 12;

  // 1. Scheme and interest rate (same rule as the backend)
  const isMudra = capital <= 50000;
  const schemeName = isMudra ? 'PM Mudra - Kishor' : 'PMEGP (Rural)';
  const annualInterestRate = isMudra ? 9.5 : 11.0;
  const monthlyRate = annualInterestRate / 12 / 100;
  const growth = Math.pow(1 + monthlyRate, tenureMonths);

  // 2. Ceiling 1: margin limit (bank funds at most 9x the owner's capital)
  const maxProjectByMargin = capital * 10;

  // 3. Ceiling 2: income limit (EMI may not exceed 50% of monthly income)
  const maxAllowedEmi = income * 0.5;
  const maxAffordableLoan = (maxAllowedEmi / monthlyRate) * (1 - 1 / growth);
  const maxProjectByIncome = Math.round(maxAffordableLoan) + capital;

  // 4. The safer (lower) ceiling wins
  let approvedProject = Math.min(maxProjectByMargin, maxProjectByIncome);
  if (approvedProject < capital) approvedProject = capital;
  const loan = approvedProject - capital;

  // 5. Actual EMI for the approved loan
  const emi = loan > 0 ? Math.round((loan * monthlyRate * growth) / (growth - 1)) : 0;

  return {
    schemeName,
    annualInterestRate,
    tenureMonths,
    maxSafeLoanAmount: loan,
    totalProjectBudget: approvedProject,
    emi,
    foirPercent: income > 0 ? Math.round((emi / income) * 100) : 0,
    dscr: parseFloat(((income * 0.75) / (emi || 1)).toFixed(2)),
  };
}
