const NotFound = () => {
  return (
    <div className="flex min-h-screen min-h-dvh items-center justify-center bg-slate-50 px-4 dark:bg-[#0a0e0f]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 sm:text-6xl">
          404
        </h1>

        <p className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-200">
          Page Not Found
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
