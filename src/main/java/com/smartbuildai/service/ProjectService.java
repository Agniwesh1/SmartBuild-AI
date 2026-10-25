package com.smartbuildai.service;

import com.smartbuildai.dto.ProjectRequestDTO;
import com.smartbuildai.entity.Project;
import com.smartbuildai.entity.User;
import com.smartbuildai.exception.ProjectNotFoundException;
import com.smartbuildai.exception.UserNotFoundException;
import com.smartbuildai.repository.ProjectRepository;
import com.smartbuildai.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {

            throw new AccessDeniedException(
                    "You must be logged in to access projects.");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Authenticated user was not found."));
    }

    private Project getOwnedProject(Long projectId, User user) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                "Project not found with id: " + projectId));

        if (project.getUser() == null
                || !project.getUser().getId().equals(user.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to access this project.");
        }

        return project;
    }

    public Project createProject(ProjectRequestDTO request) {

        User user = getAuthenticatedUser();

        Project project = new Project();

        project.setName(request.getName());
        project.setLocation(request.getLocation());
        project.setBudget(request.getBudget());
        project.setUser(user);

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {

        User user = getAuthenticatedUser();

        return projectRepository.findByUserId(user.getId());
    }

    public Project getProjectById(Long id) {

        User user = getAuthenticatedUser();

        return getOwnedProject(id, user);
    }

    public Project updateProject(
            Long id,
            ProjectRequestDTO request) {

        User user = getAuthenticatedUser();

        Project existingProject = getOwnedProject(id, user);

        existingProject.setName(request.getName());
        existingProject.setLocation(request.getLocation());
        existingProject.setBudget(request.getBudget());

        // The project owner cannot be changed through this request.

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {

        User user = getAuthenticatedUser();

        getOwnedProject(id, user);

        projectRepository.deleteById(id);
    }

    public List<Project> getProjectsByUserId(Long userId) {

        User user = getAuthenticatedUser();

        if (!user.getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You are not allowed to access another user's projects.");
        }

        return projectRepository.findByUserId(user.getId());
    }
}