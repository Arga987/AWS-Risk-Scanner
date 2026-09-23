package com.example.securityScanner.service;

import com.example.securityScanner.dto.AccountDto;
import com.example.securityScanner.dto.RemediationResponseDto;
import com.example.securityScanner.dto.ScanFindingsResponseDto;
import com.example.securityScanner.dto.SecurityFindingResponseDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class DynamoDbService {
    private final DynamoDbClient dynamoDbClient;
    private final RemediationService remediationService;

    public DynamoDbService(DynamoDbClient dynamoDbClient, RemediationService remediationService) {
        this.dynamoDbClient = dynamoDbClient;
        this.remediationService = remediationService;
    }

    public void saveAccount(AccountDto accountDto) {

        Map<String, AttributeValue> item = new HashMap<>();

        item.put("accountUuid", AttributeValue.builder().s(accountDto.accountUuid()).build());
        item.put("entityKey", AttributeValue.builder().s(accountDto.entityKey()).build());
        item.put("accountName", AttributeValue.builder().s(accountDto.accountName()).build());
        item.put("dateCreated", AttributeValue.builder().s(accountDto.dateCreated()).build());
        item.put("highCount", AttributeValue.builder().n(String.valueOf(accountDto.highCount())).build());
        item.put("mediumCount", AttributeValue.builder().n(String.valueOf(accountDto.mediumCount())).build());
        item.put("lowCount", AttributeValue.builder().n(String.valueOf(accountDto.lowCount())).build());

        PutItemRequest request = PutItemRequest.builder().tableName("security-scanner").item(item).build();
        dynamoDbClient.putItem(request);
    }

    public void updateAccountCounts(String accountUuid, int highCount, int mediumCount, int lowCount) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("accountUuid", AttributeValue.builder().s(accountUuid).build());
        key.put("entityKey", AttributeValue.builder().s("ACCOUNT").build());
        Map<String, AttributeValue> values = new HashMap<>();
        values.put(":high", AttributeValue.builder().n(String.valueOf(highCount)).build());
        values.put(":medium", AttributeValue.builder().n(String.valueOf(mediumCount)).build());
        values.put(":low", AttributeValue.builder().n(String.valueOf(lowCount)).build());

        UpdateItemRequest request = UpdateItemRequest.builder().tableName("security-scanner").key(key)
                .updateExpression("SET highCount = :high, mediumCount = :medium, lowCount = :low")
                .expressionAttributeValues(values).build();
        dynamoDbClient.updateItem(request);
    }

    public void saveSecurityGroup(String accountUuid, SecurityFindingResponseDto finding) {
        String entityKey = "SG#" + UUID.randomUUID();
        Map<String, AttributeValue> item = new HashMap<>();

        item.put("accountUuid", AttributeValue.builder().s(accountUuid).build());
        item.put("entityKey", AttributeValue.builder().s(entityKey).build());
        item.put("securityGroupId", AttributeValue.builder().s(finding.securityGroupId()).build());
        item.put("securityGroupName", AttributeValue.builder().s(finding.securityGroupName().toLowerCase(Locale.ROOT)).build());
        item.put("securityGroupDescription", AttributeValue.builder().s(finding.securityGroupDescription()).build());
        item.put("vpcId", AttributeValue.builder().s(finding.vpcId()).build());
        item.put("inboundRuleCount", AttributeValue.builder().n(String.valueOf(finding.inboundRuleCount())).build());
        item.put("severity", AttributeValue.builder().s(finding.severity()).build());
        item.put("rule", AttributeValue.builder().s(finding.rule()).build());
        item.put("issue", AttributeValue.builder().s(finding.issue()).build());

        PutItemRequest request = PutItemRequest.builder().tableName("security-scanner").item(item).build();

        dynamoDbClient.putItem(request);
    }

    public ScanFindingsResponseDto getSecurityGroups(String accountUuid, String severity, String searchString, Integer pageSize, String pageToken) {

        Map<String, AttributeValue> values = new HashMap<>();
        List<SecurityFindingResponseDto> findings = new ArrayList<>();
        Map<String, AttributeValue> exclusiveStartKey = null;
        Map<String, AttributeValue> lastEvaluatedKey;
        values.put(":accountUuid", AttributeValue.builder().s(accountUuid).build());
        values.put(":prefix", AttributeValue.builder().s("SG#").build());
        List<String> filters = new ArrayList<>();
        if (severity != null && !severity.isBlank()) {
            values.put(":severity", AttributeValue.builder().s(severity).build());
            filters.add("severity = :severity");
        }

        if (searchString != null && !searchString.isBlank()) {
            String normalizedSearchString = searchString.toLowerCase();
            values.put(":searchString", AttributeValue.builder().s(normalizedSearchString).build());
            filters.add("(contains(securityGroupId, :searchString) " + "OR contains(securityGroupName, :searchString))");
        }

        if (pageToken != null && !pageToken.isBlank()) {
            exclusiveStartKey = decodePageToken(pageToken);
        }

        do {
            QueryRequest.Builder requestBuilder = QueryRequest.builder().tableName("security-scanner").keyConditionExpression("accountUuid = :accountUuid AND begins_with(entityKey, :prefix)").limit(pageSize - findings.size()).expressionAttributeValues(values);
            if (!filters.isEmpty()) {
                requestBuilder.filterExpression(String.join(" AND ", filters));
            }
            if (exclusiveStartKey != null) {
                requestBuilder.exclusiveStartKey(exclusiveStartKey);
            }
            QueryResponse response = dynamoDbClient.query(requestBuilder.build());
            findings.addAll(response.items().stream().map(this::mapToSecurityFinding).toList());
            lastEvaluatedKey = response.lastEvaluatedKey();
            exclusiveStartKey = lastEvaluatedKey;
        } while (findings.size() < pageSize && lastEvaluatedKey != null && !lastEvaluatedKey.isEmpty());
        String nextPageToken = null;
        if (lastEvaluatedKey != null && !lastEvaluatedKey.isEmpty()) {
            if (hasNextPage(lastEvaluatedKey, values, filters)) {
                nextPageToken = encodePageToken(lastEvaluatedKey);
            }
        }
        return new ScanFindingsResponseDto(findings.subList(0, Math.min(findings.size(), pageSize)), nextPageToken);
    }

    public RemediationResponseDto getRemediation(String accountUuid, String sgUuid) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("accountUuid", AttributeValue.builder().s(accountUuid).build());
        key.put("entityKey", AttributeValue.builder().s(sgUuid).build());
        GetItemRequest request = GetItemRequest.builder().tableName("security-scanner").key(key).build();
        GetItemResponse response = dynamoDbClient.getItem(request);
        Map<String, AttributeValue> item = response.item();
        String rule = item.get("rule").s();
        String issue = item.get("issue").s();
        String reason = item.containsKey("reason") ? item.get("reason").s() : null;
        String solution = item.containsKey("solution") ? item.get("solution").s() : null;
        if (reason != null && solution != null) {
            return new RemediationResponseDto(sgUuid, issue, reason, solution);
        }
        RemediationResponseDto remediation = remediationService.generateRemediation(rule, issue);
        Map<String, AttributeValue> values = new HashMap<>();
        reason = remediation.reason();
        solution = remediation.solution();
        values.put(":reason", AttributeValue.builder().s(remediation.reason()).build());
        values.put(":solution", AttributeValue.builder().s(remediation.solution()).build());
        UpdateItemRequest updateRequest = UpdateItemRequest.builder().tableName("security-scanner").key(key).updateExpression("SET reason = :reason, solution = :solution").expressionAttributeValues(values).build();
        dynamoDbClient.updateItem(updateRequest);
        return new RemediationResponseDto(sgUuid, issue, reason, solution);
    }

    private SecurityFindingResponseDto mapToSecurityFinding(Map<String, AttributeValue> item) {

        return new SecurityFindingResponseDto(
                item.get("securityGroupId").s(),
                item.get("securityGroupName").s(),
                item.get("securityGroupDescription").s(),
                item.get("vpcId").s(),
                Integer.parseInt(item.get("inboundRuleCount").n()),
                item.get("severity").s(),
                item.get("rule").s(),
                item.get("issue").s(),
                item.get("entityKey").s()
        );
    }

    private String encodePageToken(Map<String, AttributeValue> lastEvaluatedKey) {
        String accountUuid = lastEvaluatedKey.get("accountUuid").s();
        String entityKey = lastEvaluatedKey.get("entityKey").s();
        String token = accountUuid + "|" + entityKey;
        return Base64.getEncoder().encodeToString(token.getBytes(StandardCharsets.UTF_8));
    }

    private Map<String, AttributeValue> decodePageToken(String pageToken) {
        String decodedToken = new String(Base64.getDecoder().decode(pageToken), StandardCharsets.UTF_8);
        String[] parts = decodedToken.split("\\|", 2);
        Map<String, AttributeValue> exclusiveStartKey = new HashMap<>();
        exclusiveStartKey.put("accountUuid", AttributeValue.builder().s(parts[0]).build());
        exclusiveStartKey.put("entityKey", AttributeValue.builder().s(parts[1]).build());
        return exclusiveStartKey;
    }

    private boolean hasNextPage(Map<String, AttributeValue> lastEvaluatedKey, Map<String, AttributeValue> values, List<String> filters) {

        Map<String, AttributeValue> exclusiveStartKey = lastEvaluatedKey;
        do {
            QueryRequest.Builder requestBuilder = QueryRequest.builder()
                    .tableName("security-scanner")
                    .keyConditionExpression(
                            "accountUuid = :accountUuid AND begins_with(entityKey, :prefix)")
                    .expressionAttributeValues(values).exclusiveStartKey(exclusiveStartKey).limit(1);
            if (!filters.isEmpty()) {
                requestBuilder.filterExpression(String.join(" AND ", filters));
            }
            QueryResponse response = dynamoDbClient.query(requestBuilder.build());
            if (!response.items().isEmpty()) {
                return true;
            }
            if (!response.hasLastEvaluatedKey()) {
                return false;
            }
            exclusiveStartKey = response.lastEvaluatedKey();
        } while (true);
    }

}
