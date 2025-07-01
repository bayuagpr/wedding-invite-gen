import React, { createContext, useContext, ReactNode } from 'react';
import { useOnlineStatus, OnlineStatus } from '../hooks/useOnlineStatus';

interface NetworkContextType extends OnlineStatus {
  showOfflineMessage: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const onlineStatus = useOnlineStatus();
  
  // Show offline message when offline or when coming back online after being offline
  const showOfflineMessage = onlineStatus.isOffline || (onlineStatus.isOnline && onlineStatus.wasOffline);

  return (
    <NetworkContext.Provider value={{
      ...onlineStatus,
      showOfflineMessage
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export default NetworkContext;
