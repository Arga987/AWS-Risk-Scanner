package com.example.securityScanner.service;

import com.example.securityScanner.model.SecurityGroupResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ec2.Ec2Client;

import java.util.List;

@Service
public class SecurityGroupService {

    private final Ec2Client ec2Client;

    public SecurityGroupService(Ec2Client ec2Client) {
        this.ec2Client = ec2Client;
    }

    public List<SecurityGroupResponse> getSecurityGroups() {

        return ec2Client.describeSecurityGroups().securityGroups().stream().map(sg -> new SecurityGroupResponse(sg.groupId(), sg.groupName(), sg.description(), sg.vpcId())).toList();
    }
}