package com.smartbuildai.controller;

import com.smartbuildai.dto.ContractorRequestDTO;
import com.smartbuildai.dto.ContractorResponseDTO;
import com.smartbuildai.service.ContractorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contractors")
public class ContractorController {

    private final ContractorService contractorService;

    public ContractorController(ContractorService contractorService) {
        this.contractorService = contractorService;
    }

    @PostMapping
    public ContractorResponseDTO createContractor(
            @RequestBody ContractorRequestDTO request) {

        return contractorService.createContractor(request);
    }

    @GetMapping
    public List<ContractorResponseDTO> getAllContractors() {

        return contractorService.getAllContractors();
    }

    @GetMapping("/{id}")
    public ContractorResponseDTO getContractorById(
            @PathVariable Long id) {

        return contractorService.getContractorById(id);
    }

    @PutMapping("/{id}")
    public ContractorResponseDTO updateContractor(
            @PathVariable Long id,
            @RequestBody ContractorRequestDTO request) {

        return contractorService.updateContractor(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteContractor(
            @PathVariable Long id) {

        contractorService.deleteContractor(id);
    }
}