package com.smartbuildai.repository;

import com.smartbuildai.entity.ConstructionProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstructionProgressRepository
        extends JpaRepository<ConstructionProgress, Long> {
}