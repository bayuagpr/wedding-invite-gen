import React, { useState } from 'react';
import { Download, Copy, Check, MessageCircle, WifiOff } from 'lucide-react';
import { Template, Guest } from '../types';
import { storageUtils } from '../utils/storage';
import { useNetwork } from '../contexts/NetworkContext';

interface ExportProps {
  selectedTemplate?: Template;
  selectedGuests: Set<string>;
  setSelectedGuests: (guests: Set<string>) => void;
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
}

const Export: React.FC<ExportProps> = ({
  selectedTemplate,
  selectedGuests,
  setSelectedGuests,
  guests,
  setGuests
}) => {
  const [copiedMessages, setCopiedMessages] = useState<Set<string>>(new Set());
  const [copiedAll, setCopiedAll] = useState(false);
  const { isOnline } = useNetwork();

  const generatePersonalizedMessage = (template: Template, guest: Guest): string => {
    // First replace all {nama_tamu} with the guest name
    let message = template.content.replace(/\{nama_tamu\}/g, guest.name);

    // Then find and encode guest names in URL query parameters
    // Look for URLs that contain the guest name in query parameters
    // Updated pattern to capture guest names with spaces (until backtick, newline, or end of URL)
    const urlPattern = /(https?:\/\/[^\s]+\?[^`\s]*guest=)([^`\n]+?)(?=`|\n|$)/g;
    message = message.replace(urlPattern, (match, urlPrefix, guestName) => {
      // Only encode if the guest name matches (to avoid encoding other query values)
      if (guestName === guest.name) {
        return urlPrefix + encodeURIComponent(guest.name);
      }
      return match;
    });

    return message;
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

    const allMessages = selectedGuestObjects.map(guest => {
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
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Guest selection functions
  const toggleGuestSelection = (guestId: string) => {
    const newSelection = new Set(selectedGuests);
    if (newSelection.has(guestId)) {
      newSelection.delete(guestId);
    } else {
      newSelection.add(guestId);
    }
    setSelectedGuests(newSelection);
  };

  // const selectAllGuests = () => {
  //   const allGuestIds = guests.map(g => g.id);
  //   setSelectedGuests(new Set(allGuestIds));
  // };

  // const selectUnsentGuests = () => {
  //   const unsentGuestIds = guests
  //     .filter(guest => guest.sentStatus === 'not_sent')
  //     .map(guest => guest.id);
  //   setSelectedGuests(new Set(unsentGuestIds));
  // };

  // const clearSelection = () => {
  //   setSelectedGuests(new Set());
  // };

  // const markSelectedAsSent = () => {
  //   if (selectedGuests.size === 0) return;

  //   const updatedGuests = storageUtils.markMultipleGuestsAsSent(Array.from(selectedGuests));
  //   setGuests(updatedGuests);

  //   // Update selection to exclude newly marked guests
  //   const remainingUnsentIds = updatedGuests
  //     .filter(guest => guest.sentStatus === 'not_sent')
  //     .map(guest => guest.id);
  //   setSelectedGuests(new Set(remainingUnsentIds));
  // };

  // Get only selected guests for display
  const selectedGuestObjects = guests.filter(guest => selectedGuests.has(guest.id));

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

  // const guestsWithWhatsApp = guests.filter(guest => guest.whatsappNumber);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Export Pesan</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          Template: <span className="font-medium">{selectedTemplate.name}</span>
        </div>
      </div>

      {/* Guest Selection Controls */}
      {/* <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{selectedGuests.size}</span> dari <span className="font-medium">{guests.length}</span> tamu dipilih
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAllGuests}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Pilih Semua
            </button>
            <button
              onClick={selectUnsentGuests}
              className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Pilih Belum Dikirim
            </button>
            <button
              onClick={clearSelection}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal Pilih
            </button>
            {selectedGuests.size > 0 && (
              <button
                onClick={markSelectedAsSent}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                Tandai {selectedGuests.size} Tamu Sebagai Dikirim
              </button>
            )}
          </div>
        </div>
      </div> */}

      {/* Bulk Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Aksi Massal</h3>
        {selectedGuests.size === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Pilih tamu terlebih dahulu untuk menggunakan aksi massal</p>
          </div>
        ) : (
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
                Salin {selectedGuests.size} Pesan
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
        )}
      </div>

      {/* Individual Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Pesan Individual ({selectedGuestObjects.length})</h3>
          {selectedGuestObjects.length === 0 && (
            <p className="text-sm text-gray-500">Pilih tamu untuk melihat pesan</p>
          )}
        </div>

        {selectedGuestObjects.map((guest) => {
          const personalizedMessage = generatePersonalizedMessage(selectedTemplate, guest);

          return (
            <div key={guest.id} className="bg-white rounded-lg shadow-md border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedGuests.has(guest.id)}
                      onChange={() => toggleGuestSelection(guest.id)}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base break-words">{guest.name}</h4>
                      {guest.whatsappNumber && (
                        <p className="text-xs sm:text-sm text-emerald-600 break-all">{guest.whatsappNumber}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updatedGuests = guest.sentStatus === 'sent'
                                ? storageUtils.markGuestAsNotSent(guest.id)
                                : storageUtils.markGuestAsSent(guest.id);
                              setGuests(updatedGuests);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              guest.sentStatus === 'sent'
                                ? 'bg-green-500 focus:ring-green-500'
                                : 'bg-gray-300 focus:ring-gray-500'
                            }`}
                            role="switch"
                            aria-checked={guest.sentStatus === 'sent'}
                            title={guest.sentStatus === 'sent' ? 'Tandai sebagai belum dikirim' : 'Tandai sebagai sudah dikirim'}
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
                            {guest.sentStatus === 'sent' ? '✅ Dikirim' : '⏳ Belum Dikirim'}
                          </span>
                        </div>
                        {guest.sentAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(guest.sentAt).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {guest.whatsappNumber && (
                      <button
                        onClick={() => isOnline ? openWhatsApp(guest, personalizedMessage) : null}
                        disabled={!isOnline}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm ${
                          isOnline
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        title={!isOnline ? 'WhatsApp tidak tersedia saat offline' : 'Kirim via WhatsApp'}
                      >
                        {isOnline ? <MessageCircle className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                        WhatsApp {!isOnline && '(Offline)'}
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