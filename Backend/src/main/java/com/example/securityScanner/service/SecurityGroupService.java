package com.example.securityScanner.service;

import com.example.securityScanner.dto.InboundRuleResponseDto;
import com.example.securityScanner.dto.SecurityFindingResponseDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.SecurityGroup;

import java.util.ArrayList;
import java.util.List;

@Service
public class SecurityGroupService {

    private final Ec2Client ec2Client;
    private final RiskAnalyzerService riskAnalyzerService;

    public SecurityGroupService(Ec2Client ec2Client, RiskAnalyzerService riskAnalyzerService) {
        this.ec2Client = ec2Client;
        this.riskAnalyzerService = riskAnalyzerService;
    }
    public List<SecurityGroupResponseDto> getSecurityGroups() {
        return ec2Client.describeSecurityGroups().securityGroups().stream().map(this::mapToResponse).toList();
    }

    public List<SecurityFindingResponseDto> scanSecurityGroups() {
        List<SecurityGroupResponseDto> securityGroups = getSecurityGroups();
        List<SecurityFindingResponseDto> findings = new ArrayList<>();
        for (SecurityGroupResponseDto securityGroup : securityGroups) {
            findings.addAll(riskAnalyzerService.analyze(securityGroup));
        }
        return findings;
    }

    private SecurityGroupResponseDto mapToResponse(SecurityGroup sg) {

        List<InboundRuleResponseDto> inboundRules = sg.ipPermissions().stream().flatMap(
                permission -> permission.ipRanges().stream().map(
                        ipRange -> new InboundRuleResponseDto(permission.ipProtocol(),
                                permission.fromPort(),
                                permission.toPort(),
                                ipRange.cidrIp())))
                .toList();

        return new SecurityGroupResponseDto(sg.groupId(), sg.groupName(), sg.description(), sg.vpcId(), inboundRules);
    }
}