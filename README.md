# ComicKunMart

Aplikasi komik berbasis Expo (React Native) dengan fitur baca komik, manajemen chapter, dan deep linking. Proyek ini mendukung dua peran: Creator (pembuat komik) dan User (pembaca umum).

## Ringkasan Fitur

- Manajemen komik dan chapter (buat, edit, hapus untuk Creator)
- Baca chapter untuk semua pengguna
- Logika beli/refund untuk User (tanpa login, status tersimpan lokal)
- Deep linking dengan skema `comickunmart://` untuk membuka halaman tertentu langsung dari URL
- UI responsif dengan tema gelap/terang

## Peran dan Aturan Akses

- Creator
  - Selalu melihat tombol `Baca` pada semua chapter miliknya
  - Tidak melihat tombol `Beli` atau `Refund`
  - Dapat edit/hapus komik dan chapter
- User (tanpa login)
  - Dapat membeli chapter berbayar (status pembelian disimpan lokal via AsyncStorage)
  - Dapat refund untuk mengembalikan status pembelian
  - Dapat membaca chapter gratis dan chapter berbayar yang sudah ditandai dibeli

Catatan: Transaksi pembelian/refund saat ini tidak menyentuh database; hanya status lokal untuk keperluan demo.

## Deep Linking

- Skema: `comickunmart://`
- Contoh link:
  - `comickunmart://home`
  - `comickunmart://comics/<comicId>`
  - `comickunmart://comics/<comicId>/read/<chapterId>`
- Testing cepat:
  - iOS: `xcrun simctl openurl booted comickunmart://comics/123`
  - Android: `adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123"`
- Dokumentasi lengkap: lihat `DEEP_LINKING_GUIDE.md` dan `DEEP_LINK_README.md`

## Instalasi & Menjalankan

1. Install dependencies
   ```bash
   npm install
   ```

2. Jalankan aplikasi
   ```bash
   npx expo start
   ```

3. Buka di emulator/simulator atau Expo Go sesuai kebutuhan.

## Konfigurasi Lingkungan

- Konfigurasi Expo dan Supabase publik tersimpan di `app.json` melalui `EXPO_PUBLIC_*`
- File rahasia dan lokal diabaikan melalui `.gitignore` (mis. `.env`, `.expo/`, `node_modules/`)
- Jika perlu, buat `.env.example` untuk dokumentasi variabel lingkungan (opsional)

## Struktur Proyek Singkat

- `app/` — routes dan layar aplikasi (expo-router)
- `components/` — komponen UI
- `services/` — service layer (komik, chapter, transaksi, dll.)
- `store/` — state management menggunakan store terpisah
- `utils/` — utilitas (deep linking, storage, dll.)

## Catatan Teknis

- Pembelian dan refund tidak melakukan transaksi nyata; status disimpan di local storage per komik
- Creator diidentifikasi via `profile.id === comic.creator_id`
- Tombol beli dan refund tersembunyi untuk Creator; hanya tombol baca yang tampil

## Lisensi

Proyek untuk keperluan akademik. Silakan gunakan dan modifikasi sesuai kebutuhan pembelajaran.
