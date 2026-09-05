package com.smartbuildai.controller;

import com.smartbuildai.dto.ConstructionProgressAnalysisResponseDTO;
import com.smartbuildai.dto.ConstructionProgressRequestDTO;
import com.smartbuildai.dto.ConstructionProgressResponseDTO;
import com.smartbuildai.service.ConstructionProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/construction-progress")
public class ConstructionProgressController {

    private final ConstructionProgressService constructionProgressService;

    public ConstructionProgressController(
            ConstructionProgressService constructionProgressService) {

        this.constructionProgressService = constructionProgressService;
    }

    @PostMapping
    public ResponseEntity<ConstructionProgressResponseDTO> createProgress(
            @RequestBody ConstructionProgressRequestDTO request) {

        return ResponseEntity.ok(
                constructionProgressService.createProgress(request));
    }

    @GetMapping
    public ResponseEntity<List<ConstructionProgressResponseDTO>> getAllProgress() {

        return ResponseEntity.ok(
                constructionProgressService.getAllProgress());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConstructionProgressResponseDTO> getProgressById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                constructionProgressService.getProgressById(id));
    }

    @GetMapping("/analysis/{houseId}")
    public ResponseEntity<ConstructionProgressAnalysisResponseDTO>
    getProgressAnalysis(@PathVariable Long houseId) {

        return ResponseEntity.ok(
                constructionProgressService.getProgressAnalysis(houseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConstructionProgressResponseDTO> updateProgress(
            @PathVariable Long id,
            @RequestBody ConstructionProgressRequestDTO request) {

        return ResponseEntity.ok(
                constructionProgressService.updateProgress(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(
            @PathVariable Long id) {

        constructionProgressService.deleteProgress(id);

        return ResponseEntity.noContent().build();
    }
}