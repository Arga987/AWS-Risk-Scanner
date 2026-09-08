package com.example.securityScanner.controller;

import com.example.securityScanner.dto.SecurityFindingResponseDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;
import com.example.securityScanner.service.SecurityGroupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SecurityGroupController {

    private final SecurityGroupService securityGroupService;

    public SecurityGroupController(SecurityGroupService securityGroupService) {
        this.securityGroupService = securityGroupService;
    }

    @Deprecated
    @GetMapping("/security-groups")
    public List<SecurityGroupResponseDto> getSecurityGroups() {
        return securityGroupService.getSecurityGroups();
    }

    @GetMapping("/security-groups/scan")
    public List<SecurityFindingResponseDto> scanSecurityGroups() {
        return securityGroupService.scanSecurityGroups();
    }
}