package com.smartbuildai.service;

import com.smartbuildai.dto.ExpenseRequestDTO;
import com.smartbuildai.dto.ExpenseResponseDTO;
import com.smartbuildai.entity.Expense;
import com.smartbuildai.entity.House;
import com.smartbuildai.exception.ExpenseNotFoundException;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.repository.ExpenseRepository;
import com.smartbuildai.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final HouseRepository houseRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            HouseRepository houseRepository) {

        this.expenseRepository = expenseRepository;
        this.houseRepository = houseRepository;
    }

    public ExpenseResponseDTO createExpense(ExpenseRequestDTO request) {

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        Expense expense = new Expense();

        expense.setExpenseName(request.getExpenseName());
        expense.setExpenseType(request.getExpenseType());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setHouse(house);

        Expense savedExpense = expenseRepository.save(expense);

        return convertToResponse(savedExpense);
    }

    public List<ExpenseResponseDTO> getAllExpenses() {

        return expenseRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ExpenseResponseDTO getExpenseById(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ExpenseNotFoundException(
                                "Expense not found with id: " + id));

        return convertToResponse(expense);
    }

    public ExpenseResponseDTO updateExpense(
            Long id,
            ExpenseRequestDTO request) {

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ExpenseNotFoundException(
                                "Expense not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() ->
                        new HouseNotFoundException(
                                "House not found with id: " + request.getHouseId()));

        existingExpense.setExpenseName(request.getExpenseName());
        existingExpense.setExpenseType(request.getExpenseType());
        existingExpense.setAmount(request.getAmount());
        existingExpense.setDescription(request.getDescription());
        existingExpense.setHouse(house);

        Expense updatedExpense = expenseRepository.save(existingExpense);

        return convertToResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ExpenseNotFoundException(
                                "Expense not found with id: " + id));

        expenseRepository.delete(existingExpense);
    }

    private ExpenseResponseDTO convertToResponse(Expense expense) {

        return new ExpenseResponseDTO(
                expense.getId(),
                expense.getExpenseName(),
                expense.getExpenseType(),
                expense.getAmount(),
                expense.getDescription(),
                expense.getCreatedAt(),
                expense.getHouse().getId()
        );
    }
}