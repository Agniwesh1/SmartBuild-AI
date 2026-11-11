package com.smartbuildai.repository;
import com.smartbuildai.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findByHouseIdOrderByFloorNumberAsc(Long houseId);
    boolean existsByHouseIdAndFloorNumber(Long houseId, Integer floorNumber);
}
