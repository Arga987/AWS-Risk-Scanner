import type { SecurityGroupFinding } from "@/interfaces/SecurityGroupInterfaces";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

export const severityStyles = {
  HIGH: "text-red-600 dark:text-red-400",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  LOW: "text-green-600 dark:text-green-400",
};

export const getFindingDetailClassNameForMobile = (
  label: string,
  severity: SecurityGroupFinding["severity"]
): string => {
  const baseClass = "mt-1 break-words text-sm";

  switch (label) {
    case "Security Group ID":
      return `${baseClass} font-medium text-green-600 dark:text-green-400`;

    case "VPC ID":
      return `${baseClass} font-medium text-blue-600 dark:text-blue-400`;

    case "Severity":
      return `${baseClass} font-semibold ${
        severity === "HIGH"
          ? "text-red-600 dark:text-red-400"
          : severity === "MEDIUM"
            ? "text-amber-600 dark:text-amber-400"
            : "text-green-600 dark:text-green-400"
      }`;

    default:
      return baseClass;
  }
};

export const getSecurityGroupFindingDetailsForMobile = (
  finding: SecurityGroupFinding
) => [
  {
    label: "Security Group ID",
    value: finding.securityGroupId,
  },
  {
    label: "VPC ID",
    value: finding.vpcId,
  },
  {
    label: "Inbound Rules",
    value: finding.inboundRuleCount,
  },
  {
    label: "Rule",
    value: finding.rule,
  },
  {
    label: "Issue",
    value: finding.issue,
  },
  {
    label: "Severity",
    value: finding.severity,
  },
];

export const getSecurityGroupFindingsColumns = (
  onViewRemediation: (finding: SecurityGroupFinding) => void
): ColumnDef<SecurityGroupFinding>[] => [
  {
    accessorKey: "securityGroupId",
    header: "Security Group ID",
    cell: ({ row }) => (
      <span className="font-medium text-green-600 dark:text-green-400">
        {row.getValue("securityGroupId")}
      </span>
    ),
  },
  {
    accessorKey: "securityGroupName",
    header: "Security Group",
  },
  {
    accessorKey: "vpcId",
    header: "VPC ID",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600 dark:text-blue-400">
        {row.getValue("vpcId")}
      </span>
    ),
  },
  {
    accessorKey: "inboundRuleCount",
    header: "Inbound Rules",
  },
  {
    accessorKey: "rule",
    header: "Rule",
  },
  {
    accessorKey: "issue",
    header: "Issue",
    cell: ({ row }) => (
      <div className="max-w-[300px] whitespace-normal break-words">
        {row.getValue("issue")}
      </div>
    ),
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue(
        "severity"
      ) as SecurityGroupFinding["severity"];

      return (
        <div className={`font-medium ${severityStyles[severity]}`}>
          {severity}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <Button
        size="sm"
        className="cursor-pointer rounded-full border-0 bg-emerald-400 px-6 text-white shadow-mdhover:bg-emerald-500"
        onClick={() => onViewRemediation(row.original)}
      >
        View Remediation
      </Button>
    ),
  },
];
