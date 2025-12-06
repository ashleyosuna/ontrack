# Requirements

- Install XCode
- Install CocoaPods

# Steps
1. Navigate into the app directory
2. Run npm i to ensure all required packages are installed.
3. Run npm run build
4. npx cap sync
5. npx cap open ios
6. select your device
7. click run and build button

# Notes

- If you modify the source code, make sure to build before synching, as otherwise, you won't see your changes on ios.
- Make sure you have a development team selected in the project's 'Signing & Capabilities' section of XCode (you can have a personal team, i.e., using your Apple Account)
- The bundle identifier com.onTrack.app did not work for me, I was able to bypass this by modifying it slightly (e.g., com.onTrack4.app)
