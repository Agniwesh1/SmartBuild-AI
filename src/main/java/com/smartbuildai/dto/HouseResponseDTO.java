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
            List<RoomResponseDTO> rooms) {

        this.id = id;
        this.houseName = houseName;
        this.totalArea = totalArea;
        this.numberOfFloors = numberOfFloors;
        this.numberOfBedrooms = numberOfBedrooms;
        this.numberOfBathrooms = numberOfBathrooms;
        this.createdAt = createdAt;
        this.projectId = projectId;
        this.rooms = rooms;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<RoomResponseDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomResponseDTO> rooms) {
        this.rooms = rooms;
    }
}