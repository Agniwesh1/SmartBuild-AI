package com.smartbuildai.service;

import com.smartbuildai.dto.RoomChangeDTO;
import com.smartbuildai.dto.RoomChangesRequestDTO;
import com.smartbuildai.dto.RoomRequestDTO;
import com.smartbuildai.dto.RoomResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.entity.Room;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.exception.RoomNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import com.smartbuildai.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Transactional
    public List<RoomResponseDTO> applyRoomChanges(
            RoomChangesRequestDTO request) {

        if (request == null || request.getHouseId() == null) {
            throw new IllegalArgumentException(
                    "House ID is required.");
        }

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        List<RoomChangeDTO> rooms = request.getRooms() == null
                ? new ArrayList<>()
                : request.getRooms();

        List<Long> deletedRoomIds = request.getDeletedRoomIds() == null
                ? new ArrayList<>()
                : request.getDeletedRoomIds();

        Set<Long> processedRoomIds = new HashSet<>();
        Set<Long> deletedIds = new HashSet<>(deletedRoomIds);

        if (deletedIds.size() != deletedRoomIds.size()) {
            throw new IllegalArgumentException(
                    "Duplicate room IDs found in deletion list.");
        }

        for (Long deletedRoomId : deletedRoomIds) {

            if (deletedRoomId == null) {
                throw new IllegalArgumentException(
                        "Deleted room ID cannot be null.");
            }

            Room existingRoom = roomRepository.findById(deletedRoomId)
                    .orElseThrow(() ->
                            new RoomNotFoundException(
                                    "Room not found with id: " + deletedRoomId));

            if (!existingRoom.getHouse().getId().equals(house.getId())) {
                throw new IllegalArgumentException(
                        "Room does not belong to the selected house.");
            }

            roomRepository.delete(existingRoom);
        }

        for (RoomChangeDTO roomData : rooms) {

            if (roomData == null) {
                throw new IllegalArgumentException(
                        "Room details cannot be null.");
            }

            if (roomData.getRoomName() == null
                    || roomData.getRoomName().isBlank()) {
                throw new IllegalArgumentException(
                        "Room name is required.");
            }

            if (roomData.getRoomType() == null
                    || roomData.getRoomType().isBlank()) {
                throw new IllegalArgumentException(
                        "Room type is required.");
            }

            if (roomData.getArea() == null || roomData.getArea() <= 0) {
                throw new IllegalArgumentException(
                        "Room area must be greater than zero.");
            }

            Room room;

            if (roomData.getId() == null) {

                room = new Room();

            } else {

                if (!processedRoomIds.add(roomData.getId())) {
                    throw new IllegalArgumentException(
                            "Duplicate room ID found in changes.");
                }

                if (deletedIds.contains(roomData.getId())) {
                    throw new IllegalArgumentException(
                            "A room cannot be updated and deleted together.");
                }

                room = roomRepository.findById(roomData.getId())
                        .orElseThrow(() ->
                                new RoomNotFoundException(
                                        "Room not found with id: " + roomData.getId()));

                if (!room.getHouse().getId().equals(house.getId())) {
                    throw new IllegalArgumentException(
                            "Room does not belong to the selected house.");
                }
            }

            room.setRoomName(roomData.getRoomName().trim());
            room.setRoomType(roomData.getRoomType().trim());
            room.setArea(roomData.getArea());
            room.setHouse(house);

            roomRepository.save(room);
        }

        List<Room> finalRooms = roomRepository.findByHouseId(house.getId());

        int bedroomCount = 0;
        int bathroomCount = 0;

        for (Room room : finalRooms) {

            if ("Bedroom".equalsIgnoreCase(room.getRoomType().trim())) {
                bedroomCount++;
            }

            if ("Bathroom".equalsIgnoreCase(room.getRoomType().trim())) {
                bathroomCount++;
            }
        }

        house.setNumberOfBedrooms(bedroomCount);
        house.setNumberOfBathrooms(bathroomCount);

        houseRepository.save(house);

        return finalRooms.stream()
                .map(this::convertToResponse)
                .toList();
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