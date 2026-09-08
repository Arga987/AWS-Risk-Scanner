package com.example.securityScanner.dto;

public record SecurityFindingResponseDto(
        String securityGroupId,
        String securityGroupName,
        String severity,
        String rule,
        String description
) {
}