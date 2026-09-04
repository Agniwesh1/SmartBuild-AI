package com.smartbuildai.dto;

import java.time.LocalDateTime;

public class MaterialResponseDTO {

    private Long id;
    private String materialName;
    private String materialType;
    private Double quantity;
    private String unit;
    private Double price;
    private LocalDateTime createdAt;
    private Long houseId;

    public MaterialResponseDTO() {
    }

    public MaterialResponseDTO(
            Long id,
            String materialName,
            String materialType,
            Double quantity,
            String unit,
            Double price,
            LocalDateTime createdAt,
            Long houseId) {

        this.id = id;
        this.materialName = materialName;
        this.materialType = materialType;
        this.quantity = quantity;
        this.unit = unit;
        this.price = price;
        this.createdAt = createdAt;
        this.houseId = houseId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
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