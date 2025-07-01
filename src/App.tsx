import React, { useState, useEffect } from 'react';
import { Heart, FileText, Users, Eye, Download, Menu, X } from 'lucide-react';
import Templates from './components/Templates';
import Guests from './components/Guests';
import Preview from './components/Preview';
import Export from './components/Export';
import { Template } from './types';
import { storageUtils } from './utils/storage';

type TabType = 'templates' | 'guests' | 'preview' | 'export';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
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
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
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
        {activeTab === 'guests' && <Guests />}
        {activeTab === 'preview' && <Preview selectedTemplate={selectedTemplate} />}
        {activeTab === 'export' && <Export selectedTemplate={selectedTemplate} />}
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