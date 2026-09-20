package com.example.hackathon.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "plans")
public class PlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String location;
    private int ownCapital;
    private String businessType;
    private int monthlyIncome;
    private int totalProjectCost;
    private int loanAmount;
    private int emi;
    private String schemeName;
    private String riskLevel;

    public PlanEntity() {}

    public PlanEntity(String location, int ownCapital, String businessType, int monthlyIncome, int totalProjectCost, int loanAmount, int emi, String schemeName, String riskLevel) {
        this.location = location;
        this.ownCapital = ownCapital;
        this.businessType = businessType;
        this.monthlyIncome = monthlyIncome;
        this.totalProjectCost = totalProjectCost;
        this.loanAmount = loanAmount;
        this.emi = emi;
        this.schemeName = schemeName;
        this.riskLevel = riskLevel;
    }

    public UUID getId() { return id; }
    public String getLocation() { return location; }
    public int getOwnCapital() { return ownCapital; }
    public String getBusinessType() { return businessType; }
    public int getMonthlyIncome() { return monthlyIncome; }
    public int getTotalProjectCost() { return totalProjectCost; }
    public int getLoanAmount() { return loanAmount; }
    public int getEmi() { return emi; }
    public String getSchemeName() { return schemeName; }
    public String getRiskLevel() { return riskLevel; }
}