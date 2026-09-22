import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, Loader2 } from "lucide-react";
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
import type {
  SecurityGroupFinding,
  SecurityGroupFindingsResponse,
} from "@/interfaces/SecurityGroupInterfaces";
import { SecurityGroupFindingsColumns } from "@/components/SecurityGroupFindings/SecurityGroupFindingsUtils";
import { Button } from "@base-ui/react/button";

type Props = {
  accountUuid: string;
};

const SecurityGroupFindings = (props: Props) => {
  const { accountUuid } = props;
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [data, setData] = useState<SecurityGroupFinding[]>([]);
  const [searchString, setSearchString] = useState("");
  const [pageTokens, setPageTokens] = useState<string[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const table = useReactTable({
    data,
    columns: SecurityGroupFindingsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearchChange = (value: string) => {
    setSearchString(value);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
    setPageTokens([]);
    setNextPageToken(null);
    setSearchString("");
    setSelectedSeverity("ALL");
    fetchFindings(undefined, newPageSize, "ALL", "");
  };

  const handleSearch = () => {
    setNextPageToken(null);
    setCurrentPage(1);
    setPageTokens([]);
    fetchFindings();
  };

  const handleSeverityChange = (value: string) => {
    setSelectedSeverity(value);
  };

  const handleNext = () => {
    if (!nextPageToken) return;
    setPageTokens((tokens) => [...tokens, nextPageToken]);
    fetchFindings(nextPageToken);
    setCurrentPage((page) => page + 1);
  };

  const handlePrevious = () => {
    if (currentPage === 1) return;
    const previousPageToken = pageTokens[pageTokens.length - 2];
    fetchFindings(previousPageToken);
    setPageTokens((tokens) => tokens.slice(0, -1));
    setCurrentPage((page) => page - 1);
  };

  const fetchFindings = async (
    pageToken?: string,
    requestedPageSize = pageSize,
    requestedSeverity = selectedSeverity,
    requestedSearchString = searchString
  ) => {
    const severity =
      requestedSeverity === "ALL" ? undefined : requestedSeverity;
    setIsLoading(true);
    try {
      const response = await axios.get<SecurityGroupFindingsResponse>(
        api.SECURITY_GROUP.FINDINGS,
        {
          params: {
            accountUuid,
            severity,
            searchString: requestedSearchString,
            pageSize: requestedPageSize,
            pageToken,
          },
        }
      );

      setData(response.data.findings);
      setNextPageToken(response.data.nextPageToken);
    } catch (error) {
      console.error("Failed to fetch findings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNextPageToken(null);
    setCurrentPage(1);
    setPageTokens([]);
    fetchFindings();
  }, [accountUuid, selectedSeverity]);

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
        <div className="relative w-full max-w-lg">
          <Input
            placeholder="Search By ID or Name..."
            value={searchString}
            onChange={(event) => handleSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full cursor-text caret-black pr-10"
          />

          <Button
            type="button"
            onClick={handleSearch}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
            aria-label="Search findings"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select value={selectedSeverity} onValueChange={handleSeverityChange}>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={SecurityGroupFindingsColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading findings...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
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
      <div className="mt-4 flex items-center justify-end gap-4">
        <p className="text-sm text-muted-foreground">Page {currentPage}</p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Size:</span>

          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={handlePrevious}
            className="cursor-pointer rounded-full border border-gray-400 bg-white px-6 text-black shadow-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-60 disabled:hover:bg-gray-200"
          >
            Previous
          </Button>

          <Button
            disabled={!nextPageToken}
            onClick={handleNext}
            className="cursor-pointer rounded-full border-0 bg-emerald-400 px-6 text-white shadow-md hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-70 disabled:hover:bg-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityGroupFindings;
