export interface ScanSummaryDto {
  accountUuid: string;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface SecurityGroupFinding {
  securityGroupId: string;
  securityGroupName: string;
  vpcId: string;
  inboundRuleCount: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
  rule: string;
  issue: string;
}

export interface SecurityGroupFindingsResponse {
  findings: SecurityGroupFinding[];
  nextPageToken: string | null;
}
