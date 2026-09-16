package com.example.securityScanner.service;

import com.example.securityScanner.dto.AccountDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import com.example.securityScanner.util.SecurityRuleUtil.*;

@Service
public class ScanService {
    private final AccountInformationService accountInformationService;
    private final DynamoDbService dynamoDbService;
    private final SecurityGroupService securityGroupService;

    public ScanService(AccountInformationService accountInformationService, DynamoDbService dynamoDbService, SecurityGroupService securityGroupService) {
        this.accountInformationService = accountInformationService;
        this.dynamoDbService = dynamoDbService;
        this.securityGroupService = securityGroupService;
    }

    public String startScan() {
        String accountUuid = UUID.randomUUID().toString();
        String accountName = accountInformationService.getAccountName();
        AccountDto accountDto = new AccountDto(accountUuid, "ACCOUNT", accountName, Instant.now().toString(), 0, 0, 0);
        dynamoDbService.saveAccount(accountDto);
        ScanResult scanResult = securityGroupService.scanSecurityGroups();
        dynamoDbService.updateAccountCounts(accountUuid, scanResult.highCount(), scanResult.mediumCount(), scanResult.lowCount());
        return accountUuid;
    }
}
