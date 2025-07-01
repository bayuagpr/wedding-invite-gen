import React, { ReactNode } from 'react';
import { TemplatesProvider } from './TemplatesContext';
import { GuestsProvider } from './GuestsContext';
import { NetworkProvider } from './NetworkContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <NetworkProvider>
      <TemplatesProvider>
        <GuestsProvider>
          {children}
        </GuestsProvider>
      </TemplatesProvider>
    </NetworkProvider>
  );
};

export default AppProviders;
