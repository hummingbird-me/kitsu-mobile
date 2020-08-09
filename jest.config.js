// jest.config.js
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  testRunner: 'jest-circus/runner',
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1',
  },
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',
};
