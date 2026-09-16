package com.example.securityScanner.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.iam.IamClient;

@Service
public class AccountInformationService {

    private final IamClient iamClient;

    public AccountInformationService(IamClient iamClient) {
        this.iamClient = iamClient;
    }

    public String getAccountName() {
        return iamClient.listAccountAliases().accountAliases().getFirst();
    }
}
