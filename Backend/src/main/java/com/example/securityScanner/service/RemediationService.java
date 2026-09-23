package com.example.securityScanner.service;

import com.example.securityScanner.dto.RemediationResponseDto;
import org.springframework.stereotype.Service;

@Service
public class RemediationService {

    public RemediationResponseDto generateRemediation(
            String rule,
            String issue
    ) {
        return new RemediationResponseDto(
                null,
                issue,
                "Temporary reason",
                "Temporary solution"
        );
    }
}
