import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  RemediationResponseDto,
  SecurityGroupFinding,
} from "@/interfaces/SecurityGroupInterfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/API";
import { severityStyles } from "./SecurityGroupFindingsUtils";
import { Loader2 } from "lucide-react";
import ErrorMessage from "@/util/ErrorMessage";

type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
  finding: SecurityGroupFinding | null;
  accountUuid: string;
};

const RemediationDialog = (props: Props) => {
  const { open, onClose, finding, accountUuid } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remediation, setRemediation] = useState<RemediationResponseDto | null>(
    null
  );

  const fetchRemediation = async (findingUuid: string) => {
    setIsLoading(true);
    setRemediation(null);
    try {
      const response = await axios.get<RemediationResponseDto>(
        api.SECURITY_GROUP.REMEDIATION,
        {
          params: {
            accountUuid,
            sgUuid: findingUuid,
          },
        }
      );

      setRemediation(response.data);
    } catch (error) {
      console.error("Failed to fetch remediation:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !finding?.findingUuid) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRemediation(finding.findingUuid);
  }, [open, finding, accountUuid]);

  console.log(remediation, isLoading);
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Remediation Action
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-80 items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading remediation...
              </div>
            </div>
          ) : errorMessage ? (
            <div className="flex h-80 items-center justify-center">
              <ErrorMessage message={errorMessage} />
            </div>
          ) : (
            <>
              {/* Severity + Rule */}
              <div className="flex items-center gap-6">
                <div
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${
                    finding?.severity
                      ? severityStyles[finding.severity]
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {finding?.severity}
                </div>

                <div className="text-sm">
                  <span className="font-semibold">Rule:</span> {finding?.rule}
                </div>
              </div>

              <div className="border-t" />

              {/* Issue */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Issue</h3>

                <div className="rounded-md border bg-red-50 p-4 text-sm leading-6 text-black">
                  {remediation?.issue}
                </div>
              </div>

              {/* Why is this an issue? */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Why is this an issue?</h3>

                <div className="rounded-md border bg-yellow-50 p-4 text-sm leading-6 text-black">
                  <ul className="list-disc space-y-2 pl-5">
                    {remediation?.reason.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Solution</h3>

                <div className="rounded-md border bg-green-50 p-4 text-sm leading-6 text-black">
                  <ol className="list-decimal space-y-2 pl-5">
                    {remediation?.solution.map((solution, index) => (
                      <li key={index}>{solution}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemediationDialog;
