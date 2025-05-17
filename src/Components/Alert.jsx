import { useState, useEffect } from 'react';

export default function Alert({ alertData, setAlertData }) {
  const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      if (!alertData.type == '') {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
          setAlertData({
            type: "",
            message: "",
          });
        }, 3000);

        return () => clearTimeout(timer);
      }
    }, [alertData]);
  
    if (!isVisible) return null;
  return (
    <div
      className={`p-4 mb-4 text-sm rounded-lg absolute top-2 end-2 flex gap-3 align-center ${
        alertData.type == "success"
          ? "text-green-800 rounded-lg bg-green-50"
          : "text-red-800 rounded-lg bg-red-50"
      }`}
      role="alert"
    >
      <svg
        className="shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <p>{alertData.message}</p>
    </div>
  );
}
