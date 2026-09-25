package com.example.securityScanner.service;

import com.example.securityScanner.dto.RemediationResponseDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.*;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class RemediationService {

    private final BedrockRuntimeClient bedrockRuntimeClient;
    private final ObjectMapper objectMapper;

    public RemediationService(
            BedrockRuntimeClient bedrockRuntimeClient, ObjectMapper objectMapper
    ) {
        this.bedrockRuntimeClient = bedrockRuntimeClient;
        this.objectMapper = objectMapper;
    }

    public RemediationResponseDto generateRemediation(String rule, String issue) {
        try {
            String prompt = """
                You are an AWS cloud security expert.

                Analyze the following security finding.

                Rule:
                %s

                Issue:
                %s

                Explain:
                 1. Why this is a security issue.
                 2. How to fix it.

                 For both "reason" and "solution":
                 - Return the explanation as concise bullet points.
                 - Each bullet should be on a new line.
                 - Each bullet should be a separate item in the JSON array.
                 - Keep each bullet concise and specific to the provided rule and issue.

                Return only valid JSON.
                Do not use Markdown.
                Do not wrap the JSON in ``` or ```json.
                Do not include any text before or after the JSON.
                
                Use exactly this structure:
                {
                   "reason": [
                     "...",
                     "..."
                   ],
                   "solution": [
                     "...",
                     "..."
                   ]
                }
                Base your response only on the provided rule and issue.
                Do not assume additional infrastructure or configuration.
                """.formatted(rule, issue);

            Message message = Message.builder().role(ConversationRole.USER).content(ContentBlock.builder().text(prompt).build()).build();
            ConverseRequest request = ConverseRequest.builder().modelId("global.amazon.nova-2-lite-v1:0").messages(List.of(message)).build();
            ConverseResponse response = bedrockRuntimeClient.converse(request);
            String responseText = response.output().message().content().get(0).text();
            String cleanedResponse = cleanJsonResponse(responseText);
            AiRemediationResponse aiResponse = objectMapper.readValue(cleanedResponse, AiRemediationResponse.class);
            return new RemediationResponseDto(issue, aiResponse.reason(), aiResponse.solution());
        } catch(Exception e) {
            throw new RuntimeException("Failed to generate remediation", e);
        }
    }

    private record AiRemediationResponse(
            List<String> reason,
            List<String> solution
    ) {}

    private String cleanJsonResponse(String responseText) {
        String cleaned = responseText.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
