import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, X } from 'lucide-react';

interface PWAUpdateNotificationProps {
  onUpdate?: () => void;
}

const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({ onUpdate }) => {
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker has taken control
        if (!window.location.hash.includes('updated')) {
          window.location.hash = 'updated';
          window.location.reload();
        }
      });

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available
                    setShowUpdateAvailable(true);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.log('Service worker not available');
        }
      };

      checkForUpdates();
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide install prompt if app is already installed
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
      
      if (onUpdate) {
        onUpdate();
      }
      
      // Reload the page to get the new version
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating app:', error);
      setIsUpdating(false);
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const dismissUpdate = () => {
    setShowUpdateAvailable(false);
  };

  const dismissInstall = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Update Available Notification */}
      {showUpdateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
          <RefreshCw className={`w-5 h-5 flex-shrink-0 ${isUpdating ? 'animate-spin' : ''}`} />
          <div className="flex-1">
            <p className="font-medium text-sm">Update Tersedia!</p>
            <p className="text-xs opacity-90">Versi baru aplikasi sudah siap</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-white text-blue-500 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={dismissUpdate}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Install App Notification */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 z-50 bg-purple-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
          <Download className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Install Aplikasi</p>
            <p className="text-xs opacity-90">Tambahkan ke layar utama untuk akses cepat</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-purple-500 px-3 py-1 rounded text-xs font-medium hover:bg-purple-50 transition-colors"
            >
              Install
            </button>
            <button
              onClick={dismissInstall}
              className="text-white hover:text-purple-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAUpdateNotification;
