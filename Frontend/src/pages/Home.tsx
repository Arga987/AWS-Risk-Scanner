import { useState } from "react";
import axios from "axios";
import PageShell from "../components/PageShell";
import { Button } from "@/components/ui/button";
import type { ScanSummaryDto } from "@/interfaces/SecurityGroupInterfaces";
import api from "@/API";
import SecurityGroupFindings from "@/components/SecurityGroupFindings/SecurityGroupFindings";

const Home = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanSummary, setScanSummary] = useState<ScanSummaryDto | null>(null);
  const [showFindings, setShowFindings] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);

    try {
      const response = await axios.post<ScanSummaryDto>(
        api.SECURITY_GROUP.SCAN
      );

      setScanSummary(response.data);
      setScanComplete(true);
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <PageShell>
      {showFindings ? (
        <SecurityGroupFindings accountUuid={scanSummary.accountUuid} />
      ) : isScanning ? (
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="text-sm text-muted-foreground">
              Scanning AWS Security Groups...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-16">
          {!scanComplete ? (
            <div className="mt-12 w-full max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold">
                  SECURITY GROUP SCANNER
                </h2>

                <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                  Scan your AWS account to identify potentially risky Security
                  Group rules and security issues.
                </p>

                <Button className="mt-8 cursor-pointer" onClick={handleScan}>
                  Scan AWS Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl">
              {/* Success Message */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                <h2 className="font-semibold text-green-700">
                  Scan Completed Successfully!
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  Your AWS account has been scanned successfully.
                </p>
              </div>

              {/* Severity Counts */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm font-medium text-red-700">HIGH</p>

                  <p className="mt-2 text-3xl font-semibold text-red-800">
                    {scanSummary?.highCount}
                  </p>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                  <p className="text-sm font-medium text-yellow-700">MEDIUM</p>

                  <p className="mt-2 text-3xl font-semibold text-yellow-800">
                    {scanSummary?.mediumCount}
                  </p>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                  <p className="text-sm font-medium text-green-700">LOW</p>

                  <p className="mt-2 text-3xl font-semibold text-green-800">
                    {scanSummary?.lowCount}
                  </p>
                </div>
              </div>

              {/* View Findings */}
              <div className="mt-8 flex flex-col items-center">
                <p className="text-sm text-muted-foreground">
                  Click below to view the detailed findings
                </p>

                <Button
                  className="mt-3 cursor-pointer"
                  onClick={() => setShowFindings(true)}
                >
                  View Findings
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
};

export default Home;
