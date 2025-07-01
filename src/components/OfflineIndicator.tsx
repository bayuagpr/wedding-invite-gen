import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle, X } from 'lucide-react';
import { useNetwork } from '../contexts/NetworkContext';

const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline, wasOffline } = useNetwork();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowOfflineToast(true);
      setShowBackOnline(false);
    } else if (isOnline && wasOffline) {
      setShowOfflineToast(false);
      setShowBackOnline(true);
      // Auto-hide the "back online" message after 3 seconds
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isOffline, wasOffline]);

  const dismissBackOnline = () => {
    setShowBackOnline(false);
  };

  const dismissOfflineToast = () => {
    setShowOfflineToast(false);
  };

  return (
    <>
      {/* Persistent offline indicator in header */}
      {isOffline && (
        <div className="bg-red-500 text-white px-3 py-1 text-xs sm:text-sm flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Mode Offline - Beberapa fitur mungkin terbatas</span>
        </div>
      )}

      {/* Back online toast notification */}
      {showBackOnline && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Kembali Online!</p>
            <p className="text-xs opacity-90">Semua fitur sudah tersedia kembali</p>
          </div>
          <button
            onClick={dismissBackOnline}
            className="text-white hover:text-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Offline toast notification */}
      {showOfflineToast && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Mode Offline</p>
            <p className="text-xs opacity-90">Data tersimpan lokal, WhatsApp tidak tersedia</p>
          </div>
          <button
            onClick={dismissOfflineToast}
            className="text-white hover:text-orange-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Network status icon in header (always visible) */}
      <div className="flex items-center gap-1 text-xs">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" title="Online" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" title="Offline" />
        )}
      </div>
    </>
  );
};

export default OfflineIndicator;
