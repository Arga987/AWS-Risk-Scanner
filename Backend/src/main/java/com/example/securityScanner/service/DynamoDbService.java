package com.example.securityScanner.service;

import com.example.securityScanner.dto.AccountDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

import java.util.HashMap;
import java.util.Map;

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
}
