import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import api from "@/API";
import type { Findings } from "@/interfaces/SecurityGroupInterfaces";
import { SecurityGroupFindingsColumns } from "@/components/SecurityGroupFindings/SecurityGroupFindingsUtils";

type Props = {
  accountUuid: string;
};

const SecurityGroupFindings = (props: Props) => {
  const { accountUuid } = props;
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [data, setData] = useState<Findings[]>([]);

  const table = useReactTable({
    data,
    columns: SecurityGroupFindingsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (value: string) => {
    setSearch(value);

    // Later:
    // Send search value to backend
  };

  const handleSeverityChange = (value: string) => {
    setSeverity(value);

    // Later:
    // Send severity value to backend
  };

  const fetchFindings = async () => {
    try {
      const response = await axios.get<Findings[]>(
        api.SECURITY_GROUP.FINDINGS,
        {
          params: {
            accountUuid,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch findings:", error);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, [accountUuid]);

  return (
    <div className="px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Security Findings</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Detailed security findings identified during the scan.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mt-8 flex items-center gap-3">
        <Input
          placeholder="Search findings..."
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm cursor-text caret-black"
        />

        <Select value={severity} onValueChange={handleSeverityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Severities</SelectItem>

            <SelectItem value="HIGH">High</SelectItem>

            <SelectItem value="MEDIUM">Medium</SelectItem>

            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Total Findings */}
      <div className="mt-4 text-sm text-muted-foreground">
        Total Findings: {data.length}
      </div>

      {/* Table */}
      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-100 text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={SecurityGroupFindingsColumns.length}
                  className="h-24 text-center"
                >
                  No findings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page 1</p>

        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            Previous
          </button>

          <button className="rounded-md border px-3 py-2 text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SecurityGroupFindings;
