package com.smartbuildai.dto;

import java.time.LocalDateTime;

public class BudgetResponseDTO {

    private Long id;
    private Double totalBudget;
    private LocalDateTime createdAt;
    private Long houseId;

    public BudgetResponseDTO() {
    }

    public BudgetResponseDTO(
            Long id,
            Double totalBudget,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.totalBudget = totalBudget;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getHouseId() {
        return houseId;
    }
}