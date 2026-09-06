package com.smartbuildai.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponseDTO {

    private Long id;
    private String taskName;
    private String description;
    private String status;
    private String priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private Long houseId;

    public TaskResponseDTO() {
    }

    public TaskResponseDTO(
            Long id,
            String taskName,
            String description,
            String status,
            String priority,
            LocalDate startDate,
            LocalDate dueDate,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.taskName = taskName;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getHouseId() {
        return houseId;
    }
}