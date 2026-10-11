package com.smartbuildai.service;

import com.smartbuildai.dto.ProjectRequestDTO;
import com.smartbuildai.entity.Project;
import com.smartbuildai.entity.User;
import com.smartbuildai.exception.ProjectNotFoundException;
import com.smartbuildai.exception.UserNotFoundException;
import com.smartbuildai.repository.ProjectRepository;
import com.smartbuildai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project createProject(ProjectRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + request.getUserId()));

        Project project = new Project();

        project.setName(request.getName());
        project.setLocation(request.getLocation());
        project.setBudget(request.getBudget());
        project.setUser(user);

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project not found with id: " + id));
    }

    public Project updateProject(Long id, ProjectRequestDTO request) {

        Project existingProject = getProjectById(id);

        existingProject.setName(request.getName());
        existingProject.setLocation(request.getLocation());
        existingProject.setBudget(request.getBudget());

        if (request.getUserId() != null) {

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() ->
                            new UserNotFoundException(
                                    "User not found with id: " + request.getUserId()));

            existingProject.setUser(user);
        }

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {
        getProjectById(id);
        projectRepository.deleteById(id);
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }
}