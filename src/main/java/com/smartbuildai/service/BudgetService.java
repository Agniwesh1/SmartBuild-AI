package com.smartbuildai.service;

import com.smartbuildai.dto.BudgetAnalysisResponseDTO;
import com.smartbuildai.dto.BudgetRequestDTO;
import com.smartbuildai.dto.BudgetResponseDTO;
import com.smartbuildai.entity.Budget;
import com.smartbuildai.entity.Expense;
import com.smartbuildai.entity.House;
import com.smartbuildai.exception.BudgetNotFoundException;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.repository.BudgetRepository;
import com.smartbuildai.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final HouseRepository houseRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            HouseRepository houseRepository) {

        this.budgetRepository = budgetRepository;
        this.houseRepository = houseRepository;
    }

    public BudgetResponseDTO createBudget(BudgetRequestDTO request) {

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        Budget budget = new Budget();

        budget.setTotalBudget(request.getTotalBudget());
        budget.setHouse(house);

        Budget savedBudget = budgetRepository.save(budget);

        return convertToResponse(savedBudget);
    }

    public List<BudgetResponseDTO> getAllBudgets() {

        return budgetRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public BudgetResponseDTO getBudgetById(Long id) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new BudgetNotFoundException(
                        "Budget not found with id: " + id));

        return convertToResponse(budget);
    }

    public BudgetResponseDTO updateBudget(
            Long id,
            BudgetRequestDTO request) {

        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new BudgetNotFoundException(
                        "Budget not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        existingBudget.setTotalBudget(request.getTotalBudget());
        existingBudget.setHouse(house);

        Budget updatedBudget = budgetRepository.save(existingBudget);

        return convertToResponse(updatedBudget);
    }

    public void deleteBudget(Long id) {

        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new BudgetNotFoundException(
                        "Budget not found with id: " + id));

        budgetRepository.delete(existingBudget);
    }

    public BudgetAnalysisResponseDTO getBudgetAnalysis(Long houseId) {

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + houseId));

        Budget budget = budgetRepository.findAll()
                .stream()
                .filter(b -> b.getHouse().getId().equals(houseId))
                .findFirst()
                .orElseThrow(() -> new BudgetNotFoundException(
                        "Budget not found for house id: " + houseId));

        double totalBudget = budget.getTotalBudget();

        double totalSpent = house.getExpenses()
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        double remainingBudget = totalBudget - totalSpent;

        double budgetUsedPercentage = 0.0;

        if (totalBudget > 0) {
            budgetUsedPercentage =
                    (totalSpent / totalBudget) * 100;
        }

        Map<String, Double> expenseByType = house.getExpenses()
                .stream()
                .collect(Collectors.groupingBy(
                        Expense::getExpenseType,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        String budgetStatus;

        if (totalSpent > totalBudget) {
            budgetStatus = "OVER_BUDGET";
        } else {
            budgetStatus = "WITHIN_BUDGET";
        }

        return new BudgetAnalysisResponseDTO(
                houseId,
                totalBudget,
                totalSpent,
                remainingBudget,
                budgetUsedPercentage,
                expenseByType,
                budgetStatus
        );
    }

    private BudgetResponseDTO convertToResponse(Budget budget) {

        return new BudgetResponseDTO(
                budget.getId(),
                budget.getTotalBudget(),
                budget.getCreatedAt(),
                budget.getHouse().getId()
        );
    }
}