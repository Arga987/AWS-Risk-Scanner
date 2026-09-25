package com.example.securityScanner.dto;

import java.util.List;

public record RemediationResponseDto(
        String issue,
        List<String> reason,
        List<String> solution
) {}
