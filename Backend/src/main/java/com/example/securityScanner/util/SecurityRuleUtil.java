package com.example.securityScanner.util;

import com.example.securityScanner.dto.InboundRuleResponseDto;
import com.example.securityScanner.dto.SecurityGroupResponseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class SecurityRuleUtil {

    private static final Map<Integer, String> HIGH_RISK_PORTS = Map.ofEntries(
            Map.entry(20, "FTP"),
            Map.entry(21, "FTP"),
            Map.entry(22, "SSH"),
            Map.entry(23, "Telnet"),
            Map.entry(25, "SMTP"),
            Map.entry(110, "POP3"),
            Map.entry(135, "RPC"),
            Map.entry(143, "IMAP"),
            Map.entry(445, "SMB"),
            Map.entry(1433, "Microsoft SQL Server"),
            Map.entry(1434, "Microsoft SQL Server"),
            Map.entry(3000, "application/service"),
            Map.entry(3306, "MySQL"),
            Map.entry(3389, "RDP"),
            Map.entry(4333, "application/service"),
            Map.entry(5000, "application/service"),
            Map.entry(5432, "PostgreSQL"),
            Map.entry(5500, "application/service"),
            Map.entry(5601, "Kibana"),
            Map.entry(6379, "Redis"),
            Map.entry(8080, "application/service"),
            Map.entry(8088, "application/service"),
            Map.entry(8888, "application/service"),
            Map.entry(9200, "Elasticsearch"),
            Map.entry(9300, "Elasticsearch")
    );

    // High severity
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
        for (Integer port : HIGH_RISK_PORTS.keySet()) {
            if (port >= rule.fromPort() && port <= rule.toPort()) {
                return true;
            }
        }
        return false;
    }


    public static String getDescriptionForHighSeverity(InboundRuleResponseDto rule) {
        if ("-1".equals(rule.protocol())) {
            return "All network traffic is publicly accessible from the internet.";
        }
        if (rule.fromPort() == null || rule.toPort() == null) {
            return "A potentially risky rule is publicly accessible from the internet.";
        }
        if (rule.fromPort().equals(rule.toPort())) {
            String service = HIGH_RISK_PORTS.get(rule.fromPort());
            return service + " is publicly accessible from the internet.";
        }

        List<String> exposedServices = HIGH_RISK_PORTS.entrySet()
                .stream()
                .filter(entry ->
                        entry.getKey() >= rule.fromPort()
                                && entry.getKey() <= rule.toPort())
                .map(Map.Entry::getValue)
                .distinct()
                .toList();

        return "This public port range exposes high-risk services including "
                + String.join(", ", exposedServices)
                + ".";
    }

    // Medium Severity

    public static boolean isBroadPrivateRange(String source) {
        return isBroadCidr(source) && !isPrivateIp(source);
    }

    public static boolean isBroadCidr(String source) {
        if (source == null || !source.contains("/")) {
            return false;
        }
        String[] parts = source.split("/");
        int prefixLength = Integer.parseInt(parts[1]);
        return prefixLength == 8 || prefixLength == 16 || prefixLength == 24;
    }
    public static boolean isPrivateIp(String source) {
        if (source == null || !source.contains("/")) {
            return false;
        }
        String ip = source.split("/")[0];

        String[] octets = ip.split("\\.");
        if (octets.length != 4) {
            return false;
        }
        int first = Integer.parseInt(octets[0]);
        int second = Integer.parseInt(octets[1]);
        // 10.0.0.0/8
        if (first == 10) {
            return true;
        }
        // 172.16.0.0/12
        if (first == 172 && second >= 16 && second <= 31) {
            return true;
        }
        // 192.168.0.0/16
        return first == 192 && second == 168;
    }

    public static boolean isMediumSeverity(InboundRuleResponseDto rule) {
        if (isPubliclyAccessible(rule)) {
            return false;
        }
        if (rule.fromPort() == null || rule.toPort() == null) {
            return false;
        }
        boolean containsHighRiskPort = HIGH_RISK_PORTS.keySet()
                .stream()
                .anyMatch(port ->
                        port >= rule.fromPort()
                                && port <= rule.toPort());

        if (!containsHighRiskPort) {
            return false;
        }
        return isBroadPrivateRange(rule.source());
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

    public static String formatRuleWithSource(InboundRuleResponseDto rule) {
        return formatRule(rule) + " → " + rule.source();
    }

    public static String getDescriptionForMediumSeverity(InboundRuleResponseDto rule) {

        if (rule.fromPort() == null || rule.toPort() == null) {
            return "A potentially risky rule is accessible from a broad network range.";
        }
        if (rule.fromPort().equals(rule.toPort())) {
            String service = HIGH_RISK_PORTS.get(rule.fromPort());
            return service + " is accessible from a broad network range.";
        }
        List<String> exposedServices = HIGH_RISK_PORTS.entrySet()
                .stream()
                .filter(entry ->
                        entry.getKey() >= rule.fromPort()
                                && entry.getKey() <= rule.toPort())
                .map(Map.Entry::getValue)
                .distinct()
                .toList();
        return "This broad network range exposes high-risk services including "
                + String.join(", ", exposedServices)
                + ".";
    }

    // Low risk
    public static boolean hasNoInboundRules(SecurityGroupResponseDto securityGroup) {
        return securityGroup.inboundRules().isEmpty();
    }

    public static List<RedundantRule> findRedundantRules(SecurityGroupResponseDto securityGroup) {
        List<InboundRuleResponseDto> rules = securityGroup.inboundRules();
        List<RedundantRule> redundantRules = new ArrayList<>();
        for (int i = 0; i < rules.size(); i++) {
            InboundRuleResponseDto rule = rules.get(i);
            if (!isIpv4Cidr(rule.source())) {
                continue;
            }
            RedundantRule bestMatch = null;
            for (int j = 0; j < rules.size(); j++) {
                if (i == j) {
                    continue;
                }
                InboundRuleResponseDto otherRule = rules.get(j);
                if (!isSameProtocolAndPortRange(rule, otherRule)) {
                    continue;
                }
                if (!isIpv4Cidr(otherRule.source())) {
                    continue;
                }
                if (isCidrContained(rule.source(), otherRule.source())) {
                    if (bestMatch == null || isCidrContained(otherRule.source(), bestMatch.coveringRule().source())) {
                        bestMatch = new RedundantRule(rule, otherRule);
                    }
                }
            }
            if (bestMatch != null) {
                redundantRules.add(bestMatch);
            }
        }
        return redundantRules;
    }

    private static boolean isSameProtocolAndPortRange(InboundRuleResponseDto first, InboundRuleResponseDto second) {
        return first.protocol().equals(second.protocol()) && hasSamePortRange(first, second);
    }

    private static boolean hasSamePortRange(InboundRuleResponseDto first, InboundRuleResponseDto second) {
        return Objects.equals(first.fromPort(), second.fromPort()) && Objects.equals(first.toPort(), second.toPort());
    }

    private static boolean isIpv4Cidr(String cidr) {
        if (cidr == null || !cidr.contains("/")) {
            return false;
        }
        String[] parts = cidr.split("/");
        if (parts.length != 2) {
            return false;
        }
        String[] octets = parts[0].split("\\.");
        if (octets.length != 4) {
            return false;
        }
        try {
            int prefixLength = Integer.parseInt(parts[1]);
            if (prefixLength < 0 || prefixLength > 32) {
                return false;
            }
            for (String octet : octets) {
                int value = Integer.parseInt(octet);
                if (value < 0 || value > 255) {
                    return false;
                }
            }
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private static boolean isCidrContained(String smallerCidr, String largerCidr) {
        String[] smallerParts = smallerCidr.split("/");
        String[] largerParts = largerCidr.split("/");
        int smallerPrefix = Integer.parseInt(smallerParts[1]);
        int largerPrefix = Integer.parseInt(largerParts[1]);
        if (smallerPrefix <= largerPrefix) {
            return false;
        }
        long smallerNetwork = ipv4ToLong(smallerParts[0]);
        long largerNetwork = ipv4ToLong(largerParts[0]);
        long mask = createMask(largerPrefix);
        return (smallerNetwork & mask) == (largerNetwork & mask);
    }

    private static long ipv4ToLong(String ip) {
        String[] octets = ip.split("\\.");
        long result = 0;
        for (String octet : octets) {
            result = (result << 8) + Integer.parseInt(octet);
        }
        return result;
    }

    private static long createMask(int prefixLength) {
        if (prefixLength == 0) {
            return 0;
        }
        return (0xFFFFFFFFL << (32 - prefixLength)) & 0xFFFFFFFFL;
    }

    public record RedundantRule(InboundRuleResponseDto redundantRule, InboundRuleResponseDto coveringRule) {
    }

}