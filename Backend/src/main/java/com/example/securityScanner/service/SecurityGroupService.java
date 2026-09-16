package com.example.securityScanner.service;

import com.example.securityScanner.dto.InboundRuleResponseDto;
import com.example.securityScanner.dto.SecurityFindingResponseDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.SecurityGroup;

import java.util.ArrayList;
import java.util.List;
import com.example.securityScanner.util.SecurityRuleUtil.*;

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

    public ScanResult scanSecurityGroups(){
        int highCount = 0;int mediumCount = 0;int lowCount = 0;
        List<SecurityGroupResponseDto> securityGroups = getSecurityGroups();
        List<SecurityFindingResponseDto> findings = new ArrayList<>();
        for (SecurityGroupResponseDto securityGroup : securityGroups) {
            List<SecurityFindingResponseDto> securityGroupFindings = riskAnalyzerService.analyze(securityGroup);
            findings.addAll(securityGroupFindings);
            for (SecurityFindingResponseDto finding : securityGroupFindings) {
                switch (finding.severity()) {
                    case "HIGH" -> highCount++;
                    case "MEDIUM" -> mediumCount++;
                    case "LOW" -> lowCount++;
                }
            }
        }
        return new ScanResult(findings, highCount, mediumCount, lowCount);
    }

    private SecurityGroupResponseDto mapToResponse(SecurityGroup sg) {
        List<InboundRuleResponseDto> inboundRules = sg.ipPermissions()
                .stream()
                .flatMap(permission -> java.util.stream.Stream.concat(permission.ipRanges().stream() //ipv4
                                        .map(ipRange -> new InboundRuleResponseDto(
                                                permission.ipProtocol(),
                                                permission.fromPort(),
                                                permission.toPort(),
                                                ipRange.cidrIp()
                                        )),
                                permission.ipv6Ranges().stream() //ipv6
                                        .map(ipv6Range -> new InboundRuleResponseDto(
                                                permission.ipProtocol(),
                                                permission.fromPort(),
                                                permission.toPort(),
                                                ipv6Range.cidrIpv6()
                                        ))
                        )
                )
                .toList();

        return new SecurityGroupResponseDto(sg.groupId(), sg.groupName(), sg.description(), sg.vpcId(), inboundRules);
    }
}