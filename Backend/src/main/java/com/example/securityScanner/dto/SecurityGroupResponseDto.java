package com.example.securityScanner.dto;

import java.util.List;

public record SecurityGroupResponseDto(
        String groupId,
        String groupName,
        String description,
        String vpcId,
        List<InboundRuleResponseDto> inboundRules
) {
}