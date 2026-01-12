# Deep Linking Implementation for ComicKunMart

## Quick Start

Your app now supports deep linking! 🎉

### URL Scheme
```
comickunmart://
```

### Available Deep Links
```bash
# Home
comickunmart://home

# Comic Detail
comickunmart://comics/[comic-id]

# Read Chapter
comickunmart://comics/[comic-id]/read/[chapter-id]

# Auth
comickunmart://auth/login
comickunmart://auth/register

# Profile
comickunmart://profile

# Search
comickunmart://search
```

### Testing Commands

#### iOS Simulator
```bash
xcrun simctl openurl booted comickunmart://comics/123
```

#### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123"
```

### Share Feature

The app now includes a share button on comic detail pages. Users can share comics using deep links that will open directly in the app.

### Files Created
- `utils/deep-linking.ts` - Deep link utilities
- `components/ShareButton.tsx` - Share button component
- `DEEP_LINKING_GUIDE.md` - Complete documentation
- `test-deep-links.sh` - Testing script
- `ios-deep-link-config.md` - iOS specific configuration

### Next Steps
1. Test deep links using the provided commands
2. Run `./test-deep-links.sh` for automated testing
3. Check the full documentation in `DEEP_LINKING_GUIDE.md`
4. Customize the share functionality as needed