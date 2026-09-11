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
        if (SecurityRuleUtil.hasNoInboundRules(securityGroup)) {
            findings.add(new SecurityFindingResponseDto(
                    securityGroup.groupId(),
                    securityGroup.groupName(),
                    "LOW",
                    "NO INBOUND RULES",
                    "This Security Group has no inbound rules and may be unused or unnecessary."
            ));
        }
        List<SecurityRuleUtil.RedundantRule> redundantRules = SecurityRuleUtil.findRedundantRules(securityGroup);
        for (SecurityRuleUtil.RedundantRule redundantRule : redundantRules) {
            InboundRuleResponseDto rule = redundantRule.redundantRule();
            InboundRuleResponseDto coveringRule = redundantRule.coveringRule();
            findings.add(new SecurityFindingResponseDto(
                    securityGroup.groupId(),
                    securityGroup.groupName(),
                    "LOW",
                    SecurityRuleUtil.formatRuleWithSource(rule),
                    "This inbound rule is redundant because it is already covered by "
                            + SecurityRuleUtil.formatRuleWithSource(coveringRule)
                            + "."
            ));
        }
        for (InboundRuleResponseDto inboundRule : securityGroup.inboundRules()) {
            if (SecurityRuleUtil.isHighSeverity(inboundRule)) {
                String rule = SecurityRuleUtil.formatRule(inboundRule);
                findings.add(new SecurityFindingResponseDto(
                        securityGroup.groupId(),
                        securityGroup.groupName(),
                        "HIGH",
                        rule,
                        SecurityRuleUtil.getDescriptionForHighSeverity(inboundRule)
                ));
            }  else if (SecurityRuleUtil.isMediumSeverity(inboundRule)) {
                String rule = SecurityRuleUtil.formatRule(inboundRule);
                findings.add(new SecurityFindingResponseDto(
                        securityGroup.groupId(),
                        securityGroup.groupName(),
                        "MEDIUM",
                        rule,
                        SecurityRuleUtil.getDescriptionForMediumSeverity(inboundRule)
                ));
            }
        }
        return findings;
    }
}