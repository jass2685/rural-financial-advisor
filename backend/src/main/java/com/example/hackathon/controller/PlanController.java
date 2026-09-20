package com.example.hackathon.controller;

import com.example.hackathon.dto.AdvisoryResponse;
import com.example.hackathon.dto.PlanRequest;
import com.example.hackathon.dto.PlanResponse;
import com.example.hackathon.service.FinanceEngine;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "*") // Adds the header to allow frontend connections
public class PlanController {

    private final FinanceEngine financeEngine;

    public PlanController(FinanceEngine financeEngine) {
        this.financeEngine = financeEngine;
    }

    @GetMapping("/health")
    public java.util.Map<String, String> healthCheck() {
        return java.util.Map.of("status", "ok", "service", "banking-engine");
    }

    @PostMapping
    public PlanResponse createPlan(@RequestBody PlanRequest request) {
        return financeEngine.calculatePlan(request);
    }

    @PostMapping("/{id}/advisory")
    public AdvisoryResponse getAdvisory(@PathVariable java.util.UUID id) {
        return financeEngine.generateAdvisory(id);
    }
}