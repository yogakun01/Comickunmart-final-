# Deep Linking Guide for ComicKunMart

## Overview

Deep linking memungkinkan pengguna membuka aplikasi ComicKunMart langsung ke halaman tertentu melalui URL. Panduan ini menjelaskan cara mengkonfigurasi dan menggunakan deep linking di proyek ini.

## URL Scheme

Aplikasi ini menggunakan skema URL: `comickunmart://`

## Struktur Deep Link

Format umum: `comickunmart://[path]/[parameters]`

### Routes yang Tersedia

1. **Home Page**
   - Format: `comickunmart://home`
   - Contoh: `comickunmart://home`

2. **Detail Komik**
   - Format: `comickunmart://comics/[comicId]`
   - Contoh: `comickunmart://comics/123`

3. **Baca Chapter**
   - Format: `comickunmart://comics/[comicId]/read/[chapterId]`
   - Contoh: `comickunmart://comics/123/read/456`

4. **Login**
   - Format: `comickunmart://auth/login`
   - Contoh: `comickunmart://auth/login`

5. **Register**
   - Format: `comickunmart://auth/register`
   - Contoh: `comickunmart://auth/register`

6. **Profile**
   - Format: `comickunmart://profile`
   - Contoh: `comickunmart://profile`

7. **Search**
   - Format: `comickunmart://search`
   - Contoh: `comickunmart://search`

## Cara Menggunakan

### 1. Testing di Simulator/Emulator

#### iOS Simulator
```bash
# Buka aplikasi ke home
xcrun simctl openurl booted comickunmart://home

# Buka detail komik
xcrun simctl openurl booted comickunmart://comics/123

# Baca chapter
xcrun simctl openurl booted comickunmart://comics/123/read/456
```

#### Android Emulator
```bash
# Buka aplikasi ke home
adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://home"

# Buka detail komik
adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123"

# Baca chapter
adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123/read/456"
```

### 2. Testing di Web Browser

Buka URL berikut di browser:
- `comickunmart://home`
- `comickunmart://comics/123`
- `comickunmart://comics/123/read/456`

### 3. Share Link dari Aplikasi

Gunakan fungsi utility yang sudah disediakan:

```typescript
import { generateComicShareLink, generateChapterShareLink } from '@/utils/deep-linking';

// Share komik
const comicLink = generateComicShareLink('123', 'Naruto');
// Output: { url: 'comickunmart://comics/123', message: 'Check out this comic: Naruto', title: 'Naruto' }

// Share chapter
const chapterLink = generateChapterShareLink('123', '456', 'Chapter 1: The Beginning');
// Output: { url: 'comickunmart://comics/123/read/456', message: 'Read this chapter: Chapter 1: The Beginning', title: 'Chapter 1: The Beginning' }
```

## Konfigurasi Platform

### iOS
Untuk iOS, tambahkan ini ke `ios/ComicKunMart/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>comickunmart</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.madeyoga.ComicKunMart</string>
  </dict>
</array>
```

### Android
Konfigurasi Android sudah otomatis ditambahkan di `app.json` dengan intentFilters.

## Troubleshooting

### Link Tidak Bekerja
1. Pastikan aplikasi sudah terinstall
2. Cek URL scheme sudah benar: `comickunmart://`
3. Untuk iOS, pastikan URL scheme sudah terdaftar di Info.plist
4. Untuk Android, cek intentFilters di app.json

### Testing Tools
- Gunakan terminal commands di atas untuk testing
- Untuk iOS: `xcrun simctl openurl booted [URL]`
- Untuk Android: `adb shell am start -W -a android.intent.action.VIEW -d "[URL]"`

## Contoh Implementasi

```typescript
// Di komponen React Native
import { Linking } from 'react-native';

const openDeepLink = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log('Cannot open URL:', url);
    }
  });
};

// Gunakan
openDeepLink('comickunmart://comics/123');
```