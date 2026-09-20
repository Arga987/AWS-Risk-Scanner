const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>

        <p className="mt-4 text-lg font-medium">Page Not Found</p>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
