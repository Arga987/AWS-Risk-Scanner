package com.example.securityScanner.service;

import com.example.securityScanner.dto.InboundRuleResponseDto;
import com.example.securityScanner.dto.SecurityFindingResponseDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;
import com.example.securityScanner.util.SecurityRuleUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RiskAnalyzerService {

    public List<SecurityFindingResponseDto> analyze(SecurityGroupResponseDto securityGroup) {

        List<SecurityFindingResponseDto> findings = new ArrayList<>();

        for (InboundRuleResponseDto rule : securityGroup.inboundRules()) {

            if (SecurityRuleUtil.isPubliclyAccessible(rule) && SecurityRuleUtil.isCriticalPort(rule)) {
                findings.add(new SecurityFindingResponseDto(
                        securityGroup.groupId(),
                        securityGroup.groupName(),
                        "HIGH",
                        rule.protocol().toUpperCase() + " " + rule.fromPort(),
                        SecurityRuleUtil.getDescription(rule)));
            }
        }

        return findings;
    }
}