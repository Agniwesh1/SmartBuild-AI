package com.smartbuildai.controller;

import com.smartbuildai.dto.BudgetAnalysisResponseDTO;
import com.smartbuildai.dto.BudgetRequestDTO;
import com.smartbuildai.dto.BudgetResponseDTO;
import com.smartbuildai.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponseDTO> createBudget(
            @RequestBody BudgetRequestDTO request) {

        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getAllBudgets() {

        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> getBudgetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping("/analysis/{houseId}")
    public ResponseEntity<BudgetAnalysisResponseDTO> getBudgetAnalysis(
            @PathVariable Long houseId) {

        return ResponseEntity.ok(
                budgetService.getBudgetAnalysis(houseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> updateBudget(
            @PathVariable Long id,
            @RequestBody BudgetRequestDTO request) {

        return ResponseEntity.ok(
                budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }
}