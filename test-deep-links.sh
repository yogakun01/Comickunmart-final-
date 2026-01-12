#!/bin/bash

# Deep Link Testing Script for ComicKunMart
# This script helps test deep links on iOS Simulator and Android Emulator

echo "🚀 ComicKunMart Deep Link Testing Script"
echo "=========================================="
echo ""

# Function to test iOS deep links
test_ios() {
    echo "📱 Testing on iOS Simulator..."
    echo ""
    
    # Home
    echo "🏠 Testing Home:"
    xcrun simctl openurl booted comickunmart://home
    sleep 2
    
    # Comic Detail
    echo "📚 Testing Comic Detail:"
    xcrun simctl openurl booted comickunmart://comics/123
    sleep 2
    
    # Chapter Read
    echo "📖 Testing Chapter Read:"
    xcrun simctl openurl booted comickunmart://comics/123/read/456
    sleep 2
    
    # Auth
    echo "🔐 Testing Auth Pages:"
    xcrun simctl openurl booted comickunmart://auth/login
    sleep 2
    xcrun simctl openurl booted comickunmart://auth/register
    sleep 2
    
    # Profile
    echo "👤 Testing Profile:"
    xcrun simctl openurl booted comickunmart://profile
    sleep 2
    
    # Search
    echo "🔍 Testing Search:"
    xcrun simctl openurl booted comickunmart://search
    echo ""
    echo "✅ iOS testing completed!"
}

# Function to test Android deep links
test_android() {
    echo "🤖 Testing on Android Emulator..."
    echo ""
    
    # Home
    echo "🏠 Testing Home:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://home"
    sleep 2
    
    # Comic Detail
    echo "📚 Testing Comic Detail:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123"
    sleep 2
    
    # Chapter Read
    echo "📖 Testing Chapter Read:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://comics/123/read/456"
    sleep 2
    
    # Auth
    echo "🔐 Testing Auth Pages:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://auth/login"
    sleep 2
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://auth/register"
    sleep 2
    
    # Profile
    echo "👤 Testing Profile:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://profile"
    sleep 2
    
    # Search
    echo "🔍 Testing Search:"
    adb shell am start -W -a android.intent.action.VIEW -d "comickunmart://search"
    echo ""
    echo "✅ Android testing completed!"
}

# Main menu
echo "Choose platform to test:"
echo "1. iOS Simulator"
echo "2. Android Emulator"
echo "3. Test All"
echo "4. Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        test_ios
        ;;
    2)
        test_android
        ;;
    3)
        test_ios
        echo ""
        echo "Switching to Android..."
        echo ""
        test_android
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deep link testing completed!"