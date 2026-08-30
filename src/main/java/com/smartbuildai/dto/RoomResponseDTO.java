package com.smartbuildai.dto;

import java.time.LocalDateTime;

public class RoomResponseDTO {

    private Long id;
    private String roomName;
    private String roomType;
    private Double area;
    private LocalDateTime createdAt;
    private Long houseId;

    public RoomResponseDTO() {
    }

    public RoomResponseDTO(
            Long id,
            String roomName,
            String roomType,
            Double area,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.roomName = roomName;
        this.roomType = roomType;
        this.area = area;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
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