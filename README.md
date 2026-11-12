# DrinkWell 💧

<p align="center">
  <img src="icons/icon128.png" alt="DrinkWell icon" width="96" height="96">
</p>

<p align="center">
  <a href="#english">English</a> · <a href="#bahasa-indonesia">Bahasa Indonesia</a>
</p>

## English

**DrinkWell** is a Chrome extension that reminds you to drink water regularly and tracks your daily fluid intake. Lightweight, no account needed, and all data is stored locally in your browser.

### Features

- ⏰ **Automatic reminders** every 15, 20, 30, or 60 minutes — aligned to the clock (e.g. :00 and :30).
- 🔔 **Interactive notifications** with **“I drank”** and **“Remind me in 10 minutes”** (snooze) buttons.
- 🥤 **One-click intake logging** per glass, with an undo button for the last glass.
- 📊 **Visual progress** as a progress ring (glasses out of your goal) and a percentage badge on the extension icon.
- 🗓️ **Weekly history** (Monday–Sunday) as a mini bar chart with the number of days the goal was met.
- 🌙 **Dark/light mode** that follows the system or can be set manually.
- 🌐 **Two languages** — English (default) and Indonesian, switchable with the language button in the popup.
- 🕕 **Active hours** — reminders only appear between wake-up time and bedtime.
- 🔒 **Fully private** — no server, no tracking, data stored in `chrome.storage.local`.

### Installation

This extension is not yet published on the Chrome Web Store, so it is installed manually (unpacked):

1. Download or clone this repository.
   ```bash
   git clone https://github.com/AvisDelphi/DrinkWell.git
   ```
2. Open `chrome://extensions` in Chrome (or a Chromium-based browser such as Edge/Brave).
3. Turn on **Developer mode** in the top-right corner.
4. Click **Load unpacked**, then select the `DrinkWell` folder.
5. The DrinkWell icon will appear in the toolbar. Pin it for easy access.

### Usage

| Action | How |
| --- | --- |
| Log a drink | Click the extension icon → **Drink 1 glass** |
| Undo the last entry | Click the ↺ icon next to the drink button |
| Turn reminders on/off | Toggle in the reminder row (bell icon) |
| Change theme | Moon/sun button in the top-right corner |
| Change language | **EN/ID** button in the top-right corner |
| Set goal & interval | Settings icon in the top-right corner (saved automatically) |
| Test a notification | Settings → **Test notification** |

#### Available settings

| Setting | Default | Description |
| --- | --- | --- |
| Daily target | `2100 ml` | Daily water intake goal (500–6000 ml) |
| Glass size | `250 ml` | Glass size used when logging (50–1000 ml) |
| Reminder interval | `30 minutes` | 15, 20, 30, or 60 minutes |
| Appearance | `Follow system` | Auto, light, or dark |
| Language | `English` | English or Indonesian |
| Wake-up time | `06:00` | Start of active reminder hours |
| Bedtime | `22:00` | End of active reminder hours |

> The next reminder always lands on a round minute based on the interval. Logging a drink does **not** change the reminder schedule. History is kept for the last 60 days.

### Project structure

```
drinkwell/
├── manifest.json     # Manifest V3: permissions, service worker, icons
├── background.js     # Service worker: alarms, notifications, badge
├── common.js         # Shared logic: state, settings, history
├── popup.html        # Extension popup markup
├── popup.js          # Popup interactions: render, actions, settings
├── popup.css         # Popup styles (light & dark themes)
├── theme.js          # Applies the theme early to avoid flicker
├── i18n.js           # Language helper: picks the dictionary & applies it to the DOM
├── locales/
│   ├── en.js         # English strings
│   └── id.js         # Indonesian strings
└── icons/            # 16, 32, 48, and 128 px icons
```

### Technical notes

- **Manifest V3** with a service worker (`background.js`).
- `chrome.alarms` for reminder scheduling that survives a suspended service worker.
- `chrome.notifications` for notifications with action buttons.
- `chrome.storage.local` for settings and the daily intake log.
- No dependencies, no build step — just static files.

#### Permissions used

| Permission | Reason |
| --- | --- |
| `alarms` | Schedule periodic reminders |
| `notifications` | Show drink reminders |
| `storage` | Store settings and intake history |

### Contributing

Suggestions and fixes are welcome:

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/feature-name`.
3. Commit your changes: `git commit -m "Add feature ..."`.
4. Push: `git push origin feature/feature-name`.
5. Open a Pull Request.

### License

Released under the [MIT](LICENSE) license.

---

## Bahasa Indonesia

**DrinkWell** adalah ekstensi Chrome untuk mengingatkanmu minum air secara teratur sekaligus mencatat asupan cairan harian. Ringan, tanpa akun, dan seluruh data disimpan secara lokal di browser.

### Fitur

- ⏰ **Pengingat otomatis** setiap 15, 20, 30, atau 60 menit — selaras dengan jam dinding (mis. :00 dan :30).
- 🔔 **Notifikasi interaktif** dengan tombol **“Sudah minum”** dan **“Ingatkan 10 menit lagi”** (snooze).
- 🥤 **Pencatat asupan** satu klik per gelas, lengkap dengan tombol batalkan gelas terakhir.
- 📊 **Progres visual** berupa cincin progres (jumlah gelas dari target) dan badge persentase pada ikon ekstensi.
- 🗓️ **Riwayat mingguan** (Senin–Minggu) berupa grafik batang mini beserta jumlah hari yang mencapai target.
- 🌙 **Mode gelap/terang** yang bisa mengikuti sistem atau diatur manual.
- 🌐 **Dua bahasa** — English (default) dan Indonesia, bisa diganti lewat tombol bahasa di popup.
- 🕕 **Jam aktif** — pengingat hanya muncul antara jam bangun dan jam tidur.
- 🔒 **Privasi penuh** — tanpa server, tanpa pelacakan, data tersimpan di `chrome.storage.local`.

### Instalasi

Ekstensi ini belum dipublikasikan di Chrome Web Store, jadi dipasang secara manual (unpacked):

1. Unduh/clone repositori ini.
   ```bash
   git clone https://github.com/AvisDelphi/DrinkWell.git
   ```
2. Buka `chrome://extensions` di Chrome (atau browser berbasis Chromium seperti Edge/Brave).
3. Aktifkan **Developer mode** di pojok kanan atas.
4. Klik **Load unpacked**, lalu pilih folder `DrinkWell`.
5. Ikon DrinkWell akan muncul di toolbar. Sematkan (pin) agar mudah diakses.

### Cara Pakai

| Aksi | Cara |
| --- | --- |
| Mencatat minum | Klik ikon ekstensi → **Minum 1 gelas** |
| Membatalkan catatan terakhir | Klik ikon ↺ di sebelah tombol minum |
| Menyalakan/mematikan pengingat | Toggle di baris pengingat (ikon lonceng) |
| Mengubah tema | Tombol bulan/matahari di kanan atas |
| Mengubah bahasa | Tombol **EN/ID** di kanan atas |
| Mengatur target & interval | Ikon pengaturan di kanan atas (tersimpan otomatis) |
| Mencoba notifikasi | Pengaturan → **Tes notifikasi** |

#### Pengaturan yang tersedia

| Pengaturan | Default | Keterangan |
| --- | --- | --- |
| Target harian | `2100 ml` | Sasaran asupan air per hari (500–6000 ml) |
| Isi 1 gelas | `250 ml` | Ukuran gelas yang dipakai saat mencatat (50–1000 ml) |
| Interval pengingat | `30 menit` | 15, 20, 30, atau 60 menit |
| Tampilan | `Ikuti sistem` | Auto, terang, atau gelap |
| Bahasa | `English` | English atau Indonesia |
| Jam bangun | `06:00` | Awal jam aktif pengingat |
| Jam tidur | `22:00` | Akhir jam aktif pengingat |

> Pengingat berikutnya selalu jatuh di menit bulat sesuai interval. Mencatat minum **tidak** mengubah jadwal pengingat. Riwayat disimpan maksimal 60 hari terakhir.

### Struktur Proyek

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

### Teknis

- **Manifest V3** dengan service worker (`background.js`).
- `chrome.alarms` untuk penjadwalan pengingat yang tahan terhadap service worker yang di-suspend.
- `chrome.notifications` untuk notifikasi dengan tombol aksi.
- `chrome.storage.local` untuk pengaturan dan log asupan harian.
- Tanpa dependency, tanpa build step — cukup file statis.

#### Izin yang digunakan

| Izin | Alasan |
| --- | --- |
| `alarms` | Menjadwalkan pengingat berkala |
| `notifications` | Menampilkan notifikasi minum |
| `storage` | Menyimpan pengaturan dan riwayat asupan |

### Kontribusi

Saran dan perbaikan sangat diterima:

1. Fork repositori ini.
2. Buat branch baru: `git checkout -b fitur/nama-fitur`.
3. Commit perubahan: `git commit -m "Tambah fitur ..."`.
4. Push: `git push origin fitur/nama-fitur`.
5. Buka Pull Request.

### Lisensi

Dirilis di bawah lisensi [MIT](LICENSE).
