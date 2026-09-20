export interface ScanSummaryDto {
  accountUuid: string;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface Findings {
  securityGroupId: string;
  securityGroupName: string;
  vpcId: string;
  inboundRuleCount: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
  rule: string;
  issue: string;
}
