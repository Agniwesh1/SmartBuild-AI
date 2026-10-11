
package com.smartbuildai.repository;

import com.smartbuildai.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.house.project.user.id = :userId
            """)
    Double calculateTotalExpensesByUserId(@Param("userId") Long userId);
}
