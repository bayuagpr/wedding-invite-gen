import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft } from 'lucide-react';

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const goNext = () => step < totalSteps && setStep(step + 1);
  const goBack = () => step > 1 && setStep(step - 1);

  const stepIcons = ['🚀', '📋', '⚡', '✨'];
  const stepColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  const steps = [
    {
      title: '🌟 Buka Aplikasi',
      content: [
        'Buka tautan aplikasi menggunakan Google Chrome di HP Android Anda.',
        'Ini penting agar semua fitur berjalan dengan baik, termasuk akses kontak.'
      ],
      bg: 'linear-gradient(135deg, #FEF7CD, #FBBF24)',
      border: '#F59E0B',
      text: '#92400E'
    },
    {
      title: '🔍 Masuk ke Menu',
      content: [
        'Ketuk ikon tiga garis di pojok kiri atas layar.',
        'Setelah itu akan muncul halaman panduan langkah demi langkah.'
      ],
      bg: 'linear-gradient(135deg, #DBEAFE, #3B82F6)',
      border: '#2563EB',
      text: '#1E40AF'
    },
    {
      title: '⚡ Langkah-Langkah Penggunaan',
      content: null
    },
    {
      title: '✅ Tandai Undangan yang Sudah Dikirim',
      content: [
        'Setelah mengirim pesan, kembali ke bagian Tamu.',
        'Geser tombol di samping nama tamu ke posisi "Sudah Dikirim".',
        'Ini memudahkan Anda melacak siapa saja yang sudah menerima undangan.'
      ],
      bg: 'linear-gradient(135deg, #D1FAE5, #10B981)',
      border: '#059669',
      text: '#065F46'
    }
  ];

  const tips = [
    '🔄 Gunakan Chrome versi terbaru agar semua fitur bekerja dengan baik',
    '💾 Jangan hapus data browser agar daftar tamu tetap tersimpan',
    '🏷️ Anda bisa memberi label pada tamu (contoh: "Keluarga", "Teman", dll.) untuk pengelompokan',
    '🤝 Bila bingung, silakan minta bantuan keluarga atau panitia lainnya'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 sm:p-3 rounded-lg">
                <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Panduan Penggunaan
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Bantuan dan tutorial aplikasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-md mx-auto p-4 md:p-8 font-sans">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((num, idx) => (
                <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${num <= step ? 'text-white' : 'text-gray-400'}`} style={{ backgroundColor: num <= step ? stepColors[idx] : '#E5E7EB' }}>
                  {num <= step ? stepIcons[idx] : num}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-300 rounded">
              <div className="h-full rounded transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${stepColors[0]}, ${stepColors[Math.min(step - 1, 3)]})` }} />
            </div>
          </div>

          <div className={`relative border-2 rounded-2xl p-6 mb-6`} style={{ borderColor: stepColors[step - 1] }}>
            <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${stepColors[step - 1]}, ${stepColors[Math.min(step, 3)]})` }} />

            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{stepIcons[step - 1]}</span>
              <h3 className="text-xl font-bold" style={{ color: stepColors[step - 1] }}>
                Langkah {step} dari {totalSteps}
              </h3>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <button onClick={goBack} disabled={step === 1} className={`py-3 px-6 text-white font-semibold rounded-lg transition-transform duration-300 ${step === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
                ⏮ Sebelumnya
              </button>
              <button onClick={goNext} disabled={step === totalSteps} className={`py-3 px-6 text-white font-semibold rounded-lg transition-transform duration-300 ${step === totalSteps ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                Selanjutnya ⏭
              </button>
            </div>

            {/* Step Content */}
            {step < 3 ? (
              <div style={{ background: steps[step - 1].bg, borderColor: steps[step - 1].border }} className="rounded-xl border-2 p-4">
                <div className="space-y-2">
                  {steps[step - 1].content?.map((text, idx) => (
                    <p key={idx} className="text-base font-medium" style={{ color: steps[step - 1].text }}>
                      • {text}
                    </p>
                  ))}
                </div>
              </div>
            ) : step === 3 ? (
              <div className="space-y-4">
                {[{
                  icon: '✉️',
                  title: '1. Pilih Template Pesan',
                  items: [
                    'Anda akan melihat beberapa pilihan isi pesan undangan (formal dan informal).',
                    'Pratinjau teks pesan langsung terlihat di layar.',
                    'Pilih salah satu dengan menekan tombol Pilih Template.',
                    'Teks pesan ini bisa diedit nanti sesuai keperluan.'
                  ],
                  color: '#EC4899'
                }, {
                  icon: '🧑‍🤝‍🧑',
                  title: '2. Tambah Tamu',
                  desc: 'Masuk ke bagian Tamu melalui menu utama untuk menambahkan daftar tamu.',
                  subTitle: 'Ada dua cara yang bisa Anda gunakan:',
                  hasSubItems: true,
                  subItems: [
                    {
                      subtitle: '✅ Cara 1 – Tambah Manual',
                      steps: [
                        'Tekan tombol Tambah Tamu.',
                        'Isi Nama Tamu dan Nomor WhatsApp (jika ada).',
                        'Untuk mempercepat, tekan ikon orang di samping kolom nama untuk memilih dari kontak HP.',
                        'Tekan Simpan.'
                      ]
                    },
                    {
                      subtitle: '✅ Cara 2 – Import dari Kontak (Tambah Banyak Sekaligus)',
                      steps: [
                        'Masih di bagian Tamu, tekan tombol Import dari Kontak.',
                        'Pilih beberapa nama dari daftar kontak HP Anda.',
                        'Nomor WhatsApp akan otomatis terisi.',
                        '📌 Catatan: Fitur ini hanya tersedia di Google Chrome Android dan memerlukan izin akses kontak.'
                      ]
                    }
                  ],
                  color: '#8B5CF6'
                }, {
                  icon: '☑️',
                  title: '3. Pilih Tamu yang Akan Dikirimi Undangan',
                  items: [
                    'Masih di bagian Tamu, centang nama-nama tamu yang ingin dikirimi undangan.',
                    'Tamu yang dicentang akan muncul di bagian Kirim.'
                  ],
                  color: '#06B6D4'
                }, {
                  icon: '📤',
                  title: '4. Kirim Undangan',
                  items: [
                    'Masuk ke bagian Kirim melalui menu utama.',
                    'Daftar tamu yang sudah dicentang akan muncul otomatis.',
                    'Pratinjau pesan akan muncul untuk masing-masing tamu.',
                    'Tekan tombol WhatsApp di samping nama.',
                    'WhatsApp akan terbuka otomatis → tinggal tekan Kirim.'
                  ],
                  color: '#10B981'
                }].map((item, idx) => (
                  <div key={idx} className="rounded-xl border-2 p-4 shadow-sm" style={{ borderColor: item.color }}>
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-3">{item.icon}</span>
                      <h5 className="font-semibold text-lg" style={{ color: item.color }}>{item.title}</h5>
                    </div>

                    {item.desc && (
                      <p className="text-gray-700 text-base mb-2">{item.desc}</p>
                    )}

                    {item.subTitle && (
                      <p className="text-gray-700 text-base font-medium mb-2">{item.subTitle}</p>
                    )}

                    {item.items && (
                      <div className="space-y-1">
                        {item.items.map((text, i) => (
                          <p key={i} className="text-gray-700 text-sm ml-2">• {text}</p>
                        ))}
                      </div>
                    )}

                    {item.hasSubItems && item.subItems && (
                      <div className="space-y-3">
                        {item.subItems.map((subItem, i) => (
                          <div key={i} className="ml-2">
                            <p className="font-medium text-gray-800 text-sm mb-1">{subItem.subtitle}</p>
                            <div className="space-y-1 ml-3">
                              {subItem.steps.map((step, j) => (
                                <p key={j} className="text-gray-700 text-sm">• {step}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="rounded-xl border-2 p-4 mb-6" style={{ background: steps[3].bg, borderColor: steps[3].border }}>
                  <div className="space-y-2">
                    {steps[3].content?.map((text, idx) => (
                      <p key={idx} className="text-base font-medium" style={{ color: steps[3].text }}>
                        • {text}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-purple-700 font-semibold text-lg mb-2">💡 Tips Tambahan</h5>
                  <div className="space-y-2">
                    {tips.map((tip, idx) => (
                      <div key={idx} className="bg-purple-100 border border-purple-200 rounded-md p-3 text-purple-900 text-sm font-medium">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button onClick={goBack} disabled={step === 1} className={`py-3 px-6 text-white font-semibold rounded-lg transition-transform duration-300 ${step === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
              ⏮ Sebelumnya
            </button>
            <button onClick={goNext} disabled={step === totalSteps} className={`py-3 px-6 text-white font-semibold rounded-lg transition-transform duration-300 ${step === totalSteps ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
              Selanjutnya ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
