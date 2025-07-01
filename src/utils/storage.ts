import { Template, Guest, AppSettings } from '../types';

const TEMPLATES_KEY = 'wedding_templates';
const GUESTS_KEY = 'wedding_guests';
const SETTINGS_KEY = 'wedding_settings';

export interface TemplateExportData {
  version: string;
  exportDate: string;
  appName: string;
  templates: Template[];
}

export const storageUtils = {
  // Templates
  getTemplates: (): Template[] => {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveTemplates: (templates: Template[]) => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  },

  // Guests
  getGuests: (): Guest[] => {
    const stored = localStorage.getItem(GUESTS_KEY);
    if (!stored) return [];

    const guests = JSON.parse(stored);

    // Migration: Add tracking fields to existing guests
    const migratedGuests = guests.map((guest: any) => ({
      ...guest,
      sentStatus: guest.sentStatus || 'not_sent',
      sentAt: guest.sentAt ? new Date(guest.sentAt) : undefined,
      createdAt: new Date(guest.createdAt)
    }));

    // Save migrated data back to localStorage if migration occurred
    const needsMigration = guests.some((guest: any) => !guest.sentStatus);
    if (needsMigration) {
      localStorage.setItem(GUESTS_KEY, JSON.stringify(migratedGuests));
    }

    return migratedGuests;
  },

  saveGuests: (guests: Guest[]) => {
    localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
  },

  // Guest status management
  markGuestAsSent: (guestId: string): Guest[] => {
    const guests = storageUtils.getGuests();
    const updatedGuests = guests.map(guest =>
      guest.id === guestId
        ? { ...guest, sentStatus: 'sent' as const, sentAt: new Date() }
        : guest
    );
    storageUtils.saveGuests(updatedGuests);
    return updatedGuests;
  },

  markGuestAsNotSent: (guestId: string): Guest[] => {
    const guests = storageUtils.getGuests();
    const updatedGuests = guests.map(guest =>
      guest.id === guestId
        ? { ...guest, sentStatus: 'not_sent' as const, sentAt: undefined }
        : guest
    );
    storageUtils.saveGuests(updatedGuests);
    return updatedGuests;
  },

  markMultipleGuestsAsSent: (guestIds: string[]): Guest[] => {
    const guests = storageUtils.getGuests();
    const now = new Date();
    const updatedGuests = guests.map(guest =>
      guestIds.includes(guest.id)
        ? { ...guest, sentStatus: 'sent' as const, sentAt: now }
        : guest
    );
    storageUtils.saveGuests(updatedGuests);
    return updatedGuests;
  },

  markMultipleGuestsAsNotSent: (guestIds: string[]): Guest[] => {
    const guests = storageUtils.getGuests();
    const updatedGuests = guests.map(guest =>
      guestIds.includes(guest.id)
        ? { ...guest, sentStatus: 'not_sent' as const, sentAt: undefined }
        : guest
    );
    storageUtils.saveGuests(updatedGuests);
    return updatedGuests;
  },

  // Settings
  getSettings: (): AppSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { autoSave: true };
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Clear all data
  clearAll: () => {
    localStorage.removeItem(TEMPLATES_KEY);
    localStorage.removeItem(GUESTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  },

  // Template Export/Import
  exportTemplateConfig: (): TemplateExportData => {
    const templates = storageUtils.getTemplates();
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      appName: 'Wedding Invitation Generator',
      templates
    };
  },

  downloadTemplateConfig: () => {
    const exportData = storageUtils.exportTemplateConfig();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  validateTemplateData: (data: any): data is TemplateExportData => {
    if (!data || typeof data !== 'object') return false;
    if (!data.templates || !Array.isArray(data.templates)) return false;

    return data.templates.every((template: any) =>
      template &&
      typeof template.id === 'string' &&
      typeof template.name === 'string' &&
      typeof template.content === 'string' &&
      (template.type === 'formal' || template.type === 'informal') &&
      template.createdAt
    );
  },

  importTemplateConfig: async (file: File, mode: 'replace' | 'merge' = 'merge'): Promise<{ success: boolean; message: string; importedCount?: number }> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!storageUtils.validateTemplateData(data)) {
        return {
          success: false,
          message: 'File tidak valid. Pastikan file adalah export template yang benar.'
        };
      }

      const importedTemplates = data.templates.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt)
      }));

      let finalTemplates: Template[];
      let importedCount = 0;

      if (mode === 'replace') {
        finalTemplates = importedTemplates;
        importedCount = importedTemplates.length;
      } else {
        // Merge mode - avoid duplicates by name
        const existingTemplates = storageUtils.getTemplates();
        const existingNames = new Set(existingTemplates.map(t => t.name.toLowerCase()));

        const newTemplates = importedTemplates.filter((template: Template) =>
          !existingNames.has(template.name.toLowerCase())
        );

        finalTemplates = [...existingTemplates, ...newTemplates];
        importedCount = newTemplates.length;
      }

      storageUtils.saveTemplates(finalTemplates);

      return {
        success: true,
        message: `Berhasil mengimpor ${importedCount} template.`,
        importedCount
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal membaca file. Pastikan file adalah JSON yang valid.'
      };
    }
  }
};