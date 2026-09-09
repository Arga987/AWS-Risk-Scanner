package com.example.securityScanner.util;

import com.example.securityScanner.dto.InboundRuleResponseDto;

import java.util.Set;

public class SecurityRuleUtil {

    private static final Set<Integer> HIGH_RISK_PORTS = Set.of(20, 21, 22, 23, 25, 110, 135, 143, 445, 1433, 1434, 3000, 3306, 3389, 4333, 5000, 5432, 5500, 5601, 6379, 8080, 8088, 8888, 9200, 9300);

    public static boolean isPubliclyAccessible(InboundRuleResponseDto rule) {
        return "0.0.0.0/0".equals(rule.source()) || "::/0".equals(rule.source());
    }

    public static boolean isHighSeverity(InboundRuleResponseDto rule) {
        if (!isPubliclyAccessible(rule)) {
            return false;
        }
        if ("-1".equals(rule.protocol())) {
            return true;
        }
        if (rule.fromPort() == null || rule.toPort() == null) {
            return false;
        }
        for (Integer port : HIGH_RISK_PORTS) {
            if (port >= rule.fromPort() && port <= rule.toPort()) {
                return true;
            }
        }
        return false;
    }

    public static String formatRule(InboundRuleResponseDto rule) {
        if ("-1".equals(rule.protocol())) {
            return "ALL TRAFFIC";
        }
        if (rule.fromPort().equals(rule.toPort())) {
            return rule.protocol().toUpperCase() + " " + rule.fromPort();
        }
        return rule.protocol().toUpperCase() + " " + rule.fromPort() + "-" + rule.toPort();
    }
}