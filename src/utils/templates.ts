import { Template } from '../types';

export const defaultTemplates: Omit<Template, 'id' | 'createdAt'>[] = [
  {
    name: 'Template Formal 1',
    type: 'formal',
    content: `_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Kepada Yth. Bapak/Ibu/Sdr *{nama_tamu}*

Dengan penuh rasa syukur atas rahmat dan karunia Allah SWT, kami bermaksud mengundang Bapak/Ibu/Sdr untuk menghadiri pernikahan putra/putri kami

*Putri Shahya Maharani* & *Bayu Agung Prakoso*

yang akan dilaksanakan pada

*Hari/Tanggal* : *Minggu, 13 Juli 2025*
*Waktu* : *11.00 - 13.30 WIB*
*Lokasi* : *Harmony Banquet Halls Yasmin, Bogor*

💌 _Informasi selengkapnya dapat di akses melalui_ :
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Sdr berkenan hadir dan turut mendoakan keberkahan bagi kedua mempelai.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_

Hormat kami,
*Irwan Suhenrawan & Eti Nurhayati*
*#BAYUakhirnyaSAHYA*`
  },
  {
    name: 'Template Formal 2',
    type: 'formal',
    content: `_Bismillahirrahmanirrahim_

Kepada Yth.
*{nama_tamu}*

Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara sakral pernikahan:

*Putri Shahya Maharani* & *Bayu Agung Prakoso*

*[Hari & Tanggal]*
*[Waktu]*
*[Tempat]*
*[Alamat Lengkap]*

💌 _Informasi selengkapnya_:
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

Tanpa mengurangi rasa hormat, kami memohon kehadiran Bapak/Ibu/Saudara/i untuk menjadi saksi dan memberikan doa restu atas pernikahan kami.

_Jazakumullahu khairan katsiran._

Hormat kami,
*Kedua Mempelai & Keluarga*
*#BAYUakhirnyaSAHYA*`
  },
  {
    name: 'Template Informal 1',
    type: 'informal',
    content: `Halo *{nama_tamu}*! 👋

_Kabar bahagia nih!_ Kami dengan senang hati mengundang kamu untuk hadir di pernikahan:

*Putri Shahya Maharani* & *Bayu Agung Prakoso*

*Save the date ya:*
*Tanggal*: [Tanggal]
*Waktu*: [Waktu]
*Tempat*: [Tempat]

💌 _Info lengkap_:
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

Kehadiran kamu akan sangat berarti buat kami. _Gak sabar ketemu dan berbagi kebahagiaan bareng!_

Terima kasih sebelumnya ya! 🙏

_With love,_
*Putri & Bayu*
*#BAYUakhirnyaSAHYA*`
  },
  {
    name: 'Template Informal 2',
    type: 'informal',
    content: `Hi *{nama_tamu}*! 👋

_Big news!_ Kami mengundang kamu untuk celebrate our special day:

*Putri Shahya Maharani* & *Bayu Agung Prakoso* Wedding 💕

*Details:*
*[Hari, Tanggal]*
*[Waktu]*
*[Venue]*
*[Alamat]*

💌 _Digital invitation_:
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

_Can't wait to share this magical moment with you!_ Your presence would mean the world to us ✨

RSVP and see you there! 🎉

_Love & hugs,_
*P & B*
*#BAYUakhirnyaSAHYA*`
  },
  {
    name: 'Template Singkat',
    type: 'informal',
    content: `*{nama_tamu}*, kamu diundang! 💌

*Putri Shahya Maharani* & *Bayu Agung Prakoso* Wedding
*[Tanggal] [Waktu]*
*[Tempat]*

_Info lengkap_:
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

_Datang ya!_ 🎉

*#BAYUakhirnyaSAHYA*`
  },
  {
    name: 'Template dengan Emoji',
    type: 'informal',
    content: `Halo *{nama_tamu}*! 👋

💕 _Kabar bahagia nih!_ Kami dengan senang hati mengundang kamu untuk hadir di pernikahan:

👰 *Putri Shahya Maharani* & 🤵 *Bayu Agung Prakoso*

✨ *Save the date ya:*
📅 *Tanggal*: [Tanggal]
⏰ *Waktu*: [Waktu]
📍 *Tempat*: [Tempat]

🌐 _Digital invitation_:
\`http://bayu-dan-shahya-menikah.netlify.app/?guest={nama_tamu}\`

💝 Kehadiran kamu akan sangat berarti buat kami. _Gak sabar ketemu dan berbagi kebahagiaan bareng!_

🙏 Terima kasih sebelumnya ya!

💌 _With love,_
*Putri & Bayu* 💕
*#BAYUakhirnyaSAHYA*`
  }
];