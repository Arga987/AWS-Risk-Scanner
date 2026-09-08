package com.example.securityScanner.dto;

public record InboundRuleResponseDto(
        String protocol,
        Integer fromPort,
        Integer toPort,
        String source
) {
}