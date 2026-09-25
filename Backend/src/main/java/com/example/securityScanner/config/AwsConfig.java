package com.example.securityScanner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.iam.IamClient;

@Configuration
public class AwsConfig {

    @Bean
    public Ec2Client ec2Client() {
        return Ec2Client.builder().region(Region.AP_SOUTH_1).build();
    }

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder().region(Region.AP_SOUTH_1).build();
    }

    @Bean
    public IamClient iamClient() {
        return IamClient.builder().region(Region.AP_SOUTH_1).build();
    }

    @Bean
    public BedrockRuntimeClient bedrockRuntimeClient() {
        return BedrockRuntimeClient.builder().region(Region.AP_SOUTH_1).build();
    }
}