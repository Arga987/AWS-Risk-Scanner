package com.example.securityScanner.dto;

public record AccountDto(
        String accountUuid,
        String entityKey,
        String accountName,
        String dateCreated,
        Integer highCount,
        Integer mediumCount,
        Integer lowCount
) {}
