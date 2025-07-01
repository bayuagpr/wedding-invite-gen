import React, { useState, useEffect } from 'react';
import { Heart, FileText, Users, Eye, Download, Menu, X } from 'lucide-react';
import Templates from './components/Templates';
import Guests from './components/Guests';
import Preview from './components/Preview';
import Export from './components/Export';
import OfflineIndicator from './components/OfflineIndicator';
import PWAUpdateNotification from './components/PWAUpdateNotification';
import { Template, Guest } from './types';
import { storageUtils } from './utils/storage';

type TabType = 'templates' | 'guests' | 'preview' | 'export';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load selected template from settings
    const settings = storageUtils.getSettings();
    if (settings.selectedTemplateId) {
      const templates = storageUtils.getTemplates();
      const template = templates.find(t => t.id === settings.selectedTemplateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }

    // Load guests and default select unsent ones
    const loadGuests = () => {
      const guestList = storageUtils.getGuests();
      setGuests(guestList);

      // Default select all guests with 'not_sent' status
      const unsentGuestIds = guestList
        .filter(guest => guest.sentStatus === 'not_sent')
        .map(guest => guest.id);
      setSelectedGuests(new Set(unsentGuestIds));
    };

    loadGuests();

    // Listen for storage changes to refresh when guests are updated
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wedding_guests') {
        loadGuests();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    const settings = storageUtils.getSettings();
    settings.selectedTemplateId = template.id;
    storageUtils.saveSettings(settings);
  };

  const tabs = [
    { id: 'templates' as TabType, label: 'Template', icon: FileText },
    { id: 'guests' as TabType, label: 'Tamu', icon: Users },
    { id: 'preview' as TabType, label: 'Preview', icon: Eye },
    { id: 'export' as TabType, label: 'Export', icon: Download }
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* PWA Update Notification */}
      <PWAUpdateNotification />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 sm:p-3 rounded-lg">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                    Generator Undangan
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">Putri Shahya Maharani & Bayu Agung Prakoso Wedding</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Network Status - Desktop only */}
                <div className="hidden sm:block">
                  <OfflineIndicator />
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Modal */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Menu Navigation</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-4 py-4 px-4 rounded-xl font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg transform scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-left">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:block bg-white border-b sticky top-[73px] sm:top-[89px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'templates' && (
          <Templates
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplate?.id}
          />
        )}
        {activeTab === 'guests' && (
          <Guests
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            guests={guests}
            setGuests={setGuests}
          />
        )}
        {activeTab === 'preview' && (
          <Preview
            selectedTemplate={selectedTemplate}
            selectedGuests={selectedGuests}
            guests={guests}
          />
        )}
        {activeTab === 'export' && (
          <Export
            selectedTemplate={selectedTemplate}
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            guests={guests}
            setGuests={setGuests}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>Generator Undangan Pernikahan - Bayu & Shahya</p>
            <p className="mt-1">Semua data tersimpan di browser Anda secara lokal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;