package com.smartbuildai.service;

import com.smartbuildai.dto.HouseRequestDTO;
import com.smartbuildai.dto.HouseResponseDTO;
import com.smartbuildai.dto.RoomResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.entity.Project;
import com.smartbuildai.entity.Room;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.exception.ProjectNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import com.smartbuildai.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseService {

    private final HouseRepository houseRepository;
    private final ProjectRepository projectRepository;

    public HouseService(
            HouseRepository houseRepository,
            ProjectRepository projectRepository) {

        this.houseRepository = houseRepository;
        this.projectRepository = projectRepository;
    }

    public HouseResponseDTO createHouse(HouseRequestDTO request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project not found with id: " + request.getProjectId()));

        House house = new House();

        house.setHouseName(request.getHouseName());
        house.setTotalArea(request.getTotalArea());
        house.setNumberOfFloors(request.getNumberOfFloors());
        house.setNumberOfBedrooms(request.getNumberOfBedrooms());
        house.setNumberOfBathrooms(request.getNumberOfBathrooms());
        house.setProject(project);

        House savedHouse = houseRepository.save(house);

        return convertToResponse(savedHouse);
    }

    public List<HouseResponseDTO> getAllHouses() {

        return houseRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public HouseResponseDTO getHouseById(Long id) {

        House house = houseRepository.findById(id)
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + id));

        return convertToResponse(house);
    }

    public HouseResponseDTO updateHouse(
            Long id,
            HouseRequestDTO request) {

        House existingHouse = houseRepository.findById(id)
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + id));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project not found with id: " + request.getProjectId()));

        existingHouse.setHouseName(request.getHouseName());
        existingHouse.setTotalArea(request.getTotalArea());
        existingHouse.setNumberOfFloors(request.getNumberOfFloors());
        existingHouse.setNumberOfBedrooms(request.getNumberOfBedrooms());
        existingHouse.setNumberOfBathrooms(request.getNumberOfBathrooms());
        existingHouse.setProject(project);

        House updatedHouse = houseRepository.save(existingHouse);

        return convertToResponse(updatedHouse);
    }

    public void deleteHouse(Long id) {

        House house = houseRepository.findById(id)
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + id));

        houseRepository.delete(house);
    }

    private HouseResponseDTO convertToResponse(House house) {

        List<RoomResponseDTO> rooms = house.getRooms()
                .stream()
                .map(this::convertRoomToResponse)
                .toList();

        return new HouseResponseDTO(
                house.getId(),
                house.getHouseName(),
                house.getTotalArea(),
                house.getNumberOfFloors(),
                house.getNumberOfBedrooms(),
                house.getNumberOfBathrooms(),
                house.getCreatedAt(),
                house.getProject().getId(),
                rooms
        );
    }

    private RoomResponseDTO convertRoomToResponse(Room room) {

        return new RoomResponseDTO(
                room.getId(),
                room.getRoomName(),
                room.getRoomType(),
                room.getArea(),
                room.getCreatedAt(),
                room.getHouse().getId()
        );
    }
}