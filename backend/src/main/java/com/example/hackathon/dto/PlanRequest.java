package com.example.hackathon.dto;

public class PlanRequest {
    private String location;
    private int ownCapital;
    private String businessType;
    private int monthlyIncome; // 1. Added this
    private Integer tenureYears; // optional (1-10), defaults to 5

    public PlanRequest() {}

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getOwnCapital() { return ownCapital; }
    public void setOwnCapital(int ownCapital) { this.ownCapital = ownCapital; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public int getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(int monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public Integer getTenureYears() { return tenureYears; }
    public void setTenureYears(Integer tenureYears) { this.tenureYears = tenureYears; }
}