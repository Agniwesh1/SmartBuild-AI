package com.smartbuildai.service;

import com.smartbuildai.dto.HouseRequestDTO;
import com.smartbuildai.dto.HouseResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseService {

    private final HouseRepository houseRepository;

    public HouseService(HouseRepository houseRepository) {
        this.houseRepository = houseRepository;
    }

    public HouseResponseDTO createHouse(HouseRequestDTO request) {

        House house = new House();

        house.setHouseName(request.getHouseName());
        house.setTotalArea(request.getTotalArea());
        house.setNumberOfFloors(request.getNumberOfFloors());
        house.setNumberOfBedrooms(request.getNumberOfBedrooms());
        house.setNumberOfBathrooms(request.getNumberOfBathrooms());

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

        existingHouse.setHouseName(request.getHouseName());
        existingHouse.setTotalArea(request.getTotalArea());
        existingHouse.setNumberOfFloors(request.getNumberOfFloors());
        existingHouse.setNumberOfBedrooms(request.getNumberOfBedrooms());
        existingHouse.setNumberOfBathrooms(request.getNumberOfBathrooms());

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

        return new HouseResponseDTO(
                house.getId(),
                house.getHouseName(),
                house.getTotalArea(),
                house.getNumberOfFloors(),
                house.getNumberOfBedrooms(),
                house.getNumberOfBathrooms(),
                house.getCreatedAt()
        );
    }
}