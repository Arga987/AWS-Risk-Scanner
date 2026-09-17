package com.example.securityScanner.service;

import com.example.securityScanner.dto.AccountDto;
import com.example.securityScanner.dto.SecurityFindingResponseDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class DynamoDbService {
    private final DynamoDbClient dynamoDbClient;

    public DynamoDbService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
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
        item.put("securityGroupName", AttributeValue.builder().s(finding.securityGroupName()).build());
        item.put("securityGroupDescription", AttributeValue.builder().s(finding.securityGroupDescription()).build());
        item.put("vpcId", AttributeValue.builder().s(finding.vpcId()).build());
        item.put("inboundRuleCount", AttributeValue.builder().n(String.valueOf(finding.inboundRuleCount())).build());
        item.put("severity", AttributeValue.builder().s(finding.severity()).build());
        item.put("rule", AttributeValue.builder().s(finding.rule()).build());
        item.put("issue", AttributeValue.builder().s(finding.issue()).build());

        PutItemRequest request = PutItemRequest.builder().tableName("security-scanner").item(item).build();

        dynamoDbClient.putItem(request);
    }

    public List<SecurityFindingResponseDto> getSecurityGroups(String accountUuid, String severity) {

        Map<String, AttributeValue> values = new HashMap<>();
        values.put(":accountUuid", AttributeValue.builder().s(accountUuid).build());
        values.put(":prefix", AttributeValue.builder().s("SG#").build());
        QueryRequest.Builder requestBuilder = QueryRequest.builder()
                .tableName("security-scanner")
                .keyConditionExpression(
                        "accountUuid = :accountUuid AND begins_with(entityKey, :prefix)"
                );
        if (severity != null) {
            values.put(":severity", AttributeValue.builder().s(severity).build());
            requestBuilder.filterExpression("severity = :severity");
        }
        requestBuilder.expressionAttributeValues(values);
        QueryResponse response = dynamoDbClient.query(requestBuilder.build());
        return response.items().stream().map(this::mapToSecurityFinding).toList();
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
                item.get("issue").s()
        );
    }

}
