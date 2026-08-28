package com.smartbuildai.controller;

import com.smartbuildai.dto.HouseRequestDTO;
import com.smartbuildai.dto.HouseResponseDTO;
import com.smartbuildai.service.HouseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/houses")
public class HouseController {

    private final HouseService houseService;

    public HouseController(HouseService houseService) {
        this.houseService = houseService;
    }

    @PostMapping
    public HouseResponseDTO createHouse(
            @RequestBody HouseRequestDTO request) {
        return houseService.createHouse(request);
    }

    @GetMapping
    public List<HouseResponseDTO> getAllHouses() {
        return houseService.getAllHouses();
    }

    @GetMapping("/{id}")
    public HouseResponseDTO getHouseById(
            @PathVariable Long id) {
        return houseService.getHouseById(id);
    }

    @PutMapping("/{id}")
    public HouseResponseDTO updateHouse(
            @PathVariable Long id,
            @RequestBody HouseRequestDTO request) {
        return houseService.updateHouse(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteHouse(@PathVariable Long id) {
        houseService.deleteHouse(id);
    }
}