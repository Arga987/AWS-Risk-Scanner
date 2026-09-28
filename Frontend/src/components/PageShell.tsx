import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

const PageShell = ({ children }: PageShellProps) => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 dark:bg-slate-950">
      <div className="min-h-[calc(100vh-6rem)] bg-white dark:bg-slate-900">
        {children}
      </div>
    </main>
  );
};

export default PageShell;
