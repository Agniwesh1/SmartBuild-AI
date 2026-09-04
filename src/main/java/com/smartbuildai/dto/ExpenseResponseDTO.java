package com.smartbuildai.dto;

import java.time.LocalDateTime;

public class ExpenseResponseDTO {

    private Long id;

    private String expenseName;

    private String expenseType;

    private Double amount;

    private String description;

    private LocalDateTime createdAt;

    private Long houseId;

    public ExpenseResponseDTO() {
    }

    public ExpenseResponseDTO(
            Long id,
            String expenseName,
            String expenseType,
            Double amount,
            String description,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.expenseName = expenseName;
        this.expenseType = expenseType;
        this.amount = amount;
        this.description = description;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

    public String getExpenseType() {
        return expenseType;
    }

    public void setExpenseType(String expenseType) {
        this.expenseType = expenseType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getHouseId() {
        return houseId;
    }

    public void setHouseId(Long houseId) {
        this.houseId = houseId;
    }
}