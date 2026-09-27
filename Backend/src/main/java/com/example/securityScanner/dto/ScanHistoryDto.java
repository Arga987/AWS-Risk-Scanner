package com.example.securityScanner.dto;

public record ScanHistoryDto(
        String accountUuid,
        String dateCreated,
        String accountName,
        Integer highCount,
        Integer mediumCount,
        Integer lowCount
) {}
