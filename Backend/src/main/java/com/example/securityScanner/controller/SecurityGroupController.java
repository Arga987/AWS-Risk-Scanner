package com.example.securityScanner.controller;

import com.example.securityScanner.model.SecurityGroupResponse;
import com.example.securityScanner.service.SecurityGroupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.ec2.model.SecurityGroup;

import java.util.List;

@RestController
public class SecurityGroupController {

    private final SecurityGroupService securityGroupService;

    public SecurityGroupController(SecurityGroupService securityGroupService) {
        this.securityGroupService = securityGroupService;
    }

    @GetMapping("/security-groups")
    public List<SecurityGroupResponse> getSecurityGroups() {
        return securityGroupService.getSecurityGroups();
    }
}