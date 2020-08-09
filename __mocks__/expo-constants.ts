import { Constants } from 'expo-constants';
import manifest from '../app.config';

const config = manifest({
  projectRoot: '',
  staticConfigPath: '',
  packageJsonPath: '',
  config: {
    expo: {},
  },
});

const constants: Constants = {
  name: 'ExponentConstants',
  debugMode: true,
  deviceYearClass: null,
  experienceUrl: '',
  isDevice: false,
  expoVersion: null,
  expoRuntimeVersion: null,
  isHeadless: true,
  installationId: '69-420',
  linkingUri: '',
  statusBarHeight: 69,
  getWebViewUserAgentAsync: async () => 'Chrome/420',
  nativeAppVersion: null,
  nativeBuildVersion: null,
  sessionId: '420',
  systemFonts: [],
  appOwnership: null,
  manifest: config as any,
};

export default constants;
