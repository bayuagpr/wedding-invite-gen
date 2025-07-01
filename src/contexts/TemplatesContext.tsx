import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Template } from '../types';
import { storageUtils } from '../utils/storage';

interface TemplatesContextType {
  selectedTemplate: Template | undefined;
  setSelectedTemplate: (template: Template | undefined) => void;
  handleTemplateSelect: (template: Template) => void;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

export const useTemplates = () => {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplatesProvider');
  }
  return context;
};

interface TemplatesProviderProps {
  children: ReactNode;
}

export const TemplatesProvider: React.FC<TemplatesProviderProps> = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();

  useEffect(() => {
    // Load selected template from settings on app start
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
    // Save to localStorage
    const settings = storageUtils.getSettings();
    settings.selectedTemplateId = template.id;
    storageUtils.saveSettings(settings);
  };

  const value: TemplatesContextType = {
    selectedTemplate,
    setSelectedTemplate,
    handleTemplateSelect,
  };

  return (
    <TemplatesContext.Provider value={value}>
      {children}
    </TemplatesContext.Provider>
  );
};

export default TemplatesProvider;
