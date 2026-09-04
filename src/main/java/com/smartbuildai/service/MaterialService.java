package com.smartbuildai.service;

import com.smartbuildai.dto.MaterialRequestDTO;
import com.smartbuildai.dto.MaterialResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.entity.Material;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.exception.MaterialNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import com.smartbuildai.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final HouseRepository houseRepository;

    public MaterialService(
            MaterialRepository materialRepository,
            HouseRepository houseRepository) {

        this.materialRepository = materialRepository;
        this.houseRepository = houseRepository;
    }

    public MaterialResponseDTO createMaterial(MaterialRequestDTO request) {

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        Material material = new Material();

        material.setMaterialName(request.getMaterialName());
        material.setMaterialType(request.getMaterialType());
        material.setQuantity(request.getQuantity());
        material.setUnit(request.getUnit());
        material.setPrice(request.getPrice());
        material.setHouse(house);

        Material savedMaterial = materialRepository.save(material);

        return convertToResponse(savedMaterial);
    }

    public List<MaterialResponseDTO> getAllMaterials() {

        return materialRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public MaterialResponseDTO getMaterialById(Long id) {

        Material material = materialRepository.findById(id)
                .orElseThrow(() ->
                        new MaterialNotFoundException(
                                "Material not found with id: " + id));

        return convertToResponse(material);
    }

    public MaterialResponseDTO updateMaterial(
            Long id,
            MaterialRequestDTO request) {

        Material existingMaterial = materialRepository.findById(id)
                .orElseThrow(() ->
                        new MaterialNotFoundException(
                                "Material not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        existingMaterial.setMaterialName(request.getMaterialName());
        existingMaterial.setMaterialType(request.getMaterialType());
        existingMaterial.setQuantity(request.getQuantity());
        existingMaterial.setUnit(request.getUnit());
        existingMaterial.setPrice(request.getPrice());
        existingMaterial.setHouse(house);

        Material updatedMaterial = materialRepository.save(existingMaterial);

        return convertToResponse(updatedMaterial);
    }

    public void deleteMaterial(Long id) {

        Material existingMaterial = materialRepository.findById(id)
                .orElseThrow(() ->
                        new MaterialNotFoundException(
                                "Material not found with id: " + id));

        materialRepository.delete(existingMaterial);
    }

    private MaterialResponseDTO convertToResponse(Material material) {

        return new MaterialResponseDTO(
                material.getId(),
                material.getMaterialName(),
                material.getMaterialType(),
                material.getQuantity(),
                material.getUnit(),
                material.getPrice(),
                material.getCreatedAt(),
                material.getHouse().getId()
        );
    }
}