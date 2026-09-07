package com.example.securityScanner.model;

public record SecurityGroupResponse(
        String groupId,
        String groupName,
        String description,
        String vpcId
) {
}