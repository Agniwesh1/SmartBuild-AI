package com.smartbuildai.service;

import com.smartbuildai.entity.Project;
import com.smartbuildai.exception.ProjectNotFoundException;
import com.smartbuildai.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new ProjectNotFoundException("Project not found with id: " + id));
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = getProjectById(id);

        existingProject.setName(updatedProject.getName());
        existingProject.setLocation(updatedProject.getLocation());
        existingProject.setBudget(updatedProject.getBudget());

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {
        getProjectById(id);
        projectRepository.deleteById(id);
    }
}