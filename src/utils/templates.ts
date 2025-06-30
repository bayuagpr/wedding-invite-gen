import { Template } from '../types';

export const defaultTemplates: Omit<Template, 'id' | 'createdAt'>[] = [
  {
    name: 'Template Formal 1',
    type: 'formal',
    content: `Assalamu'alaikum Wr. Wb.

Yang terhormat {nama_tamu},

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan putra-putri kami:

Bayu & Shahya

Yang akan diselenggarakan pada:

Hari, Tanggal: [Isi tanggal acara]
Waktu: [Isi waktu acara]
Tempat: [Isi lokasi acara]
Lokasi: [Link Google Maps]

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Wr. Wb.

Keluarga Besar
Bayu & Shahya`
  },
  {
    name: 'Template Formal 2',
    type: 'formal',
    content: `Bismillahirrahmanirrahim

Kepada Yth.
{nama_tamu}

Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara sakral pernikahan:

Bayu & Shahya

[Hari & Tanggal]
[Waktu]
[Tempat]
[Alamat Lengkap]
[Link Lokasi]

Tanpa mengurangi rasa hormat, kami memohon kehadiran Bapak/Ibu/Saudara/i untuk menjadi saksi dan memberikan doa restu atas pernikahan kami.

Jazakumullahu khairan katsiran.

Hormat kami,
Kedua Mempelai & Keluarga`
  },
  {
    name: 'Template Informal 1',
    type: 'informal',
    content: `Halo {nama_tamu}!

Kabar bahagia nih! Kami dengan senang hati mengundang kamu untuk hadir di pernikahan:

Bayu & Shahya

Save the date ya:
Tanggal: [Tanggal]
Waktu: [Waktu]
Tempat: [Tempat]
Lokasi: [Link Lokasi]

Kehadiran kamu akan sangat berarti buat kami. Gak sabar ketemu dan berbagi kebahagiaan bareng!

Terima kasih sebelumnya ya!

With love,
Bayu & Shahya`
  },
  {
    name: 'Template Informal 2',
    type: 'informal',
    content: `Hi {nama_tamu}!

Big news! Kami mengundang kamu untuk celebrate our special day:

Bayu & Shahya Wedding

Details:
[Hari, Tanggal]
[Waktu]
[Venue]
[Alamat]
[Maps Link]

Can't wait to share this magical moment with you! Your presence would mean the world to us

RSVP and see you there! 

Love & hugs,
B & S`
  },
  {
    name: 'Template Singkat',
    type: 'informal',
    content: `{nama_tamu}, kamu diundang!

Bayu & Shahya Wedding
[Tanggal] [Waktu]
[Tempat]
[Link]

Datang ya!

#BayuShahyaWedding`
  }
];