package com.smartbuildai.dto;

import java.util.Map;

public class BudgetAnalysisResponseDTO {

    private Long houseId;
    private Double totalBudget;
    private Double totalSpent;
    private Double remainingBudget;
    private Double budgetUsedPercentage;
    private Map<String, Double> expenseByType;
    private String budgetStatus;

    public BudgetAnalysisResponseDTO() {
    }

    public BudgetAnalysisResponseDTO(
            Long houseId,
            Double totalBudget,
            Double totalSpent,
            Double remainingBudget,
            Double budgetUsedPercentage,
            Map<String, Double> expenseByType,
            String budgetStatus) {

        this.houseId = houseId;
        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.remainingBudget = remainingBudget;
        this.budgetUsedPercentage = budgetUsedPercentage;
        this.expenseByType = expenseByType;
        this.budgetStatus = budgetStatus;
    }

    public Long getHouseId() {
        return houseId;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public Double getRemainingBudget() {
        return remainingBudget;
    }

    public Double getBudgetUsedPercentage() {
        return budgetUsedPercentage;
    }

    public Map<String, Double> getExpenseByType() {
        return expenseByType;
    }

    public String getBudgetStatus() {
        return budgetStatus;
    }
}