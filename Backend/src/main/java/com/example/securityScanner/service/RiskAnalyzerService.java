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
        for (InboundRuleResponseDto inboundRule : securityGroup.inboundRules()) {
            if (SecurityRuleUtil.isHighSeverity(inboundRule)) {
                String rule = SecurityRuleUtil.formatRule(inboundRule);
                findings.add(new SecurityFindingResponseDto(
                        securityGroup.groupId(),
                        securityGroup.groupName(),
                        "HIGH",
                        rule,
                        null
                ));
            }
        }

        return findings;
    }
}