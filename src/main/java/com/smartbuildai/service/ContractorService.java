package com.smartbuildai.service;

import com.smartbuildai.dto.ContractorRequestDTO;
import com.smartbuildai.dto.ContractorResponseDTO;
import com.smartbuildai.entity.Contractor;
import com.smartbuildai.entity.Project;
import com.smartbuildai.exception.ContractorNotFoundException;
import com.smartbuildai.exception.ProjectNotFoundException;
import com.smartbuildai.repository.ContractorRepository;
import com.smartbuildai.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractorService {

    private final ContractorRepository contractorRepository;
    private final ProjectRepository projectRepository;

    public ContractorService(
            ContractorRepository contractorRepository,
            ProjectRepository projectRepository) {

        this.contractorRepository = contractorRepository;
        this.projectRepository = projectRepository;
    }

    public ContractorResponseDTO createContractor(
            ContractorRequestDTO request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project not found with id: " + request.getProjectId()));

        Contractor contractor = new Contractor();

        contractor.setName(request.getName());
        contractor.setCompany(request.getCompany());
        contractor.setPhone(request.getPhone());
        contractor.setEmail(request.getEmail());
        contractor.setSpecialization(request.getSpecialization());
        contractor.setContractAmount(request.getContractAmount());
        contractor.setStatus(request.getStatus());
        contractor.setProject(project);

        Contractor savedContractor =
                contractorRepository.save(contractor);

        return convertToResponse(savedContractor);
    }

    public List<ContractorResponseDTO> getAllContractors() {

        return contractorRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ContractorResponseDTO getContractorById(Long id) {

        Contractor contractor = contractorRepository.findById(id)
                .orElseThrow(() ->
                        new ContractorNotFoundException(
                                "Contractor not found with id: " + id));

        return convertToResponse(contractor);
    }

    public ContractorResponseDTO updateContractor(
            Long id,
            ContractorRequestDTO request) {

        Contractor existingContractor =
                contractorRepository.findById(id)
                        .orElseThrow(() ->
                                new ContractorNotFoundException(
                                        "Contractor not found with id: " + id));

        existingContractor.setName(request.getName());
        existingContractor.setCompany(request.getCompany());
        existingContractor.setPhone(request.getPhone());
        existingContractor.setEmail(request.getEmail());
        existingContractor.setSpecialization(request.getSpecialization());
        existingContractor.setContractAmount(request.getContractAmount());
        existingContractor.setStatus(request.getStatus());

        if (request.getProjectId() != null) {

            Project project =
                    projectRepository.findById(request.getProjectId())
                            .orElseThrow(() ->
                                    new ProjectNotFoundException(
                                            "Project not found with id: "
                                                    + request.getProjectId()));

            existingContractor.setProject(project);
        }

        Contractor updatedContractor =
                contractorRepository.save(existingContractor);

        return convertToResponse(updatedContractor);
    }

    public void deleteContractor(Long id) {

        Contractor contractor =
                contractorRepository.findById(id)
                        .orElseThrow(() ->
                                new ContractorNotFoundException(
                                        "Contractor not found with id: " + id));

        contractorRepository.delete(contractor);
    }

    private ContractorResponseDTO convertToResponse(
            Contractor contractor) {

        Long projectId = null;

        if (contractor.getProject() != null) {
            projectId = contractor.getProject().getId();
        }

        return new ContractorResponseDTO(
                contractor.getId(),
                contractor.getName(),
                contractor.getCompany(),
                contractor.getPhone(),
                contractor.getEmail(),
                contractor.getSpecialization(),
                contractor.getContractAmount(),
                contractor.getStatus(),
                contractor.getCreatedAt(),
                projectId
        );
    }
}