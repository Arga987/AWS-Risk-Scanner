package com.example.securityScanner.dto;

public record RemediationResponseDto(
        String sgUuid,
        String issue,
        String reason,
        String solution
) {}
