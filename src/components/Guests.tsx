import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Edit2, Trash2, Save, X, Users, AlertCircle } from 'lucide-react';
import { Guest } from '../types';
import { storageUtils } from '../utils/storage';
import { validateWhatsAppNumber, formatWhatsAppNumber, parseCSV } from '../utils/validation';

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', whatsappNumber: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = () => {
    const guests = storageUtils.getGuests();
    setGuests(guests);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama tamu tidak boleh kosong';
    }

    if (formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Format nomor WhatsApp tidak valid (contoh: 08xxx, +628xxx)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const now = new Date();
    let updatedGuests;

    if (editingGuest) {
      updatedGuests = guests.map(g => 
        g.id === editingGuest.id 
          ? { 
              ...editingGuest, 
              ...formData,
              whatsappNumber: formData.whatsappNumber ? formatWhatsAppNumber(formData.whatsappNumber) : undefined
            }
          : g
      );
    } else {
      const newGuest: Guest = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        whatsappNumber: formData.whatsappNumber ? formatWhatsAppNumber(formData.whatsappNumber) : undefined,
        createdAt: now
      };
      updatedGuests = [...guests, newGuest];
    }

    setGuests(updatedGuests);
    storageUtils.saveGuests(updatedGuests);
    resetForm();
  };

  const handleDelete = (guestId: string) => {
    if (confirm('Yakin ingin menghapus tamu ini?')) {
      const updatedGuests = guests.filter(g => g.id !== guestId);
      setGuests(updatedGuests);
      storageUtils.saveGuests(updatedGuests);
    }
  };

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      whatsappNumber: guest.whatsappNumber || ''
    });
    setErrors({});
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingGuest(null);
    setIsCreating(false);
    setFormData({ name: '', whatsappNumber: '' });
    setErrors({});
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingGuest(null);
    setFormData({ name: '', whatsappNumber: '' });
    setErrors({});
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedGuests = parseCSV(csvText);
        
        const newGuests: Guest[] = parsedGuests.map(guest => ({
          id: Math.random().toString(36).substr(2, 9),
          name: guest.name,
          whatsappNumber: guest.whatsappNumber ? formatWhatsAppNumber(guest.whatsappNumber) : undefined,
          createdAt: new Date()
        }));

        const updatedGuests = [...guests, ...newGuests];
        setGuests(updatedGuests);
        storageUtils.saveGuests(updatedGuests);
        
        alert(`Berhasil mengimpor ${newGuests.length} tamu dari file CSV`);
      } catch (error) {
        alert(`Error parsing CSV: ${(error as Error).message}`);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `Nama,WhatsApp
John Doe,08123456789
Jane Smith,+6281234567890
Bob Johnson,`;
    
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-guests.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Daftar Tamu</h2>
          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-sm">{guests.length}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={startCreate}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* CSV Import Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Panduan Import CSV</h4>
            <p className="text-xs sm:text-sm text-blue-700 mb-2">
              File CSV harus memiliki kolom <strong>Nama</strong> (wajib) dan <strong>WhatsApp</strong> (opsional).
            </p>
            <button
              onClick={downloadSampleCSV}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Download contoh file CSV
            </button>
          </div>
        </div>
      </div>

      {(isCreating || editingGuest) && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">
            {editingGuest ? 'Edit Tamu' : 'Tambah Tamu Baru'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Tamu *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama tamu"
              />
              {errors.name && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base ${
                  errors.whatsappNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="08xxx atau +628xxx (opsional)"
              />
              {errors.whatsappNumber && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.whatsappNumber}</p>
              )}
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Format yang didukung: 08xxx, +628xxx, 628xxx
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 break-words">{guest.name}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {guest.whatsappNumber ? (
                        <a 
                          href={`https://wa.me/${guest.whatsappNumber.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 break-all"
                        >
                          {guest.whatsappNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => startEdit(guest)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {guests.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-lg">Belum ada tamu yang ditambahkan</p>
            <p className="text-xs sm:text-sm">Tambah tamu secara manual atau import dari file CSV</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;