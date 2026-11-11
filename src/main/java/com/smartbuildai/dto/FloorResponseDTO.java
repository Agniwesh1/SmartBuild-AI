package com.smartbuildai.dto;
import java.time.LocalDateTime;
public record FloorResponseDTO(Long id, String floorName, Integer floorNumber, Double area, LocalDateTime createdAt, Long houseId) {}
