# Kitsu Mobile

---
**<p align="center">This is our mobile repository. It contains the React Native app.<br />Check out the [tools], [web], [server] and [api docs] repositories.</p>**

[tools]:https://github.com/hummingbird-me/kitsu-tools
[web]:https://github.com/hummingbird-me/hummingbird-client
[server]:https://github.com/hummingbird-me/kitsu-server
[api docs]:https://github.com/hummingbird-me/api-docs

---

## Installation

- [Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Running on a Device](https://reactnative.dev/docs/running-on-device)

The instructions below are primarily for iOS development on macOS devices. Check the two links above for cross-platform installation on Linux and Windows.

### Prerequsites

- [yarn](https://yarnpkg.com/lang/en/docs/install/)
- [watchman](https://facebook.github.io/watchman/docs/install)
- react-native-cli
    - `yarn global add react-native-cli`
- [cocoapods](https://guides.cocoapods.org/using/getting-started.html)

### Instructions

If you run **OSX** then download the [iOS FacebookSDK](https://developers.facebook.com/docs/ios/getting-started/#download) and unzip the archive to `~/Documents/FacebookSDK`

1. Run `yarn install`
2. Run `react-native link`
3. Run `cd ios && pod install` 

### Debugging

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases)
- Run `yarn debug`
- Shake the device and tap `Debug JS Remotely`

### Known Issues :warning:

1. Packager fails to resolve aliases at first run. Do `yarn start:reset` instead of `yarn start` at first launch. Same applies when running the app with `react-native run-ios` or `react-native run-android`. Kill the packager and type `yarn start:reset`

## Download

<a href="https://play.google.com/store/apps/details?id=com.everfox.animetrackerandroid&utm_source=github&utm_campaign=kitsu-mobile"><img src="https://i.imgur.com/HqUNEEU.png" alt="Kitsu on Google Play"></a>
<a href="https://itunes.apple.com/us/app/kitsu-anime/id590452826?mt=8&utm_source=github&utm_campaign=kitsu-mobile"><img src="https://devimages-cdn.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Kitsu on the App Store"></a>
