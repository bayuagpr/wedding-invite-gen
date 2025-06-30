import { Template, Guest, AppSettings } from '../types';

const TEMPLATES_KEY = 'wedding_templates';
const GUESTS_KEY = 'wedding_guests';
const SETTINGS_KEY = 'wedding_settings';

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
    return stored ? JSON.parse(stored) : [];
  },

  saveGuests: (guests: Guest[]) => {
    localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
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
  }
};