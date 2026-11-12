# DrinkWell 💧

**DrinkWell** adalah ekstensi Chrome untuk mengingatkanmu minum air secara teratur sekaligus mencatat asupan cairan harian. Ringan, tanpa akun, dan seluruh data disimpan secara lokal di browser.

<p align="center">
  <img src="icons/icon128.png" alt="Ikon DrinkWell" width="96" height="96">
</p>

## Fitur

- ⏰ **Pengingat otomatis** setiap 15, 20, 30, atau 60 menit — selaras dengan jam dinding (mis. :00 dan :30).
- 🔔 **Notifikasi interaktif** dengan tombol **“Sudah minum”** dan **“Ingatkan 10 menit lagi”** (snooze).
- 🥤 **Pencatat asupan** satu klik per gelas, lengkap dengan tombol batalkan gelas terakhir.
- 📊 **Progres visual** berbentuk gelas berisi air dan badge persentase pada ikon ekstensi.
- 🗓️ **Riwayat mingguan** (Senin–Minggu) untuk melihat konsistensi minum.
- 🌙 **Mode gelap/terang** yang bisa mengikuti sistem atau diatur manual.
- 🌐 **Dua bahasa** — Indonesia dan English, bisa diganti lewat tombol bahasa di popup.
- 🕕 **Jam aktif** — pengingat hanya muncul antara jam bangun dan jam tidur.
- 🔒 **Privasi penuh** — tanpa server, tanpa pelacakan, data tersimpan di `chrome.storage.local`.

## Instalasi

Ekstensi ini belum dipublikasikan di Chrome Web Store, jadi dipasang secara manual (unpacked):

1. Unduh/clone repositori ini.
   ```bash
   git clone https://github.com/AvisDelphi/DrinkWell.git
   ```
2. Buka `chrome://extensions` di Chrome (atau browser berbasis Chromium seperti Edge/Brave).
3. Aktifkan **Developer mode** di pojok kanan atas.
4. Klik **Load unpacked**, lalu pilih folder `DrinkWell`.
5. Ikon DrinkWell akan muncul di toolbar. Sematkan (pin) agar mudah diakses.

## Cara Pakai

| Aksi | Cara |
| --- | --- |
| Mencatat minum | Klik ikon ekstensi → **+ Minum 1 gelas** |
| Membatalkan catatan terakhir | Klik **Batalkan gelas terakhir** |
| Menyalakan/mematikan pengingat | Toggle di kanan atas popup |
| Mengubah tema | Tombol bulan/matahari di kanan atas |
| Mengubah bahasa | Tombol **ID/EN** di kanan atas |
| Mengatur target & interval | Buka bagian **Pengaturan** di popup |
| Mencoba notifikasi | **Pengaturan** → **Tes notifikasi** |

### Pengaturan yang tersedia

| Pengaturan | Default | Keterangan |
| --- | --- | --- |
| Target harian | `2100 ml` | Sasaran asupan air per hari (500–6000 ml) |
| Isi 1 gelas | `250 ml` | Ukuran gelas yang dipakai saat mencatat (50–1000 ml) |
| Interval pengingat | `30 menit` | 15, 20, 30, atau 60 menit |
| Tampilan | `Ikuti sistem` | Auto, terang, atau gelap |
| Bahasa | `Indonesia` | Indonesia atau English |
| Jam bangun | `06:00` | Awal jam aktif pengingat |
| Jam tidur | `22:00` | Akhir jam aktif pengingat |

> Pengingat berikutnya selalu jatuh di menit bulat sesuai interval. Mencatat minum **tidak** mengubah jadwal pengingat. Riwayat disimpan maksimal 60 hari terakhir.

## Struktur Proyek

```
drinkwell/
├── manifest.json     # Manifest V3: izin, service worker, ikon
├── background.js     # Service worker: alarm, notifikasi, badge
├── common.js         # Logika bersama: state, pengaturan, riwayat
├── popup.html        # Markup popup ekstensi
├── popup.js          # Interaksi popup: render, aksi, pengaturan
├── popup.css         # Tampilan popup (tema terang & gelap)
├── theme.js          # Terapkan tema lebih awal agar tidak berkedip
├── i18n.js           # Helper bahasa: pilih kamus & terapkan ke DOM
├── locales/
│   ├── id.js         # Teks bahasa Indonesia
│   └── en.js         # Teks bahasa Inggris
└── icons/            # Ikon 16, 32, 48, dan 128 px
```

## Teknis

- **Manifest V3** dengan service worker (`background.js`).
- `chrome.alarms` untuk penjadwalan pengingat yang tahan terhadap service worker yang di-suspend.
- `chrome.notifications` untuk notifikasi dengan tombol aksi.
- `chrome.storage.local` untuk pengaturan dan log asupan harian.
- Tanpa dependency, tanpa build step — cukup file statis.

### Izin yang digunakan

| Izin | Alasan |
| --- | --- |
| `alarms` | Menjadwalkan pengingat berkala |
| `notifications` | Menampilkan notifikasi minum |
| `storage` | Menyimpan pengaturan dan riwayat asupan |

## Kontribusi

Saran dan perbaikan sangat diterima:

1. Fork repositori ini.
2. Buat branch baru: `git checkout -b fitur/nama-fitur`.
3. Commit perubahan: `git commit -m "Tambah fitur ..."`.
4. Push: `git push origin fitur/nama-fitur`.
5. Buka Pull Request.

## Lisensi

Dirilis di bawah lisensi [MIT](LICENSE).
