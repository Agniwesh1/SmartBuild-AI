package com.smartbuildai.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ContractorResponseDTO {

    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private String specialization;
    private BigDecimal contractAmount;
    private String status;
    private LocalDateTime createdAt;
    private Long projectId;

    public ContractorResponseDTO(
            Long id,
            String name,
            String company,
            String phone,
            String email,
            String specialization,
            BigDecimal contractAmount,
            String status,
            LocalDateTime createdAt,
            Long projectId) {

        this.id = id;
        this.name = name;
        this.company = company;
        this.phone = phone;
        this.email = email;
        this.specialization = specialization;
        this.contractAmount = contractAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.projectId = projectId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCompany() {
        return company;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getSpecialization() {
        return specialization;
    }

    public BigDecimal getContractAmount() {
        return contractAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getProjectId() {
        return projectId;
    }
}