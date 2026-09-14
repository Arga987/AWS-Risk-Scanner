package com.example.securityScanner.dto;

public record SecurityFindingResponseDto(
        String securityGroupId,
        String securityGroupName,
        String securityGroupDescription,
        String vpcId,
        Integer inboundRuleCount,
        String severity,
        String rule,
        String issue
) {
}