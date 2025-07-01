import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, MessageCircle, FileText } from 'lucide-react';
import { Template, Guest } from '../types';
import { storageUtils } from '../utils/storage';

interface ExportProps {
  selectedTemplate?: Template;
}

const Export: React.FC<ExportProps> = ({ selectedTemplate }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [copiedMessages, setCopiedMessages] = useState<Set<string>>(new Set());
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    const guests = storageUtils.getGuests();
    setGuests(guests);
  }, []);

  const generatePersonalizedMessage = (template: Template, guest: Guest): string => {
    return template.content.replace(/\{nama_tamu\}/g, guest.name);
  };

  const copyToClipboard = async (text: string, guestId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessages(prev => new Set([...prev, guestId]));
      setTimeout(() => {
        setCopiedMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(guestId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Gagal menyalin pesan. Silakan coba lagi.');
    }
  };

  const copyAllMessages = async () => {
    if (!selectedTemplate) return;

    const allMessages = guests.map(guest => {
      const message = generatePersonalizedMessage(selectedTemplate, guest);
      return `=== ${guest.name} ===\n${message}\n${'='.repeat(50)}\n`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(allMessages);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all messages: ', err);
      alert('Gagal menyalin semua pesan. Silakan coba lagi.');
    }
  };

  const downloadAsText = () => {
    if (!selectedTemplate) return;

    const allMessages = guests.map(guest => {
      const message = generatePersonalizedMessage(selectedTemplate, guest);
      return `=== ${guest.name} ===\n${message}\n${'='.repeat(50)}\n`;
    }).join('\n');

    const blob = new Blob([allMessages], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `undangan-${selectedTemplate.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openWhatsApp = (guest: Guest, message: string) => {
    if (!guest.whatsappNumber) {
      alert('Nomor WhatsApp tidak tersedia untuk tamu ini');
      return;
    }

    const phoneNumber = guest.whatsappNumber.replace('+', '');
    // Keep emojis in the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!selectedTemplate) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Export Pesan</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm sm:text-base">Pilih template terlebih dahulu di tab Template untuk mengexport pesan</p>
          </div>
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Export Pesan</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <p className="text-blue-800 text-sm sm:text-base">Tambahkan tamu terlebih dahulu di tab Tamu untuk mengexport pesan</p>
          </div>
        </div>
      </div>
    );
  }

  const guestsWithWhatsApp = guests.filter(guest => guest.whatsappNumber);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Export Pesan</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          Template: <span className="font-medium">{selectedTemplate.name}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{guests.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Total Tamu</p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{guestsWithWhatsApp.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Dengan WhatsApp</p>
            </div>
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{guests.length - guestsWithWhatsApp.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Tanpa WhatsApp</p>
            </div>
            <Copy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Aksi Massal</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyAllMessages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                Semua Tersalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Salin Semua Pesan
              </>
            )}
          </button>
          
          <button
            onClick={downloadAsText}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download sebagai File
          </button>
        </div>
      </div>

      {/* Individual Messages */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Pesan Individual</h3>
        
        {guests.map((guest) => {
          const personalizedMessage = generatePersonalizedMessage(selectedTemplate, guest);
          
          return (
            <div key={guest.id} className="bg-white rounded-lg shadow-md border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base break-words">{guest.name}</h4>
                    {guest.whatsappNumber && (
                      <p className="text-xs sm:text-sm text-emerald-600 break-all">{guest.whatsappNumber}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    {guest.whatsappNumber && (
                      <button
                        onClick={() => openWhatsApp(guest, personalizedMessage)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(personalizedMessage, guest.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm"
                    >
                      {copiedMessages.has(guest.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Salin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 font-sans leading-relaxed">
                    {personalizedMessage}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Export;