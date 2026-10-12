import api from "@/API";
import type { ScanHistory } from "@/interfaces/SecurityGroupInterfaces";
import axiosInstance from "@/util/axiosInstance";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getHistoryColumns } from "./SecurityGroupHistoryUtils";
import ErrorMessage from "@/util/ErrorMessage";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, formattedDate } from "@/util/CommonUtil";

type Props = {
  onViewFindings: (accountUuid: string) => void;
};

const SecurityGroupHistory = (props: Props) => {
  const { onViewFindings } = props;
  const [data, setData] = useState<ScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get<ScanHistory[]>(
        api.SECURITY_GROUP.HISTORY
      );

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = getHistoryColumns(onViewFindings);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6">
      {/* Mobile: Card layout */}
      <div className="space-y-4 md:hidden">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center gap-2 rounded-md border border-slate-200 dark:border-white/10">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading history...
          </div>
        ) : errorMessage ? (
          <div className="flex justify-center">
            <ErrorMessage message={errorMessage} />
          </div>
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const history = row.original;
            const date = new Date(history.dateCreated);

            const formattedDateForMobile = formattedDate(date);

            return (
              <div
                key={row.id}
                className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#202426] dark:shadow-none"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Scan History
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formattedDateForMobile}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account Name</p>
                    <p className="mt-1 font-medium text-slate-900 dark:text-gray-100">
                      {capitalizeFirstLetter(history.accountName)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">HIGH</p>
                    <p className="mt-1">
                      <span className="inline-block rounded-md bg-red-50 px-3 py-1 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                        {history.highCount}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">MEDIUM</p>
                    <p className="mt-1">
                      <span className="inline-block rounded-md bg-yellow-50 px-3 py-1 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                        {history.mediumCount}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">LOW</p>
                    <p className="mt-1">
                      <span className="inline-block rounded-md bg-green-50 px-3 py-1 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        {history.lowCount}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 dark:border-white/10">
                  <Button
                    size="sm"
                    onClick={() => onViewFindings(history.accountUuid)}
                    className="w-full cursor-pointer rounded-full border-0 bg-emerald-400 text-white shadow-md hover:bg-emerald-500"
                  >
                    View Findings
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-md border border-slate-200 py-8 text-center text-sm text-muted-foreground dark:border-white/10">
            No history found.
          </div>
        )}
      </div>

      {/* Desktop: Existing table */}
      <div className="hidden overflow-hidden rounded-md border border-slate-200 dark:border-white md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-100 text-gray-700 dark:bg-[#252b2e] dark:text-gray-200"
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading history...
                  </div>
                </TableCell>
              </TableRow>
            ) : errorMessage ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex justify-center">
                    <ErrorMessage message={errorMessage} />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="dark:border-white/10 dark:hover:bg-[#252b2e]"
                >
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SecurityGroupHistory;
