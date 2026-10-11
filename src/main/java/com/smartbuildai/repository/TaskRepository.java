package com.smartbuildai.repository;

import com.smartbuildai.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
            SELECT COUNT(t)
            FROM Task t
            WHERE t.house.project.user.id = :userId
            """)
    long countTasksByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT COUNT(t)
            FROM Task t
            WHERE t.house.project.user.id = :userId
              AND UPPER(t.status) = 'COMPLETED'
            """)
    long countCompletedTasksByUserId(@Param("userId") Long userId);
}