package com.smartbuildai.service;

import com.smartbuildai.dto.*;
import com.smartbuildai.entity.*;
import com.smartbuildai.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FloorService {
 private final FloorRepository floors; private final HouseRepository houses;
 public FloorService(FloorRepository floors, HouseRepository houses){this.floors=floors;this.houses=houses;}
 public List<FloorResponseDTO> list(Long houseId){ if(!houses.existsById(houseId)) throw new IllegalArgumentException("House not found: "+houseId); return floors.findByHouseIdOrderByFloorNumberAsc(houseId).stream().map(this::dto).toList();}
 @Transactional public FloorResponseDTO create(FloorRequestDTO r){validate(r); House h=houses.findById(r.getHouseId()).orElseThrow(()->new IllegalArgumentException("House not found: "+r.getHouseId())); if(floors.existsByHouseIdAndFloorNumber(h.getId(),r.getFloorNumber())) throw new IllegalArgumentException("This floor number already exists for the house."); Floor f=new Floor(); apply(f,r,h); return dto(floors.save(f));}
 @Transactional public FloorResponseDTO update(Long id, FloorRequestDTO r){validate(r); Floor f=floors.findById(id).orElseThrow(()->new IllegalArgumentException("Floor not found: "+id)); House h=houses.findById(r.getHouseId()).orElseThrow(()->new IllegalArgumentException("House not found: "+r.getHouseId())); if(floors.findByHouseIdOrderByFloorNumberAsc(h.getId()).stream().anyMatch(x->!x.getId().equals(id)&&x.getFloorNumber().equals(r.getFloorNumber()))) throw new IllegalArgumentException("This floor number already exists for the house."); apply(f,r,h); return dto(floors.save(f));}
 public void delete(Long id){Floor f=floors.findById(id).orElseThrow(()->new IllegalArgumentException("Floor not found: "+id)); floors.delete(f);}
 private void validate(FloorRequestDTO r){if(r==null||r.getHouseId()==null||r.getFloorNumber()==null||r.getFloorNumber()<1) throw new IllegalArgumentException("House ID and a positive floor number are required."); if(r.getFloorName()==null||r.getFloorName().isBlank()) throw new IllegalArgumentException("Floor name is required."); if(r.getArea()!=null&&r.getArea()<0) throw new IllegalArgumentException("Floor area cannot be negative.");}
 private void apply(Floor f,FloorRequestDTO r,House h){f.setFloorName(r.getFloorName().trim());f.setFloorNumber(r.getFloorNumber());f.setArea(r.getArea());f.setHouse(h);}
 private FloorResponseDTO dto(Floor f){return new FloorResponseDTO(f.getId(),f.getFloorName(),f.getFloorNumber(),f.getArea(),f.getCreatedAt(),f.getHouse().getId());}
}
