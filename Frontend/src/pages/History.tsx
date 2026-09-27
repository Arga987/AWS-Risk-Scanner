import SecurityGroupHistory from "@/components/SecurityGroupHistory/SecurityGroupHistory";
import PageShell from "../components/PageShell";
import { useEffect, useState } from "react";
import SecurityGroupFindings from "@/components/SecurityGroupFindings/SecurityGroupFindings";
import { useLocation, useNavigate } from "react-router-dom";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedAccountUuid, setSelectedAccountUuid] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!location.state?.viewingFindings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAccountUuid(null);
    }
  }, [location.key, location.state]);

  const handleViewFindings = (accountUuid: string) => {
    navigate("/history", {
      state: { viewingFindings: true },
    });

    setSelectedAccountUuid(accountUuid);
  };

  return (
    <PageShell>
      <div className="p-8">
        {selectedAccountUuid ? (
          <SecurityGroupFindings accountUuid={selectedAccountUuid} />
        ) : (
          <>
            <h1 className="text-2xl font-semibold">History</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              View previous security scans and their findings.
            </p>

            <SecurityGroupHistory onViewFindings={handleViewFindings} />
          </>
        )}
      </div>
    </PageShell>
  );
};

export default History;
