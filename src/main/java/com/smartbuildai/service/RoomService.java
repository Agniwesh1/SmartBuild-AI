package com.smartbuildai.service;

import com.smartbuildai.entity.Room;
import com.smartbuildai.exception.RoomNotFoundException;
import com.smartbuildai.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new RoomNotFoundException(
                                "Room not found with id: " + id));
    }

    public Room updateRoom(Long id, Room roomDetails) {

        Room existingRoom = getRoomById(id);

        existingRoom.setRoomName(roomDetails.getRoomName());
        existingRoom.setRoomType(roomDetails.getRoomType());
        existingRoom.setArea(roomDetails.getArea());

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Long id) {

        Room existingRoom = getRoomById(id);

        roomRepository.delete(existingRoom);
    }
}