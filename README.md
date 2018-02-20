# Kitsu Mobile

---
**<p align="center">This is our mobile repository. It contains the React Native app.<br />Check out the [meta], [client], [server] and [api docs] repositories.</p>**

[meta]:https://github.com/hummingbird-me/hummingbird
[client]:https://github.com/hummingbird-me/hummingbird-client
[server]:https://github.com/hummingbird-me/hummingbird-server
[api docs]:https://github.com/hummingbird-me/api-docs

---

## Installation

### Prerequsites
- [yarn](https://yarnpkg.com/lang/en/docs/install/)
- [watchman](https://facebook.github.io/watchman/docs/install.html)
- react-native-cli
    - `yarn global add react-native-cli`
- [cocoapods](https://guides.cocoapods.org/using/getting-started.html)

### Instructions
If you run **OSX** then download the [iOS FacebookSDK](https://developers.facebook.com/docs/ios/getting-started/#download) and unzip the archive to `~/Documents/FacebookSDK`

1. Run `yarn install`
2. Run `react-native link`
3. Run `cd ios && pod install` 
4. Because of weird bug, react native does not have btoa and atob functions, but it is needed in auth library, for that we need to import btoa and atob in that library. (this is temporary solution, I will create PR to support react-native to that library). For now, you can run the app by enabling Remote debug mode, and app will work as it should.

### Debugging
- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases)
- Run `yarn debug`
- Shake the device and tap `Debug JS Remotely`

### Known Issues :warning:
1. Packager fails to resolve aliases at first run. Do `yarn start:reset` instead of `yarn start` at first launch. Same applies when running the app with `react-native run-ios` or `react-native run-android`. Kill the packager and type `yarn start:reset`
