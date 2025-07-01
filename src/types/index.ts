export interface Template {
  id: string;
  name: string;
  content: string;
  type: 'formal' | 'informal';
  createdAt: Date;
}

export interface Guest {
  id: string;
  name: string;
  whatsappNumber?: string;
  createdAt: Date;
  sentStatus: 'not_sent' | 'sent';
  sentAt?: Date;
}

export interface AppSettings {
  selectedTemplateId?: string;
  autoSave: boolean;
}