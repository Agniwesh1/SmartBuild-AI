package com.smartbuildai.service;

import com.smartbuildai.dto.TaskRequestDTO;
import com.smartbuildai.dto.TaskResponseDTO;
import com.smartbuildai.entity.House;
import com.smartbuildai.entity.Task;
import com.smartbuildai.exception.HouseNotFoundException;
import com.smartbuildai.exception.TaskNotFoundException;
import com.smartbuildai.repository.HouseRepository;
import com.smartbuildai.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final HouseRepository houseRepository;

    public TaskService(
            TaskRepository taskRepository,
            HouseRepository houseRepository) {

        this.taskRepository = taskRepository;
        this.houseRepository = houseRepository;
    }

    public TaskResponseDTO createTask(TaskRequestDTO request) {

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        Task task = new Task();

        task.setTaskName(request.getTaskName());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setStartDate(request.getStartDate());
        task.setDueDate(request.getDueDate());
        task.setHouse(house);

        Task savedTask = taskRepository.save(task);

        return convertToResponse(savedTask);
    }

    public List<TaskResponseDTO> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public TaskResponseDTO getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id: " + id));

        return convertToResponse(task);
    }

    public TaskResponseDTO updateTask(
            Long id,
            TaskRequestDTO request) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id: " + id));

        House house = houseRepository.findById(request.getHouseId())
                .orElseThrow(() -> new HouseNotFoundException(
                        "House not found with id: " + request.getHouseId()));

        existingTask.setTaskName(request.getTaskName());
        existingTask.setDescription(request.getDescription());
        existingTask.setStatus(request.getStatus());
        existingTask.setPriority(request.getPriority());
        existingTask.setStartDate(request.getStartDate());
        existingTask.setDueDate(request.getDueDate());
        existingTask.setHouse(house);

        Task updatedTask = taskRepository.save(existingTask);

        return convertToResponse(updatedTask);
    }

    public void deleteTask(Long id) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id: " + id));

        taskRepository.delete(existingTask);
    }

    private TaskResponseDTO convertToResponse(Task task) {

        return new TaskResponseDTO(
                task.getId(),
                task.getTaskName(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getStartDate(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getHouse().getId()
        );
    }
}