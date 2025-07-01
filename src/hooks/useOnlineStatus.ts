import { useState, useEffect } from 'react';

export interface OnlineStatus {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
}

export const useOnlineStatus = (): OnlineStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Keep track if we were offline before
      if (!navigator.onLine) {
        setWasOffline(true);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Additional check using fetch to verify actual connectivity
    const checkConnectivity = async () => {
      try {
        // Try to fetch a small resource to verify connectivity
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check connectivity on mount
    checkConnectivity();

    // Periodic connectivity check (every 30 seconds when offline)
    const intervalId = setInterval(() => {
      if (!navigator.onLine) {
        checkConnectivity();
      }
    }, 30000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline
  };
};

export default useOnlineStatus;
