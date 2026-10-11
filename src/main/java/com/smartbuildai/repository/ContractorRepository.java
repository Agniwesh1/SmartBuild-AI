package com.smartbuildai.repository;

import com.smartbuildai.entity.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
}