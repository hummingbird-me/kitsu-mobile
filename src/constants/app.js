import { kitsuConfig } from 'kitsu/config/env';
import { Platform, StatusBar, Dimensions } from 'react-native';

// The height of the navigation bar itself
export const navigationBarHeight = 44;
export const statusBarHeight = Platform.select({ ios: 20, android: StatusBar.currentHeight });

// TODO: Probably don't need this if RNN fixes their constants
// Ref: https://github.com/wix/react-native-navigation/issues/3893
export const bottomTabsHeight = Platform.select({ ios: 64, android: 56 });

export const defaultAvatar = `${kitsuConfig.assetsUrl}/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png`;

export const defaultCover = `${kitsuConfig.assetsUrl}/default_cover-7bda2081d0823731a96bbb20b70f4fcf.png`;

// The dimensions of the kitsu cover image
const originalCoverWidth = 2400;
const originalCoverHeight = 1000;
let coverWidth = originalCoverWidth;
let coverHeight = originalCoverHeight;

// Now on android we are getting Out Of Memory errors on versions 6.0 and below
// This might be due to the size of the image loaded in.
// Thus we decrease the dimesions based on the OS version.
if (Platform.OS === 'android') {
  // Android 4.4 and lower
  if (Platform.Version <= 19) {
    coverWidth /= 4;
    coverHeight /= 4;
  // Android 6.0 and lower
  } else if (Platform.Version <= 23) {
    coverWidth /= 2;
    coverHeight /= 2;
  }
}

// The cover image dimensions with device taken into account
export const coverImageDimensions = { width: coverWidth, height: coverHeight };

// The original dimensions without the change due to device
export const originalCoverImageDimensions = {
  width: originalCoverWidth,
  height: originalCoverHeight,
};

export const TERMS_URL = 'https://kitsu.io/terms';

export const STREAMING_SERVICES = {
  hulu: require('kitsu/assets/img/streaming-services/hulu.png'),
  crunchyroll: require('kitsu/assets/img/streaming-services/crunchyroll.png'),
  netflix: require('kitsu/assets/img/streaming-services/netflix.png'),
  amazon: require('kitsu/assets/img/streaming-services/amazon.png'),
  funimation: require('kitsu/assets/img/streaming-services/funimation.png'),
  hidive: require('kitsu/assets/img/streaming-services/hidive.png'),
  viewster: require('kitsu/assets/img/streaming-services/viewster.png'),
  tubitv: require('kitsu/assets/img/streaming-services/tubitv.png'),
  youtube: require('kitsu/assets/img/streaming-services/youtube.png'),
};

export const ACCEPTED_UPLOAD_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
];

export const ADMOB_AD_UNITS = Object.freeze({
  ios: 'ca-app-pub-1730996169473196/8847607677',
  android: 'ca-app-pub-1730996169473196/9641281765',
});
