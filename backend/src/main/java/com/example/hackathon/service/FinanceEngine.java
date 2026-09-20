package com.example.hackathon.service;

import com.example.hackathon.client.LlmClient;
import com.example.hackathon.dto.AdvisoryResponse;
import com.example.hackathon.dto.PlanRequest;
import com.example.hackathon.dto.PlanResponse;
import com.example.hackathon.entity.PlanEntity;
import com.example.hackathon.repository.PlanRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class FinanceEngine {

    private final PlanRepository repository;
    private final LlmClient llmClient;

    public FinanceEngine(PlanRepository repository, LlmClient llmClient) {
        this.repository = repository;
        this.llmClient = llmClient;
    }

    public PlanResponse calculatePlan(PlanRequest request) {
        int ownCapital = request.getOwnCapital();
        int monthlyIncome = request.getMonthlyIncome();
        String schemeName;
        double annualInterestRate;
        // Tenure comes from the form (1-10 years); default 5 years
        int tenureYears = request.getTenureYears() != null ? Math.max(1, Math.min(10, request.getTenureYears())) : 5;
        int tenureMonths = tenureYears * 12;

        // 1. Determine Scheme and Interest Rate
        if (ownCapital <= 50000) {
            schemeName = "PM Mudra - Kishor";
            annualInterestRate = 9.5;
        } else {
            schemeName = "PMEGP (Rural)";
            annualInterestRate = 11.0;
        }

        double monthlyRate = (annualInterestRate / 12) / 100;

        // 2. Budget Ceiling 1: Margin Limit (Bank funds max 90% of project)
        int maxProjectByMargin = ownCapital * 10;

        // 3. Budget Ceiling 2: Income Limit (FOIR - EMI cannot exceed 50% of income)
        double maxAllowedEmi = monthlyIncome * 0.50;

        // Reverse EMI Formula to find Max Affordable Loan
        double maxAffordableLoan = (maxAllowedEmi / monthlyRate) * (1 - (1 / Math.pow(1 + monthlyRate, tenureMonths)));
        int maxProjectByIncome = (int) Math.round(maxAffordableLoan) + ownCapital;

        // 4. The Verdict: The bank approves the safer (lower) of the two ceilings
        int approvedProjectCost = Math.min(maxProjectByMargin, maxProjectByIncome);

        // Edge case fallback: If income is 0, they can only spend what they have
        if (approvedProjectCost < ownCapital) {
            approvedProjectCost = ownCapital;
        }

        int approvedLoanAmount = approvedProjectCost - ownCapital;

        // 5. Calculate Final Actual EMI for the approved amount
// 5. Calculate Final Actual EMI for the approved amount
        int finalEmi = 0;
        if (approvedLoanAmount > 0) {
            finalEmi = (int) Math.round((approvedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1));
        }

        // 6. Dynamic Credit Risk Assessment
        String riskLevel;
        if (monthlyIncome < 3000 || ownCapital < 1000) {
            riskLevel = "HIGH_RISK"; // Below minimum subsistence threshold
        } else if (finalEmi <= (monthlyIncome * 0.30)) {
            riskLevel = "LOW_RISK";  // Healthy cash cushion
        } else if (finalEmi <= (monthlyIncome * 0.50)) {
            riskLevel = "MODERATE_RISK"; // Maxing out repayment capacity
        } else {
            riskLevel = "HIGH_RISK";
        }

        // 7. Save to PostgreSQL
        PlanEntity savedEntity = repository.save(new PlanEntity(
                request.getLocation(),
                ownCapital,
                request.getBusinessType(),
                monthlyIncome,
                approvedProjectCost,
                approvedLoanAmount,
                finalEmi,
                schemeName,
                riskLevel
        ));

        // 8. Return to Controller
// 8. Return to Controller
        return new PlanResponse(
                savedEntity.getId(),
                approvedProjectCost, // Mapped to totalSafeProjectBudget
                approvedLoanAmount,  // Mapped to maxSafeLoanAmount
                finalEmi,
                schemeName,
                riskLevel,
                annualInterestRate,
                tenureMonths
        );
    }

    public AdvisoryResponse generateAdvisory(UUID id) {
        PlanEntity plan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found in database"));

        return llmClient.fetchAdvisory(plan);
    }
}