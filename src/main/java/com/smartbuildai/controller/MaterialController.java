package com.smartbuildai.controller;

import com.smartbuildai.dto.MaterialRequestDTO;
import com.smartbuildai.dto.MaterialResponseDTO;
import com.smartbuildai.service.MaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> createMaterial(
            @RequestBody MaterialRequestDTO request) {

        return ResponseEntity.ok(
                materialService.createMaterial(request));
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> getAllMaterials() {

        return ResponseEntity.ok(
                materialService.getAllMaterials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> getMaterialById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                materialService.getMaterialById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> updateMaterial(
            @PathVariable Long id,
            @RequestBody MaterialRequestDTO request) {

        return ResponseEntity.ok(
                materialService.updateMaterial(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable Long id) {

        materialService.deleteMaterial(id);

        return ResponseEntity.noContent().build();
    }
}