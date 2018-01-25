import { kitsuConfig } from 'kitsu/config/env';
import { Platform, StatusBar } from 'react-native';

export const statusBarHeight = Platform.select({ ios: 20, android: StatusBar.currentHeight });

export const defaultAvatar = `${kitsuConfig.assetsUrl}/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png`;

export const defaultCover = `${kitsuConfig.assetsUrl}/default_cover-7bda2081d0823731a96bbb20b70f4fcf.png`;

export const TERMS_URL = 'https://kitsu.io/terms';
