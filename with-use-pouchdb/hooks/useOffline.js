import { useState, useEffect } from "react";

export default function useOffline() {
  const [isOffline, setIsOffline] = useState(
    typeof window !== "undefined" ? !window.navigator.onLine : false
  );

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOffline;
}
