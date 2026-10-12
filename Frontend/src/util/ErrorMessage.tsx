import { useEffect, useState } from "react";

type Props = {
  message: string;
};

const ErrorMessage = (props: Props) => {
  const { message } = props;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);

    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 shadow-md">
      {message}
    </div>
  );
};

export default ErrorMessage;
