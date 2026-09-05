package com.smartbuildai.dto;

public class ConstructionProgressAnalysisResponseDTO {

    private Long houseId;
    private Double overallProgressPercentage;
    private Integer totalStages;
    private Integer completedStages;
    private Integer inProgressStages;
    private String overallStatus;

    public ConstructionProgressAnalysisResponseDTO() {
    }

    public ConstructionProgressAnalysisResponseDTO(
            Long houseId,
            Double overallProgressPercentage,
            Integer totalStages,
            Integer completedStages,
            Integer inProgressStages,
            String overallStatus) {

        this.houseId = houseId;
        this.overallProgressPercentage = overallProgressPercentage;
        this.totalStages = totalStages;
        this.completedStages = completedStages;
        this.inProgressStages = inProgressStages;
        this.overallStatus = overallStatus;
    }

    public Long getHouseId() {
        return houseId;
    }

    public Double getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public Integer getTotalStages() {
        return totalStages;
    }

    public Integer getCompletedStages() {
        return completedStages;
    }

    public Integer getInProgressStages() {
        return inProgressStages;
    }

    public String getOverallStatus() {
        return overallStatus;
    }
}