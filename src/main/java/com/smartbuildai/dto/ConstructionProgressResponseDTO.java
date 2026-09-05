package com.smartbuildai.dto;

import java.time.LocalDateTime;

public class ConstructionProgressResponseDTO {

    private Long id;
    private String stageName;
    private Double progressPercentage;
    private String status;
    private LocalDateTime createdAt;
    private Long houseId;

    public ConstructionProgressResponseDTO() {
    }

    public ConstructionProgressResponseDTO(
            Long id,
            String stageName,
            Double progressPercentage,
            String status,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.stageName = stageName;
        this.progressPercentage = progressPercentage;
        this.status = status;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getHouseId() {
        return houseId;
    }
}