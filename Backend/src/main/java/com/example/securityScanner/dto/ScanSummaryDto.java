package com.example.securityScanner.dto;

public record ScanSummaryDto(
        String accountUuid,
        int highCount,
        int mediumCount,
        int lowCount
) {}
