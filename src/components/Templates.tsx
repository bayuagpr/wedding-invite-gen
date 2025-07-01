import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Download, Upload } from 'lucide-react';
import { Template } from '../types';
import { storageUtils } from '../utils/storage';
import { defaultTemplates } from '../utils/templates';
import Modal from './Modal';

interface TemplatesProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplateId?: string;
}

const Templates: React.FC<TemplatesProps> = ({ onTemplateSelect, selectedTemplateId }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '', type: 'formal' as 'formal' | 'informal' });
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    let templates = storageUtils.getTemplates();
    if (templates.length === 0) {
      // Initialize with default templates
      templates = defaultTemplates.map(template => ({
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      }));
      storageUtils.saveTemplates(templates);
    }
    setTemplates(templates);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Nama template dan konten tidak boleh kosong');
      return;
    }

    const now = new Date();
    let updatedTemplates;
    let savedTemplate: Template;

    if (editingTemplate) {
      savedTemplate = { ...editingTemplate, ...formData };
      updatedTemplates = templates.map(t =>
        t.id === editingTemplate.id
          ? savedTemplate
          : t
      );
    } else {
      savedTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: now
      };
      updatedTemplates = [...templates, savedTemplate];
    }

    setTemplates(updatedTemplates);
    storageUtils.saveTemplates(updatedTemplates);

    // If this template is currently selected, update the parent component
    if (editingTemplate && selectedTemplateId === editingTemplate.id) {
      onTemplateSelect(savedTemplate);
    }

    resetForm();
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Yakin ingin menghapus template ini?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      storageUtils.saveTemplates(updatedTemplates);
    }
  };

  const startEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      type: template.type
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setFormData({ name: '', content: '', type: 'formal' });
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({ name: '', content: '', type: 'formal' });
  };

  const handleExport = () => {
    try {
      storageUtils.downloadTemplateConfig();
      setImportStatus({ type: 'success', message: 'Template berhasil diekspor!' });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Gagal mengekspor template.' });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      // Ask user for import mode
      const shouldReplace = confirm(
        'Pilih mode import:\n\n' +
        'OK = Ganti semua template yang ada\n' +
        'Cancel = Gabung dengan template yang ada (skip duplikat)'
      );

      const mode = shouldReplace ? 'replace' : 'merge';
      const result = await storageUtils.importTemplateConfig(file, mode);

      if (result.success) {
        setImportStatus({ type: 'success', message: result.message });
        loadTemplates(); // Reload templates
      } else {
        setImportStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Terjadi kesalahan saat mengimpor file.' });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Template Pesan</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              title="Export template"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleImportClick}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              title="Import template"
              disabled={isImporting}
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Importing...' : 'Import'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
          <button
            onClick={startCreate}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Buat Template Baru
          </button>
        </div>
      </div>

      {/* Import status message */}
      {importStatus.type && (
        <div className={`p-3 rounded-lg ${
          importStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {importStatus.message}
        </div>
      )}

      {/* Template Form Modal */}
      <Modal
        isOpen={isCreating || editingTemplate !== null}
        onClose={resetForm}
        title={editingTemplate ? 'Edit Template' : 'Buat Template Baru'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Template
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Masukkan nama template"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Template
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'formal' | 'informal' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten Template
            </label>
            <div className="mb-2 text-xs sm:text-sm text-gray-600">
              Gunakan <code className="bg-gray-100 px-1 rounded text-xs">{'{nama_tamu}'}</code> untuk placeholder nama tamu
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono text-xs sm:text-sm resize-y min-h-[250px]"
              placeholder="Masukkan konten template undangan..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white p-4 rounded-lg shadow-md border-2 transition-all ${
              selectedTemplateId === template.id
                ? 'border-rose-300 bg-rose-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{template.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  template.type === 'formal'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {template.type === 'formal' ? 'Formal' : 'Informal'}
                </span>
              </div>

              <div className="flex gap-2 self-start">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(template);
                  }}
                  className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                  title="Edit template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(template.id);
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1"
                  title="Hapus template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap mb-3">
              {template.content}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onTemplateSelect(template)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedTemplateId === template.id
                    ? 'bg-rose-500 text-white cursor-default'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                }`}
              >
                {selectedTemplateId === template.id ? 'Template Terpilih' : 'Pilih Template'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <p className="text-sm sm:text-base">Belum ada template. Buat template pertama Anda!</p>
        </div>
      )}
    </div>
  );
};

export default Templates;