import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

const PageShell = ({ children }: PageShellProps) => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 dark:bg-[#171b1d]">
      <div
        className="min-h-[calc(100vh-6rem)] rounded-xl border border-slate-200 border-l-4 border-l-green-500
          bg-white dark:border-white dark:border-l-green-500 dark:bg-[#171b1d]"
      >
        {children}
      </div>
    </main>
  );
};

export default PageShell;
