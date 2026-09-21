package com.example.securityScanner.dto;

import java.util.List;

public record ScanFindingsResponseDto(
        List<SecurityFindingResponseDto> findings,
        String nextPageToken
) {}
