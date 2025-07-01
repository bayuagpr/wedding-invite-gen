import React, { useState, useEffect } from 'react';
import { Eye, Copy, Check, MessageCircle } from 'lucide-react';
import { Template, Guest } from '../types';
import { storageUtils } from '../utils/storage';

interface PreviewProps {
  selectedTemplate?: Template;
}

const Preview: React.FC<PreviewProps> = ({ selectedTemplate }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [copiedMessages, setCopiedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const guests = storageUtils.getGuests();
    setGuests(guests);
    if (guests.length > 0 && !selectedGuest) {
      setSelectedGuest(guests[0]);
    }
  }, []);

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

  if (!selectedTemplate) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Pesan</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm sm:text-base">Pilih template terlebih dahulu di tab Template untuk melihat preview</p>
          </div>
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Pesan</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <p className="text-blue-800 text-sm sm:text-base">Tambahkan tamu terlebih dahulu di tab Tamu untuk melihat preview pesan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Pesan</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          Template: <span className="font-medium">{selectedTemplate.name}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Guest Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Pilih Tamu</h3>
          <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
            {guests.map((guest) => (
              <button
                key={guest.id}
                onClick={() => setSelectedGuest(guest)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedGuest?.id === guest.id
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm sm:text-base break-words">{guest.name}</div>
                {guest.whatsappNumber && (
                  <div className="text-xs sm:text-sm text-gray-600 break-all">{guest.whatsappNumber}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="lg:col-span-2">
          {selectedGuest && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-base sm:text-lg font-semibold">Preview untuk {selectedGuest.name}</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedGuest.whatsappNumber && (
                    <button
                      onClick={() => openWhatsApp(selectedGuest, generatePersonalizedMessage(selectedTemplate, selectedGuest))}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Kirim via WhatsApp
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(generatePersonalizedMessage(selectedTemplate, selectedGuest), selectedGuest.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    {copiedMessages.has(selectedGuest.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Salin Pesan
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 font-sans leading-relaxed">
                    {generatePersonalizedMessage(selectedTemplate, selectedGuest)}
                  </pre>
                </div>
              </div>

              {!selectedGuest.whatsappNumber && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <p className="text-yellow-800 text-xs sm:text-sm">
                    ⚠️ Nomor WhatsApp tidak tersedia untuk tamu ini. Anda hanya bisa menyalin pesan.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;