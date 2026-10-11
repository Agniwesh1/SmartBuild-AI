
package com.smartbuildai.controller;

import com.smartbuildai.dto.DashboardResponseDTO;
import com.smartbuildai.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponseDTO getDashboard(
            Authentication authentication) {

        String username = authentication.getName();

        return dashboardService.getDashboard(username);
    }
}
