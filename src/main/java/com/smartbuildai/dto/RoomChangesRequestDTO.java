package com.smartbuildai.dto;

import java.util.List;

public class RoomChangesRequestDTO {

    private Long houseId;
    private List<RoomChangeDTO> rooms;
    private List<Long> deletedRoomIds;

    public RoomChangesRequestDTO() {
    }

    public Long getHouseId() {
        return houseId;
    }

    public void setHouseId(Long houseId) {
        this.houseId = houseId;
    }

    public List<RoomChangeDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomChangeDTO> rooms) {
        this.rooms = rooms;
    }

    public List<Long> getDeletedRoomIds() {
        return deletedRoomIds;
    }

    public void setDeletedRoomIds(List<Long> deletedRoomIds) {
        this.deletedRoomIds = deletedRoomIds;
    }
}