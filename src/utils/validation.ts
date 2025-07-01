export const validateWhatsAppNumber = (number: string): boolean => {
  if (!number.trim()) return true; // Optional field
  
  // Indonesian WhatsApp number validation
  // Accepts formats: 08xx, +628xx, 628xx
  const cleanNumber = number.replace(/[\s-]/g, '');
  const indonesianWhatsAppRegex = /^(\+?628|08)\d{8,12}$/;
  
  return indonesianWhatsAppRegex.test(cleanNumber);
};

export const formatWhatsAppNumber = (number: string): string => {
  if (!number.trim()) return '';
  
  const cleanNumber = number.replace(/[\s-]/g, '');
  
  // Convert to standard format (+628...)
  if (cleanNumber.startsWith('08')) {
    return '+62' + cleanNumber.substring(1);
  } else if (cleanNumber.startsWith('628')) {
    return '+' + cleanNumber;
  } else if (cleanNumber.startsWith('+628')) {
    return cleanNumber;
  }
  
  return cleanNumber;
};

export const parseCSV = (csvText: string): { name: string; whatsappNumber?: string }[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  const nameIndex = headers.findIndex(h => h.includes('nama') || h.includes('name'));
  const phoneIndex = headers.findIndex(h => h.includes('whatsapp') || h.includes('wa') || h.includes('phone') || h.includes('telepon'));
  
  if (nameIndex === -1) {
    throw new Error('Kolom nama tidak ditemukan. Pastikan CSV memiliki kolom "Nama" atau "Name".');
  }
  
  const guests = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(c => c.trim());
    if (columns[nameIndex]) {
      const guest: { name: string; whatsappNumber?: string } = {
        name: columns[nameIndex]
      };
      
      if (phoneIndex !== -1 && columns[phoneIndex]) {
        guest.whatsappNumber = columns[phoneIndex];
      }
      
      guests.push(guest);
    }
  }
  
  return guests;
};

// Contact Picker API feature detection
export const isContactPickerSupported = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  try {
    const nav = navigator as any;
    return nav.contacts && typeof nav.contacts.select === 'function';
  } catch {
    return false;
  }
};