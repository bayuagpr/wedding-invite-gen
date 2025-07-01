import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Guest } from '../types';
import { storageUtils } from '../utils/storage';

interface GuestsContextType {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  selectedGuests: Set<string>;
  setSelectedGuests: React.Dispatch<React.SetStateAction<Set<string>>>;
  loadGuests: () => void;
  refreshGuestSelection: () => void;
}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined);

export const useGuests = () => {
  const context = useContext(GuestsContext);
  if (context === undefined) {
    throw new Error('useGuests must be used within a GuestsProvider');
  }
  return context;
};

interface GuestsProviderProps {
  children: ReactNode;
}

export const GuestsProvider: React.FC<GuestsProviderProps> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());

  const loadGuests = () => {
    const guestList = storageUtils.getGuests();
    setGuests(guestList);
    return guestList;
  };

  const refreshGuestSelection = () => {
    const guestList = loadGuests();
    // Default select all guests with 'not_sent' status
    const unsentGuestIds = guestList
      .filter(guest => guest.sentStatus === 'not_sent')
      .map(guest => guest.id);
    setSelectedGuests(new Set(unsentGuestIds));
  };

  useEffect(() => {
    // Initial load
    refreshGuestSelection();

    // Listen for storage changes to refresh when guests are updated
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wedding_guests') {
        loadGuests();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: GuestsContextType = {
    guests,
    setGuests,
    selectedGuests,
    setSelectedGuests,
    loadGuests,
    refreshGuestSelection,
  };

  return (
    <GuestsContext.Provider value={value}>
      {children}
    </GuestsContext.Provider>
  );
};

export default GuestsProvider;
