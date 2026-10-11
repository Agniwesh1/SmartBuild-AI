
package com.smartbuildai.repository;

import com.smartbuildai.entity.ConstructionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConstructionProgressRepository
        extends JpaRepository<ConstructionProgress, Long> {

    @Query("""
            SELECT COALESCE(AVG(cp.progressPercentage), 0.0)
            FROM ConstructionProgress cp
            WHERE cp.house.project.user.id = :userId
            """)
    Double calculateAverageProgressByUserId(
            @Param("userId") Long userId);
}
