package com.smartbuildai.service;

import com.smartbuildai.dto.RoomRequestDTO;
import com.smartbuildai.dto.RoomResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.entity.Room;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.exception.RoomNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import com.smartbuildai.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HouseRepository houseRepository;

    public RoomService(
            RoomRepository roomRepository,
            HouseRepository houseRepository) {

        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
    }

    public RoomResponseDTO createRoom(RoomRequestDTO request) {

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        Room room = new Room();

        room.setRoomName(request.getRoomName());
        room.setRoomType(request.getRoomType());
        room.setArea(request.getArea());
        room.setHouse(house);

        Room savedRoom = roomRepository.save(room);

        return convertToResponse(savedRoom);
    }

    public List<RoomResponseDTO> getAllRooms() {

        return roomRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public RoomResponseDTO getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RoomNotFoundException(
                                "Room not found with id: " + id));

        return convertToResponse(room);
    }

    public RoomResponseDTO updateRoom(
            Long id,
            RoomRequestDTO request) {

        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RoomNotFoundException(
                                "Room not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        existingRoom.setRoomName(request.getRoomName());
        existingRoom.setRoomType(request.getRoomType());
        existingRoom.setArea(request.getArea());
        existingRoom.setHouse(house);

        Room updatedRoom = roomRepository.save(existingRoom);

        return convertToResponse(updatedRoom);
    }

    public void deleteRoom(Long id) {

        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RoomNotFoundException(
                                "Room not found with id: " + id));

        roomRepository.delete(existingRoom);
    }

    private RoomResponseDTO convertToResponse(Room room) {

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