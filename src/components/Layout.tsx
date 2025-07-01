import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, FileText, Users, Download, Menu, X, HelpCircle } from 'lucide-react';
import { useTemplates } from '../contexts/TemplatesContext';
import OfflineIndicator from './OfflineIndicator';
import PWAUpdateNotification from './PWAUpdateNotification';
import Stepper, { TabType, StepStatus } from './Stepper';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTemplate } = useTemplates();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current route from pathname
  const getCurrentStep = (): TabType => {
    const path = location.pathname;
    if (path === '/' || path === '/templates') return 'templates';
    if (path === '/guests') return 'guests';
    if (path === '/export') return 'export';
    return 'templates';
  };

  const activeTab = getCurrentStep();

  const steps = [
    { id: 'templates' as TabType, label: 'Template', icon: FileText, shortLabel: 'Template' },
    { id: 'guests' as TabType, label: 'Tamu', icon: Users, shortLabel: 'Tamu' },
    { id: 'export' as TabType, label: 'Kirim', icon: Download, shortLabel: 'Kirim' }
  ];

  const getStepStatus = (stepId: TabType): StepStatus => {
    const stepOrder: TabType[] = ['templates', 'guests', 'export'];
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
      // Navigate to the appropriate route
      const routes: Record<TabType, string> = {
        templates: '/',
        guests: '/guests',
        export: '/export',
        preview: '/export' // Fallback to export if preview is used
      };
      navigate(routes[stepId]);
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

                {/* Help button */}
                <button
                  onClick={() => navigate('/help')}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Panduan Penggunaan"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

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
                    {activeTab === 'export' && 'Kirim undangan ke tamu yang dipilih'}
                  </p>
                </div>

                {/* Help button in mobile menu */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      navigate('/help');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Panduan Penggunaan</span>
                  </button>
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
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>Generator Undangan Pernikahan - Bayu & Shahya</p>
            <p className="mt-1">Semua data tersimpan di browser Anda secara lokal</p>
            <div className="mt-3">
              <button
                onClick={() => navigate('/help')}
                className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm"
              >
                Panduan Penggunaan
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
