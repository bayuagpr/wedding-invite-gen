import React, { useState, useRef } from 'react';
import { Plus, Upload, Edit2, Trash2, Save, X, Users, AlertCircle, Filter, Search, Tag } from 'lucide-react';
import { Guest } from '../types';
import { storageUtils } from '../utils/storage';
import { validateWhatsAppNumber, formatWhatsAppNumber, parseCSV, isContactPickerSupported } from '../utils/validation';
import Modal from './Modal';

// Contact Picker API types
interface ContactInfo {
  name?: string[];
  tel?: string[];
  email?: string[];
  address?: any[];
  icon?: Blob[];
}

interface GuestsProps {
  selectedGuests: Set<string>;
  setSelectedGuests: (guests: Set<string>) => void;
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
}

const Guests: React.FC<GuestsProps> = ({ selectedGuests, setSelectedGuests, guests, setGuests }) => {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', whatsappNumber: '', labels: [] as string[] });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'sent' | 'not_sent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isImportingContact, setIsImportingContact] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [showLabelManager, setShowLabelManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Auto-add any pending label before validation
    let finalFormData = formData;
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      const label = newLabel.trim();
      finalFormData = {
        ...formData,
        labels: [...formData.labels, label]
      };
      setFormData(finalFormData);
      setNewLabel('');
    }

    if (!validateForm()) return;

    const now = new Date();
    let updatedGuests;

    if (editingGuest) {
      updatedGuests = guests.map(g =>
        g.id === editingGuest.id
          ? {
              ...editingGuest,
              ...finalFormData,
              whatsappNumber: finalFormData.whatsappNumber ? formatWhatsAppNumber(finalFormData.whatsappNumber) : undefined,
              labels: finalFormData.labels
            }
          : g
      );
    } else {
      const newGuest: Guest = {
        id: Math.random().toString(36).substring(2, 11),
        name: finalFormData.name.trim(),
        whatsappNumber: finalFormData.whatsappNumber ? formatWhatsAppNumber(finalFormData.whatsappNumber) : undefined,
        labels: finalFormData.labels,
        createdAt: now,
        sentStatus: 'not_sent',
        sentAt: undefined
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

      // Remove deleted guest from selectedGuests if it was selected
      if (selectedGuests.has(guestId)) {
        const newSelection = new Set(selectedGuests);
        newSelection.delete(guestId);
        setSelectedGuests(newSelection);
      }
    }
  };

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      whatsappNumber: guest.whatsappNumber || '',
      labels: guest.labels || []
    });
    setErrors({});
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingGuest(null);
    setIsCreating(false);
    setFormData({ name: '', whatsappNumber: '', labels: [] });
    setNewLabel('');
    setErrors({});
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingGuest(null);
    setFormData({ name: '', whatsappNumber: '', labels: [] });
    setErrors({});
  };

  // Label management functions
  const addLabel = () => {
    const label = newLabel.trim();
    if (label && !formData.labels.includes(label)) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, label]
      }));
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }));
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLabel();
    }
  };

  const handleContactImport = async () => {
    if (!isContactPickerSupported()) {
      alert('Contact Picker tidak didukung di browser ini. Silakan gunakan Chrome di Android.');
      return;
    }

    setIsImportingContact(true);

    try {
      const nav = navigator as any;
      const contacts: ContactInfo[] = await nav.contacts.select(['name', 'tel'], {
        multiple: false
      });

      if (contacts.length > 0) {
        const contact: ContactInfo = contacts[0];

        // Handle name (take first name from array)
        const contactName = contact.name && contact.name.length > 0
          ? contact.name[0]
          : '';

        // Handle phone numbers (take first tel from array)
        const contactPhone = contact.tel && contact.tel.length > 0
          ? contact.tel[0]
          : '';

        // Fill form fields
        setFormData(prev => ({
          ...prev,
          name: contactName,
          whatsappNumber: contactPhone
        }));

        // Clear any existing errors since we're populating with fresh data
        setErrors({});

        // Show success feedback if contact was imported
        if (contactName || contactPhone) {
          // You could add a toast notification here if you have one
          console.log('Contact imported successfully');
        }
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.name === 'SecurityError') {
        alert('Akses kontak memerlukan interaksi pengguna. Silakan coba lagi.');
      } else if (error.name === 'InvalidStateError') {
        alert('Contact picker sedang terbuka atau gagal dimuat. Silakan coba lagi.');
      } else if (error.name === 'TypeError') {
        alert('Terjadi kesalahan teknis. Browser mungkin tidak mendukung fitur ini sepenuhnya.');
      } else {
        // Most common case: user cancelled the picker
        // Don't show error for cancellation
        console.log('Contact selection cancelled or failed:', error);
      }
    } finally {
      setIsImportingContact(false);
    }
  };

  const handleBulkContactImport = async () => {
    if (!isContactPickerSupported()) {
      alert('Contact Picker tidak didukung di browser ini. Silakan gunakan Chrome di Android.');
      return;
    }

    setIsBulkImporting(true);

    try {
      const nav = navigator as any;
      const contacts: ContactInfo[] = await nav.contacts.select(['name', 'tel'], {
        multiple: true  // Enable multiple contact selection
      });

      if (contacts.length > 0) {
        // Process multiple contacts with validation and duplicate detection
        const processedContacts: Guest[] = [];
        const duplicateContacts: string[] = [];

        // Create lookup sets for existing guests
        const existingNames = new Set(guests.map(g => g.name.toLowerCase().trim()));
        const existingPhones = new Set(
          guests
            .filter(g => g.whatsappNumber)
            .map(g => g.whatsappNumber!.replace(/\s/g, ''))
        );

        contacts.forEach((contact: ContactInfo, index: number) => {
          // Handle name (take first name from array)
          let contactName = contact.name && contact.name.length > 0
            ? contact.name[0].trim()
            : '';

          // Skip contacts without names
          if (!contactName) {
            contactName = `Kontak ${index + 1}`;
          }

          // Handle phone numbers (take first tel from array)
          let contactPhone = contact.tel && contact.tel.length > 0
            ? contact.tel[0]
            : '';

          // Validate and format WhatsApp number if provided
          let formattedPhone: string | undefined = undefined;
          if (contactPhone) {
            if (validateWhatsAppNumber(contactPhone)) {
              formattedPhone = formatWhatsAppNumber(contactPhone);
            } else {
              // Skip invalid phone numbers but still add contact
              console.log(`Invalid phone number for ${contactName}: ${contactPhone}`);
            }
          }

          // Check for duplicates
          const nameKey = contactName.toLowerCase().trim();
          const phoneKey = formattedPhone ? formattedPhone.replace(/\s/g, '') : '';

          const isDuplicateName = existingNames.has(nameKey);
          const isDuplicatePhone = phoneKey && existingPhones.has(phoneKey);

          if (isDuplicateName || isDuplicatePhone) {
            duplicateContacts.push(contactName);
            return; // Skip this contact
          }

          // Create guest object
          const newGuest: Guest = {
            id: Math.random().toString(36).substring(2, 11),
            name: contactName,
            whatsappNumber: formattedPhone,
            labels: [],
            createdAt: new Date(),
            sentStatus: 'not_sent' as const,
            sentAt: undefined
          };

          // Add to processed contacts and update lookup sets
          processedContacts.push(newGuest);
          existingNames.add(nameKey);
          if (phoneKey) {
            existingPhones.add(phoneKey);
          }
        });

        if (processedContacts.length > 0) {
          // Add all contacts at once (like CSV import)
          const updatedGuests = [...guests, ...processedContacts];
          setGuests(updatedGuests);
          storageUtils.saveGuests(updatedGuests);

          // Show success message with details
          const validPhoneCount = processedContacts.filter(g => g.whatsappNumber).length;
          let message = `Berhasil mengimpor ${processedContacts.length} kontak dari daftar kontak`;

          if (validPhoneCount < processedContacts.length) {
            message += ` (${validPhoneCount} dengan nomor WhatsApp valid)`;
          }

          if (duplicateContacts.length > 0) {
            message += `\n\n${duplicateContacts.length} kontak diabaikan karena sudah ada: ${duplicateContacts.slice(0, 3).join(', ')}`;
            if (duplicateContacts.length > 3) {
              message += ` dan ${duplicateContacts.length - 3} lainnya`;
            }
          }

          alert(message);
        } else {
          let message = 'Tidak ada kontak baru yang dapat diimpor';
          if (duplicateContacts.length > 0) {
            message += `\n\nSemua ${duplicateContacts.length} kontak sudah ada dalam daftar tamu`;
          }
          alert(message);
        }
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.name === 'SecurityError') {
        alert('Akses kontak memerlukan interaksi pengguna. Silakan coba lagi.');
      } else if (error.name === 'InvalidStateError') {
        alert('Contact picker sedang terbuka atau gagal dimuat. Silakan coba lagi.');
      } else if (error.name === 'TypeError') {
        alert('Terjadi kesalahan teknis. Browser mungkin tidak mendukung fitur ini sepenuhnya.');
      } else if (error.name === 'NotAllowedError') {
        alert('Akses ke kontak ditolak. Pastikan Anda memberikan izin akses kontak.');
      } else if (error.name === 'AbortError') {
        // User cancelled - don't show error
        console.log('User cancelled contact selection');
      } else {
        // Other errors or user cancellation
        console.log('Bulk contact selection cancelled or failed:', error);
      }
    } finally {
      setIsBulkImporting(false);
    }
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
          id: Math.random().toString(36).substring(2, 11),
          name: guest.name,
          whatsappNumber: guest.whatsappNumber ? formatWhatsAppNumber(guest.whatsappNumber) : undefined,
          labels: [],
          createdAt: new Date(),
          sentStatus: 'not_sent',
          sentAt: undefined
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

  // Filter and status management functions
  const filteredGuests = guests.filter(guest => {
    // Apply status filter
    let matchesStatus = true;
    if (filter === 'sent') matchesStatus = guest.sentStatus === 'sent';
    if (filter === 'not_sent') matchesStatus = guest.sentStatus === 'not_sent';

    // Apply search filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = guest.name.toLowerCase().includes(query) ||
                     (guest.whatsappNumber?.includes(query) || false);
    }

    // Apply label filter
    let matchesLabels = true;
    if (selectedLabels.length > 0) {
      matchesLabels = selectedLabels.some(selectedLabel =>
        guest.labels?.includes(selectedLabel) || false
      );
    }

    return matchesStatus && matchesSearch && matchesLabels;
  });

  const toggleGuestStatus = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    const updatedGuests = guest.sentStatus === 'sent'
      ? storageUtils.markGuestAsNotSent(guestId)
      : storageUtils.markGuestAsSent(guestId);

    setGuests(updatedGuests);
  };

  const toggleGuestSelection = (guestId: string) => {
    const newSelection = new Set(selectedGuests);
    if (newSelection.has(guestId)) {
      newSelection.delete(guestId);
    } else {
      newSelection.add(guestId);
    }
    setSelectedGuests(newSelection);
  };

  const selectAllVisible = () => {
    const visibleGuestIds = filteredGuests.map(g => g.id);
    setSelectedGuests(new Set(visibleGuestIds));
  };

  const clearSelection = () => {
    setSelectedGuests(new Set());
  };

  const markSelectedAsSent = () => {
    if (selectedGuests.size === 0) return;
    const updatedGuests = storageUtils.markMultipleGuestsAsSent(Array.from(selectedGuests));
    setGuests(updatedGuests);
    setSelectedGuests(new Set());
  };

  const markSelectedAsNotSent = () => {
    if (selectedGuests.size === 0) return;
    const updatedGuests = storageUtils.markMultipleGuestsAsNotSent(Array.from(selectedGuests));
    setGuests(updatedGuests);
    setSelectedGuests(new Set());
  };

  // Bulk label operations
  const addLabelToSelected = (label: string) => {
    if (selectedGuests.size === 0 || !label.trim()) return;
    const updatedGuests = storageUtils.addLabelsToMultipleGuests(Array.from(selectedGuests), [label.trim()]);
    setGuests(updatedGuests);
  };

  const removeLabelFromSelected = (label: string) => {
    if (selectedGuests.size === 0) return;
    const updatedGuests = storageUtils.removeLabelsFromMultipleGuests(Array.from(selectedGuests), [label]);
    setGuests(updatedGuests);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Daftar Tamu</h2>
          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-sm">{guests.filter(g => g.sentStatus === 'sent').length}/{guests.length}</span>
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
          {isContactPickerSupported() && (
            <button
              onClick={handleBulkContactImport}
              disabled={isBulkImporting}
              className={`text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${
                isBulkImporting
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              <Users className={`w-4 h-4 ${isBulkImporting ? 'animate-pulse' : ''}`} />
              {isBulkImporting ? 'Memuat...' : 'Import dari Kontak'}
            </button>
          )}
          <button
            onClick={startCreate}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* Import Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Panduan Import Tamu</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs sm:text-sm text-blue-700 mb-1">
                  <strong>Import CSV:</strong> File harus memiliki kolom <strong>Nama</strong> (wajib) dan <strong>WhatsApp</strong> (opsional).
                </p>
                <button
                  onClick={downloadSampleCSV}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Download contoh file CSV
                </button>
              </div>
              {isContactPickerSupported() && (
                <div>
                  <p className="text-xs sm:text-sm text-blue-700">
                    <strong>Import dari Kontak:</strong> Pilih langsung dari daftar kontak di perangkat Anda.
                    Fitur ini hanya tersedia di Chrome Android.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Label Management */}
      {storageUtils.getAllLabels().length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <h4 className="font-medium text-purple-800 text-sm sm:text-base">Label Tersedia</h4>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {storageUtils.getAllLabels().length} label
              </span>
            </div>
            <button
              onClick={() => setShowLabelManager(!showLabelManager)}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              {showLabelManager ? 'Sembunyikan' : 'Kelola'}
            </button>
          </div>

          {/* Always show labels */}
          <div className="flex flex-wrap gap-2 mb-3">
            {storageUtils.getAllLabels().map(label => {
              const guestCount = guests.filter(g => g.labels?.includes(label)).length;
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition-colors"
                  onClick={() => {
                    // Toggle label filter
                    if (selectedLabels.includes(label)) {
                      setSelectedLabels(selectedLabels.filter(l => l !== label));
                    } else {
                      setSelectedLabels([...selectedLabels, label]);
                    }
                  }}
                  title={`${guestCount} tamu • Klik untuk filter`}
                >
                  <Tag className="w-3 h-3" />
                  {label}
                  <span className="text-purple-600 font-medium">({guestCount})</span>
                </span>
              );
            })}
          </div>

          {showLabelManager && (
            <div className="border-t border-purple-200 pt-3">
              <p className="text-xs text-purple-700 mb-2">
                Klik label di atas untuk memfilter tamu. Gunakan form tamu untuk menambah label baru.
              </p>
              <div className="text-xs text-purple-600">
                💡 Tips: Label membantu mengorganisir tamu berdasarkan kategori seperti Keluarga, Teman, Kerja, dll.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter - Sticky */}
      <div className="sticky top-20 z-10 bg-gray-50 p-4 rounded-lg space-y-4 shadow-sm border border-gray-200">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau nomor WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filters and Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'sent' | 'not_sent')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="all">Semua Status</option>
                <option value="not_sent">Belum Dikirim</option>
                <option value="sent">Sudah Dikirim</option>
              </select>
            </div>

            {/* Label Filter */}
            {storageUtils.getAllLabels().length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <select
                  multiple
                  value={selectedLabels}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedLabels(values);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 min-w-[120px]"
                  size={Math.min(4, storageUtils.getAllLabels().length)}
                >
                  {storageUtils.getAllLabels().map(label => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                {selectedLabels.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {selectedLabels.length} dipilih
                  </span>
                )}
              </div>
            )}

            {selectedGuests.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedGuests.size} tamu dipilih
              </div>
            )}

            {/* Active Filters Indicator */}
            {(searchQuery || filter !== 'all' || selectedLabels.length > 0) && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Filter aktif:</span>
                {searchQuery && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    "{searchQuery}"
                  </span>
                )}
                {filter !== 'all' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {filter === 'sent' ? 'Sudah Dikirim' : 'Belum Dikirim'}
                  </span>
                )}
                {selectedLabels.map(label => (
                  <span key={label} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {label}
                  </span>
                ))}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                    setSelectedLabels([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
          {filteredGuests.length > 0 && (
            <>
              <button
                onClick={selectAllVisible}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Pilih Semua
              </button>
              <button
                onClick={clearSelection}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal Pilih
              </button>
            </>
          )}

          {selectedGuests.size > 0 && (
            <>
              <button
                onClick={markSelectedAsSent}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Tandai Dikirim
              </button>
              <button
                onClick={markSelectedAsNotSent}
                className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Tandai Belum Dikirim
              </button>

              {/* Bulk Label Operations */}
              {storageUtils.getAllLabels().length > 0 && (
                <>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addLabelToSelected(e.target.value);
                        e.target.value = ''; // Reset selection
                      }
                    }}
                    className="text-xs px-2 py-1 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Tambah Label</option>
                    {storageUtils.getAllLabels().map(label => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {/* Show remove buttons for labels that exist on selected guests */}
                  {(() => {
                    const selectedGuestsList = Array.from(selectedGuests).map(id => guests.find(g => g.id === id)).filter(Boolean);
                    const commonLabels = storageUtils.getAllLabels().filter(label =>
                      selectedGuestsList.some(guest => guest?.labels?.includes(label))
                    );

                    return commonLabels.map(label => (
                      <button
                        key={label}
                        onClick={() => removeLabelFromSelected(label)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title={`Hapus label "${label}"`}
                      >
                        - {label}
                      </button>
                    ));
                  })()}
                </>
              )}
            </>
          )}
          </div>
        </div>
      </div>

      {/* Guest Form Modal */}
      <Modal
        isOpen={isCreating || editingGuest !== null}
        onClose={resetForm}
        title={editingGuest ? 'Edit Tamu' : 'Tambah Tamu Baru'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Tamu *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama tamu"
                autoFocus
              />
              {isContactPickerSupported() && !editingGuest && (
                <button
                  type="button"
                  onClick={handleContactImport}
                  disabled={isImportingContact}
                  className={`px-3 py-2 text-white rounded-lg flex items-center gap-1 transition-colors ${
                    isImportingContact
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  title={isImportingContact ? "Memuat kontak..." : "Import dari kontak"}
                >
                  <Users className={`w-4 h-4 ${isImportingContact ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">
                    {isImportingContact ? 'Memuat...' : 'Import'}
                  </span>
                </button>
              )}
            </div>
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

          {/* Labels Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>

            {/* Display existing labels */}
            {formData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.labels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new label */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                placeholder="Tambah label (contoh: Keluarga, Teman, Kerja)"
              />
              <button
                type="button"
                onClick={addLabel}
                disabled={!newLabel.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Label membantu mengorganisir dan memfilter daftar tamu
            </p>
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

      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-3">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="bg-white rounded-lg shadow-md border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedGuests.has(guest.id)}
                  onChange={() => toggleGuestSelection(guest.id)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mt-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm break-words">
                    {guest.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
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
                      <span className="text-gray-400">Tidak ada WhatsApp</span>
                    )}
                  </div>

                  {/* Labels */}
                  {guest.labels && guest.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guest.labels.map((label, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions - Always visible on mobile */}
              <div className="flex gap-2 flex-shrink-0 ml-2">
                <button
                  onClick={() => startEdit(guest)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Section */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleGuestStatus(guest.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                    guest.sentStatus === 'sent'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={guest.sentStatus === 'sent'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      guest.sentStatus === 'sent' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-xs font-medium ${
                  guest.sentStatus === 'sent' ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {guest.sentStatus === 'sent' ? 'Sudah Dikirim' : 'Belum Dikirim'}
                </span>
              </div>
              {guest.sentAt && (
                <div className="text-xs text-gray-500">
                  {new Date(guest.sentAt).toLocaleDateString('id-ID')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedGuests.size === filteredGuests.length && filteredGuests.length > 0}
                    onChange={(e) => e.target.checked ? selectAllVisible() : clearSelection()}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGuests.has(guest.id)}
                      onChange={() => toggleGuestSelection(guest.id)}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900" title={guest.name}>
                      {guest.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {guest.labels && guest.labels.length > 0 ? (
                        guest.labels.map((label, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleGuestStatus(guest.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                            guest.sentStatus === 'sent'
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={guest.sentStatus === 'sent'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              guest.sentStatus === 'sent' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${
                          guest.sentStatus === 'sent' ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {guest.sentStatus === 'sent' ? 'Dikirim' : 'Belum'}
                        </span>
                      </div>
                      {guest.sentAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(guest.sentAt).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium sticky right-0 bg-white">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(guest)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Hapus"
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

        {guests.length > 0 && filteredGuests.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Filter className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-lg">Tidak ada tamu yang sesuai dengan filter</p>
            <p className="text-xs sm:text-sm">Coba ubah filter atau tambah tamu baru</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;