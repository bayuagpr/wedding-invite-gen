import React, { useState, useEffect } from 'react';
import { Heart, FileText, Users, Eye, Download, Menu, X } from 'lucide-react';
import Templates from './components/Templates';
import Guests from './components/Guests';
import Preview from './components/Preview';
import Export from './components/Export';
import OfflineIndicator from './components/OfflineIndicator';
import PWAUpdateNotification from './components/PWAUpdateNotification';
import Stepper, { TabType, StepStatus } from './components/Stepper';
import { Template, Guest } from './types';
import { storageUtils } from './utils/storage';

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

  const steps = [
    { id: 'templates' as TabType, label: 'Template', icon: FileText, shortLabel: 'Template' },
    { id: 'guests' as TabType, label: 'Tamu', icon: Users, shortLabel: 'Tamu' },
    { id: 'preview' as TabType, label: 'Preview', icon: Eye, shortLabel: 'Preview' },
    { id: 'export' as TabType, label: 'Export', icon: Download, shortLabel: 'Export' }
  ];

  const getStepStatus = (stepId: TabType): StepStatus => {
    const stepOrder: TabType[] = ['templates', 'guests', 'preview', 'export'];
    const currentIndex = stepOrder.indexOf(activeTab);
    const stepIndex = stepOrder.indexOf(stepId);

    // Current step
    if (stepId === activeTab) return 'current';

    // Completed steps (can always go back)
    if (stepIndex < currentIndex) return 'completed';

    // Future steps - check accessibility
    if (stepIndex > currentIndex) {
      // Template required for all subsequent steps
      if (!selectedTemplate && stepIndex > 0) return 'disabled';
      return 'accessible';
    }

    return 'accessible';
  };

  const handleStepChange = (stepId: TabType) => {
    const status = getStepStatus(stepId);
    if (status !== 'disabled') {
      setActiveTab(stepId);
      setIsMobileMenuOpen(false);
    }
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
                <h3 className="text-lg font-semibold text-gray-900">Progress Undangan</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <Stepper
                  steps={steps}
                  currentStep={activeTab}
                  onStepClick={handleStepChange}
                  getStepStatus={getStepStatus}
                  variant="mobile"
                />

                {/* Step Details */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {steps.find(step => step.id === activeTab)?.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'templates' && 'Pilih template undangan yang sesuai dengan acara Anda'}
                    {activeTab === 'guests' && 'Kelola daftar tamu yang akan menerima undangan'}
                    {activeTab === 'preview' && 'Lihat pratinjau pesan undangan sebelum dikirim'}
                    {activeTab === 'export' && 'Kirim undangan ke tamu yang dipilih'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation Stepper */}
      <nav className="hidden md:block bg-white border-b sticky top-[73px] sm:top-[89px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Stepper
            steps={steps}
            currentStep={activeTab}
            onStepClick={handleStepChange}
            getStepStatus={getStepStatus}
            variant="desktop"
          />
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