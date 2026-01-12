# iOS Deep Link Configuration

## Info.plist Configuration

Untuk iOS, tambahkan konfigurasi berikut ke file `ios/ComicKunMart/Info.plist`:

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

<!-- For Universal Links (optional) -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

## Associated Domains (Optional for Universal Links)

Jika ingin menggunakan Universal Links (https://), tambahkan ke entitlements:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:yourdomain.com</string>
</array>
```

## Testing on iOS

### Using Simulator
```bash
# Open specific page
xcrun simctl openurl booted comickunmart://comics/123

# Check if app is installed
xcrun simctl listapps | grep ComicKunMart
```

### Using Xcode
1. Run the app in Xcode
2. Go to Safari on simulator
3. Type: `comickunmart://comics/123`
4. App should open to comic detail page

### Using Notes App
1. Create a note with the deep link
2. Tap on the link
3. App should open

## Debugging

Check console logs in Xcode for deep link handling:
```
Deep link received: comickunmart://comics/123
Parsed deep link: {scheme: "comickunmart", host: "", path: "/comics/123", ...}
```