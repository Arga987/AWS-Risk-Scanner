import type { Findings } from "@/interfaces/SecurityGroupInterfaces";
import type { ColumnDef } from "@tanstack/react-table";

export const SecurityGroupFindingsColumns: ColumnDef<Findings>[] = [
  {
    accessorKey: "securityGroupId",
    header: "Security Group ID",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
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
      <span className="font-medium text-blue-600">{row.getValue("vpcId")}</span>
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
      const severity = row.getValue("severity") as Findings["severity"];

      const severityStyles = {
        HIGH: "bg-red-50 text-red-700",
        MEDIUM: "bg-yellow-50 text-yellow-700",
        LOW: "bg-green-50 text-green-700",
      };

      return (
        <div className={`font-medium ${severityStyles[severity]}`}>
          {severity}
        </div>
      );
    },
  },
];
