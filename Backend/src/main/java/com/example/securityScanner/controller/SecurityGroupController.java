package com.example.securityScanner.controller;

import com.example.securityScanner.dto.RemediationResponseDto;
import com.example.securityScanner.dto.ScanFindingsResponseDto;
import com.example.securityScanner.dto.ScanSummaryDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;
import com.example.securityScanner.service.AccountInformationService;
import com.example.securityScanner.service.DynamoDbService;
import com.example.securityScanner.service.ScanService;
import com.example.securityScanner.service.SecurityGroupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SecurityGroupController {

    private final SecurityGroupService securityGroupService;

    private final AccountInformationService accountInformationService;
    private final DynamoDbService dynamoDbService;
    private final ScanService scanService;

    public SecurityGroupController(SecurityGroupService securityGroupService, AccountInformationService accountInformationService, DynamoDbService dynamoDbService, ScanService scanService) {
        this.securityGroupService = securityGroupService;
        this.accountInformationService = accountInformationService;
        this.dynamoDbService = dynamoDbService;
        this.scanService = scanService;
    }

    @Deprecated
    @GetMapping("/security-groups")
    public List<SecurityGroupResponseDto> getSecurityGroups() {
        return securityGroupService.getSecurityGroups();
    }

//    @Deprecated
//    @GetMapping("/security-groups/scan")
//    public List<SecurityFindingResponseDto> scanSecurityGroups() {
//        return securityGroupService.scanSecurityGroups();
//    }

    @PostMapping("/security-groups/scan")
    public ScanSummaryDto scanSecurityGroups() {
        return scanService.startScan();
    }

    @GetMapping("/accounts/security-groups")
    public ScanFindingsResponseDto getSecurityGroups(
            @RequestParam String accountUuid,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String searchString,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String pageToken
    ) {
        return dynamoDbService.getSecurityGroups(accountUuid, severity, searchString, pageSize, pageToken);
    }

    @GetMapping("/accounts/security-groups/remediation")
    public RemediationResponseDto getRemediation(
            @RequestParam String accountUuid,
            @RequestParam String sgUuid
    ) {
        return dynamoDbService.getRemediation(accountUuid, sgUuid);
    }
}