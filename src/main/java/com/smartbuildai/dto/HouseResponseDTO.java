package com.smartbuildai.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HouseResponseDTO {

    private Long id;
    private String houseName;
    private Double totalArea;
    private Integer numberOfFloors;
    private Integer numberOfBedrooms;
    private Integer numberOfBathrooms;
    private LocalDateTime createdAt;
    private Long projectId;

    private List<RoomResponseDTO> rooms;
    private List<MaterialResponseDTO> materials;
    private List<ExpenseResponseDTO> expenses;
    private List<BudgetResponseDTO> budgets;
    private List<ConstructionProgressResponseDTO> constructionProgress;

    public HouseResponseDTO() {
    }

    public HouseResponseDTO(
            Long id,
            String houseName,
            Double totalArea,
            Integer numberOfFloors,
            Integer numberOfBedrooms,
            Integer numberOfBathrooms,
            LocalDateTime createdAt,
            Long projectId,
            List<RoomResponseDTO> rooms,
            List<MaterialResponseDTO> materials,
            List<ExpenseResponseDTO> expenses,
            List<BudgetResponseDTO> budgets,
            List<ConstructionProgressResponseDTO> constructionProgress) {

        this.id = id;
        this.houseName = houseName;
        this.totalArea = totalArea;
        this.numberOfFloors = numberOfFloors;
        this.numberOfBedrooms = numberOfBedrooms;
        this.numberOfBathrooms = numberOfBathrooms;
        this.createdAt = createdAt;
        this.projectId = projectId;
        this.rooms = rooms;
        this.materials = materials;
        this.expenses = expenses;
        this.budgets = budgets;
        this.constructionProgress = constructionProgress;
    }

    public Long getId() {
        return id;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public Double getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(Double totalArea) {
        this.totalArea = totalArea;
    }

    public Integer getNumberOfFloors() {
        return numberOfFloors;
    }

    public void setNumberOfFloors(Integer numberOfFloors) {
        this.numberOfFloors = numberOfFloors;
    }

    public Integer getNumberOfBedrooms() {
        return numberOfBedrooms;
    }

    public void setNumberOfBedrooms(Integer numberOfBedrooms) {
        this.numberOfBedrooms = numberOfBedrooms;
    }

    public Integer getNumberOfBathrooms() {
        return numberOfBathrooms;
    }

    public void setNumberOfBathrooms(Integer numberOfBathrooms) {
        this.numberOfBathrooms = numberOfBathrooms;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public List<RoomResponseDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomResponseDTO> rooms) {
        this.rooms = rooms;
    }

    public List<MaterialResponseDTO> getMaterials() {
        return materials;
    }

    public void setMaterials(List<MaterialResponseDTO> materials) {
        this.materials = materials;
    }

    public List<ExpenseResponseDTO> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<ExpenseResponseDTO> expenses) {
        this.expenses = expenses;
    }

    public List<BudgetResponseDTO> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<BudgetResponseDTO> budgets) {
        this.budgets = budgets;
    }

    public List<ConstructionProgressResponseDTO> getConstructionProgress() {
        return constructionProgress;
    }

    public void setConstructionProgress(
            List<ConstructionProgressResponseDTO> constructionProgress) {

        this.constructionProgress = constructionProgress;
    }
}