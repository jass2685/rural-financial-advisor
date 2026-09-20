package com.example.hackathon.dto;

import java.util.List;
import java.util.Map;

public class AdvisoryResponse {
    private String status;
    private String verdict;
    private String summary;
    private String localDemand;
    private String demandIntensity;
    private List<String> targetCustomers;
    private Object businessViability;
    private Object marketOpportunity;
    private Object financialExplanation;
    private Object riskAnalysis;
    private Object stressTest;
    private Object swot;
    private List<String> recommendations;
    private List<String> nextSteps;
    private Object confidence;
    private List<String> evidence;
    private String generatedAt;
    private Map<String, Object> rawData;

    public AdvisoryResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getLocalDemand() { return localDemand; }
    public void setLocalDemand(String localDemand) { this.localDemand = localDemand; }

    public String getDemandIntensity() { return demandIntensity; }
    public void setDemandIntensity(String demandIntensity) { this.demandIntensity = demandIntensity; }

    public List<String> getTargetCustomers() { return targetCustomers; }
    public void setTargetCustomers(List<String> targetCustomers) { this.targetCustomers = targetCustomers; }

    public Object getBusinessViability() { return businessViability; }
    public void setBusinessViability(Object businessViability) { this.businessViability = businessViability; }

    public Object getMarketOpportunity() { return marketOpportunity; }
    public void setMarketOpportunity(Object marketOpportunity) { this.marketOpportunity = marketOpportunity; }

    public Object getFinancialExplanation() { return financialExplanation; }
    public void setFinancialExplanation(Object financialExplanation) { this.financialExplanation = financialExplanation; }

    public Object getRiskAnalysis() { return riskAnalysis; }
    public void setRiskAnalysis(Object riskAnalysis) { this.riskAnalysis = riskAnalysis; }

    public Object getStressTest() { return stressTest; }
    public void setStressTest(Object stressTest) { this.stressTest = stressTest; }

    public Object getSwot() { return swot; }
    public void setSwot(Object swot) { this.swot = swot; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public List<String> getNextSteps() { return nextSteps; }
    public void setNextSteps(List<String> nextSteps) { this.nextSteps = nextSteps; }

    public Object getConfidence() { return confidence; }
    public void setConfidence(Object confidence) { this.confidence = confidence; }

    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }

    public Map<String, Object> getRawData() { return rawData; }
    public void setRawData(Map<String, Object> rawData) { this.rawData = rawData; }
}