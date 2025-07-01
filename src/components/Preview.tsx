import React, { useState } from 'react';
import { Eye, FileText, Users } from 'lucide-react';
import { Template, Guest } from '../types';

interface PreviewProps {
  selectedTemplate?: Template;
  selectedGuests: Set<string>;
  guests: Guest[];
}

const Preview: React.FC<PreviewProps> = ({
  selectedTemplate,
  selectedGuests,
  guests
}) => {
  const [previewGuest, setPreviewGuest] = useState<Guest | null>(null);

  // Get only selected guests for display
  const selectedGuestObjects = guests.filter(guest => selectedGuests.has(guest.id));

  // Set default preview guest when selected guests change
  React.useEffect(() => {
    if (selectedGuestObjects.length > 0 && !previewGuest) {
      setPreviewGuest(selectedGuestObjects[0]);
    } else if (selectedGuestObjects.length === 0) {
      setPreviewGuest(null);
    } else if (previewGuest && !selectedGuests.has(previewGuest.id)) {
      // If current preview guest is no longer selected, switch to first selected guest
      setPreviewGuest(selectedGuestObjects[0]);
    }
  }, [selectedGuestObjects, previewGuest, selectedGuests]);

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

  if (!selectedTemplate) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Pesan</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm sm:text-base">Pilih template terlebih dahulu di tab Template untuk melihat preview pesan</p>
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
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <p className="text-blue-800 text-sm sm:text-base">Tambahkan tamu terlebih dahulu di tab Tamu untuk melihat preview pesan</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGuestObjects.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Pesan</h2>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <p className="text-orange-800 text-sm sm:text-base">Pilih tamu untuk melihat preview pesan mereka</p>
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

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-semibold">Preview Pesan Terpersonalisasi</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Pilih tamu untuk melihat bagaimana pesan akan terlihat</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-4 p-4">
          {/* Guest Selection for Preview */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold mb-3">Pilih Tamu untuk Preview ({selectedGuestObjects.length} terpilih)</h4>
            <div className="space-y-3">
              <select
                value={previewGuest?.id || ''}
                onChange={(e) => {
                  const selectedGuest = selectedGuestObjects.find(guest => guest.id === e.target.value);
                  setPreviewGuest(selectedGuest || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
              >
                <option value="">-- Pilih Tamu --</option>
                {selectedGuestObjects.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.name} {guest.whatsappNumber ? `(${guest.whatsappNumber})` : ''} - {guest.sentStatus === 'sent' ? '✅ Dikirim' : '⏳ Belum Dikirim'}
                  </option>
                ))}
              </select>
              
              {previewGuest && (
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Nama:</span> {previewGuest.name}</div>
                    {previewGuest.whatsappNumber && (
                      <div><span className="font-medium">WhatsApp:</span> {previewGuest.whatsappNumber}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        previewGuest.sentStatus === 'sent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {previewGuest.sentStatus === 'sent' ? '✅ Dikirim' : '⏳ Belum Dikirim'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Preview */}
          <div className="lg:col-span-2">
            {previewGuest && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-semibold">Preview untuk {previewGuest.name}</h4>
                    {previewGuest.sentAt && (
                      <span className="text-xs text-gray-500">
                        Dikirim: {new Date(previewGuest.sentAt).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-rose-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Pesan yang akan dikirim:</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 bg-white p-4 rounded border">
                    {generatePersonalizedMessage(selectedTemplate, previewGuest)}
                  </div>
                </div>

                {/* Guest Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Detail Tamu:</h5>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div><span className="font-medium">Nama:</span> {previewGuest.name}</div>
                    {previewGuest.whatsappNumber && (
                      <div><span className="font-medium">WhatsApp:</span> {previewGuest.whatsappNumber}</div>
                    )}
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        previewGuest.sentStatus === 'sent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {previewGuest.sentStatus === 'sent' ? '✅ Sudah Dikirim' : '⏳ Belum Dikirim'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{selectedGuestObjects.length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Tamu Terpilih</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{selectedGuestObjects.filter(g => g.sentStatus === 'sent').length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Sudah Dikirim</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{selectedGuestObjects.filter(g => g.sentStatus === 'not_sent').length}</p>
              <p className="text-gray-600 text-sm sm:text-base">Belum Dikirim</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm">⏳</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
