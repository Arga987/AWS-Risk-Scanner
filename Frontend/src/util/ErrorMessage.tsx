type Props = {
  message: string;
};

const ErrorMessage = (props: Props) => {
  const { message } = props;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 shadow-md">
      {message}
    </div>
  );
};

export default ErrorMessage;
