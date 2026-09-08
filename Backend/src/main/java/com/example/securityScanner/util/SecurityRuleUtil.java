package com.example.securityScanner.util;

import com.example.securityScanner.dto.InboundRuleResponseDto;

public class SecurityRuleUtil {

    public static boolean isPubliclyAccessible(InboundRuleResponseDto rule) {
        return "0.0.0.0/0".equals(rule.source());
    }

    public static boolean isCriticalPort(InboundRuleResponseDto rule) {
        return rule.fromPort() != null && (rule.fromPort() == 22 || rule.fromPort() == 3389);
    }

    public static String getDescription(InboundRuleResponseDto rule) {

        if (rule.fromPort() == 22) {
            return "SSH is publicly accessible from 0.0.0.0/0";
        }

        if (rule.fromPort() == 3389) {
            return "RDP is publicly accessible from 0.0.0.0/0";
        }

        return "Critical port is publicly accessible from 0.0.0.0/0";
    }
}