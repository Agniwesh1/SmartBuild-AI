package com.smartbuildai.dto;

import java.math.BigDecimal;

public class DashboardResponseDTO {

    private String username;
    private long totalProjects;
    private BigDecimal totalBudget;
    private Double totalExpenses;
    private Double averageProgressPercentage;
    private long totalTasks;
    private long completedTasks;

    public DashboardResponseDTO(
            String username,
            long totalProjects,
            BigDecimal totalBudget,
            Double totalExpenses,
            Double averageProgressPercentage,
            long totalTasks,
            long completedTasks) {

        this.username = username;
        this.totalProjects = totalProjects;
        this.totalBudget = totalBudget;
        this.totalExpenses = totalExpenses;
        this.averageProgressPercentage = averageProgressPercentage;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
    }

    public String getUsername() {
        return username;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public Double getAverageProgressPercentage() {
        return averageProgressPercentage;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }
}