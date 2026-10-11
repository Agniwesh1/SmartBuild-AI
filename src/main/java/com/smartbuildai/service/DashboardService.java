package com.smartbuildai.service;

import com.smartbuildai.dto.DashboardResponseDTO;
import com.smartbuildai.entity.Project;
import com.smartbuildai.entity.User;
import com.smartbuildai.exception.UserNotFoundException;
import com.smartbuildai.repository.ConstructionProgressRepository;
import com.smartbuildai.repository.ExpenseRepository;
import com.smartbuildai.repository.ProjectRepository;
import com.smartbuildai.repository.TaskRepository;
import com.smartbuildai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ExpenseRepository expenseRepository;
    private final ConstructionProgressRepository constructionProgressRepository;
    private final TaskRepository taskRepository;

    public DashboardService(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ExpenseRepository expenseRepository,
            ConstructionProgressRepository constructionProgressRepository,
            TaskRepository taskRepository) {

        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.expenseRepository = expenseRepository;
        this.constructionProgressRepository = constructionProgressRepository;
        this.taskRepository = taskRepository;
    }

    public DashboardResponseDTO getDashboard(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with username: " + username));

        List<Project> projects =
                projectRepository.findByUserId(user.getId());

        BigDecimal totalBudget = projects.stream()
                .map(Project::getBudget)
                .filter(budget -> budget != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Double totalExpenses =
                expenseRepository.calculateTotalExpensesByUserId(user.getId());

        Double averageProgressPercentage =
                constructionProgressRepository
                        .calculateAverageProgressByUserId(user.getId());

        long totalTasks =
                taskRepository.countTasksByUserId(user.getId());

        long completedTasks =
                taskRepository.countCompletedTasksByUserId(user.getId());

        return new DashboardResponseDTO(
                user.getUsername(),
                projects.size(),
                totalBudget,
                totalExpenses,
                averageProgressPercentage,
                totalTasks,
                completedTasks
        );
    }
}