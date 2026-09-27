import type { ScanHistory } from "@/interfaces/SecurityGroupInterfaces";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

export const getHistoryColumns = (
  onViewFindings: (accountUuid: string) => void
): ColumnDef<ScanHistory>[] => [
  {
    accessorKey: "accountName",
    header: "Account Name",
    cell: ({ row }) => {
      const accountName = row.original.accountName;

      return accountName.charAt(0).toUpperCase() + accountName.slice(1);
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => {
      const date = new Date(row.original.dateCreated);

      return date
        .toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace("am", "AM")
        .replace("pm", "PM");
    },
  },
  {
    accessorKey: "highCount",
    header: "HIGH",
    cell: ({ row }) => (
      <span className="rounded-md bg-red-50 px-3 py-1 text-red-700">
        {row.original.highCount}
      </span>
    ),
  },
  {
    accessorKey: "mediumCount",
    header: "MEDIUM",
    cell: ({ row }) => (
      <span className="rounded-md bg-yellow-50 px-3 py-1 text-yellow-700">
        {row.original.mediumCount}
      </span>
    ),
  },
  {
    accessorKey: "lowCount",
    header: "LOW",
    cell: ({ row }) => (
      <span className="rounded-md bg-green-50 px-3 py-1 text-green-700">
        {row.original.lowCount}
      </span>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewFindings(row.original.accountUuid)}
        className="cursor-pointer rounded-full border-0 bg-emerald-400 px-6 text-white shadow-md hover:bg-emerald-400"
      >
        View Findings
      </Button>
    ),
  },
];
