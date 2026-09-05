package com.smartbuildai.service;

import com.smartbuildai.dto.ConstructionProgressAnalysisResponseDTO;
import com.smartbuildai.dto.ConstructionProgressRequestDTO;
import com.smartbuildai.dto.ConstructionProgressResponseDTO;
import com.smartbuildai.entity.ConstructionProgress;
import com.smartbuildai.entity.House;
import com.smartbuildai.exception.ConstructionProgressNotFoundException;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.repository.ConstructionProgressRepository;
import com.smartbuildai.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConstructionProgressService {

    private final ConstructionProgressRepository constructionProgressRepository;
    private final HouseRepository houseRepository;

    public ConstructionProgressService(
            ConstructionProgressRepository constructionProgressRepository,
            HouseRepository houseRepository) {

        this.constructionProgressRepository = constructionProgressRepository;
        this.houseRepository = houseRepository;
    }

    public ConstructionProgressResponseDTO createProgress(
            ConstructionProgressRequestDTO request) {

        validateProgress(request);

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        ConstructionProgress progress = new ConstructionProgress();

        progress.setStageName(request.getStageName());
        progress.setProgressPercentage(request.getProgressPercentage());
        progress.setStatus(request.getStatus());
        progress.setHouse(house);

        ConstructionProgress savedProgress =
                constructionProgressRepository.save(progress);

        return convertToResponse(savedProgress);
    }

    public List<ConstructionProgressResponseDTO> getAllProgress() {

        return constructionProgressRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ConstructionProgressResponseDTO getProgressById(Long id) {

        ConstructionProgress progress =
                constructionProgressRepository.findById(id)
                        .orElseThrow(() ->
                                new ConstructionProgressNotFoundException(
                                        "Construction progress not found with id: " + id));

        return convertToResponse(progress);
    }

    public ConstructionProgressResponseDTO updateProgress(
            Long id,
            ConstructionProgressRequestDTO request) {

        validateProgress(request);

        ConstructionProgress existingProgress =
                constructionProgressRepository.findById(id)
                        .orElseThrow(() ->
                                new ConstructionProgressNotFoundException(
                                        "Construction progress not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        existingProgress.setStageName(request.getStageName());
        existingProgress.setProgressPercentage(
                request.getProgressPercentage());
        existingProgress.setStatus(request.getStatus());
        existingProgress.setHouse(house);

        ConstructionProgress updatedProgress =
                constructionProgressRepository.save(existingProgress);

        return convertToResponse(updatedProgress);
    }

    public void deleteProgress(Long id) {

        ConstructionProgress existingProgress =
                constructionProgressRepository.findById(id)
                        .orElseThrow(() ->
                                new ConstructionProgressNotFoundException(
                                        "Construction progress not found with id: " + id));

        constructionProgressRepository.delete(existingProgress);
    }

    public ConstructionProgressAnalysisResponseDTO getProgressAnalysis(
            Long houseId) {

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + houseId));

        List<ConstructionProgress> progressList =
                house.getConstructionProgress();

        int totalStages = progressList.size();

        int completedStages = (int) progressList.stream()
                .filter(progress ->
                        "COMPLETED".equalsIgnoreCase(progress.getStatus()))
                .count();

        int inProgressStages = (int) progressList.stream()
                .filter(progress ->
                        "IN_PROGRESS".equalsIgnoreCase(progress.getStatus()))
                .count();

        double overallProgressPercentage = 0.0;

        if (totalStages > 0) {
            double totalProgress = progressList.stream()
                    .mapToDouble(ConstructionProgress::getProgressPercentage)
                    .sum();

            overallProgressPercentage =
                    totalProgress / totalStages;
        }

        String overallStatus;

        if (totalStages == 0) {
            overallStatus = "NOT_STARTED";
        } else if (completedStages == totalStages) {
            overallStatus = "COMPLETED";
        } else {
            overallStatus = "IN_PROGRESS";
        }

        return new ConstructionProgressAnalysisResponseDTO(
                houseId,
                overallProgressPercentage,
                totalStages,
                completedStages,
                inProgressStages,
                overallStatus
        );
    }

    private void validateProgress(
            ConstructionProgressRequestDTO request) {

        if (request.getProgressPercentage() == null) {
            throw new IllegalArgumentException(
                    "Progress percentage is required");
        }

        if (request.getProgressPercentage() < 0 ||
                request.getProgressPercentage() > 100) {

            throw new IllegalArgumentException(
                    "Progress percentage must be between 0 and 100");
        }
    }

    private ConstructionProgressResponseDTO convertToResponse(
            ConstructionProgress progress) {

        return new ConstructionProgressResponseDTO(
                progress.getId(),
                progress.getStageName(),
                progress.getProgressPercentage(),
                progress.getStatus(),
                progress.getCreatedAt(),
                progress.getHouse().getId()
        );
    }
}