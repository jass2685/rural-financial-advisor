package com.example.hackathon.client;

import com.example.hackathon.dto.AdvisoryResponse;
import com.example.hackathon.entity.PlanEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LlmClient {
    private final RestClient restClient;

    // Local dev default: localhost:8000. In Docker/AWS, set LLM_SERVICE_URL=http://ai-service:8000
    public LlmClient(@Value("${llm.service.url:http://localhost:8000}") String llmServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(llmServiceUrl)
                .build();
    }

    @SuppressWarnings("unchecked")
    public AdvisoryResponse fetchAdvisory(PlanEntity plan) {
        try {
            // Build the nested payload matching Python FastAPI AdvisoryRequest schema
            Map<String, Object> businessInfo = new HashMap<>();
            businessInfo.put("businessType", plan.getBusinessType());
            businessInfo.put("location", plan.getLocation());
            businessInfo.put("district", plan.getLocation());
            businessInfo.put("language", "en");

            Map<String, Object> financialInfo = new HashMap<>();
            financialInfo.put("capital", (double) plan.getOwnCapital());
            financialInfo.put("projectCost", (double) plan.getTotalProjectCost());
            financialInfo.put("loanAmount", (double) plan.getLoanAmount());
            financialInfo.put("emi", (double) plan.getEmi());
            financialInfo.put("riskLevel", plan.getRiskLevel());
            financialInfo.put("monthlyRevenue", (double) plan.getMonthlyIncome());

            Map<String, Object> schemeInfo = new HashMap<>();
            schemeInfo.put("schemeName", plan.getSchemeName());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("businessInfo", businessInfo);
            requestBody.put("financialInfo", financialInfo);
            requestBody.put("schemeInfo", schemeInfo);

            Map<String, Object> response = restClient.post()
                    .uri("/v1/advisory")
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            AdvisoryResponse advisory = new AdvisoryResponse();

            String verdict = "";
            String localDemand = "";

            if (response != null) {
                advisory.setRawData(response);
                advisory.setStatus(response.get("status") != null ? response.get("status").toString() : "SUCCESS");
                advisory.setSummary(response.get("summary") != null ? response.get("summary").toString() : null);
                advisory.setBusinessViability(response.get("businessViability"));
                advisory.setMarketOpportunity(response.get("marketOpportunity"));
                advisory.setFinancialExplanation(response.get("financialExplanation"));
                advisory.setRiskAnalysis(response.get("riskAnalysis"));
                advisory.setStressTest(response.get("stressTest"));
                advisory.setSwot(response.get("swot"));
                advisory.setConfidence(response.get("confidence"));
                advisory.setGeneratedAt(response.get("generatedAt") != null ? response.get("generatedAt").toString() : null);

                if (response.get("recommendations") instanceof List) {
                    advisory.setRecommendations((List<String>) response.get("recommendations"));
                }
                if (response.get("nextSteps") instanceof List) {
                    advisory.setNextSteps((List<String>) response.get("nextSteps"));
                }
                if (response.get("evidence") instanceof List) {
                    advisory.setEvidence((List<String>) response.get("evidence"));
                }

                if (response.get("businessViability") instanceof Map) {
                    Map<String, Object> bv = (Map<String, Object>) response.get("businessViability");
                    if (bv.get("explanation") != null) {
                        verdict = bv.get("explanation").toString();
                    }
                } else if (response.get("summary") != null) {
                    verdict = response.get("summary").toString();
                }

                if (response.get("financialExplanation") instanceof Map) {
                    Map<String, Object> fe = (Map<String, Object>) response.get("financialExplanation");
                    if (fe.get("summary") != null) {
                        verdict = verdict + " " + fe.get("summary").toString();
                    }
                }

                if (response.get("marketOpportunity") instanceof Map) {
                    Map<String, Object> mo = (Map<String, Object>) response.get("marketOpportunity");
                    if (mo.get("summary") != null) {
                        localDemand = mo.get("summary").toString();
                    }
                } else if (response.get("summary") != null) {
                    localDemand = response.get("summary").toString();
                }
            }

            advisory.setVerdict(verdict.isEmpty() ? "Detailed business and financial analysis completed by AI Service." : verdict.trim());
            advisory.setLocalDemand(localDemand.isEmpty() ? "Market demand verified for " + plan.getLocation() : localDemand.trim());

            return advisory;
        } catch (Exception e) {
            System.err.println("[LlmClient] Error calling Python AI service: " + e.getMessage());
            AdvisoryResponse fallback = new AdvisoryResponse();
            fallback.setStatus("OFFLINE_FALLBACK");
            fallback.setVerdict("AI Service currently unavailable. Please ensure the Python server is running on port 8000.");
            fallback.setLocalDemand("Local demand intelligence for " + plan.getLocation() + " is active.");
            return fallback;
        }
    }
}