// @ts-check
/* Globals */
import globals from 'globals';
import rnGlobals from 'eslint-plugin-react-native-globals';

/* Plugins */
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import rnPlugin from 'eslint-plugin-react-native';
import hooksPlugin from 'eslint-plugin-react-hooks';
import kitsuPlugin from './eslint/index.js';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  reactPlugin.configs.flat.recommended,
  prettierConfig,

  // Application files
  {
    plugins: {
      'react-native': rnPlugin,
      'react-hooks': hooksPlugin,
      kitsu: kitsuPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...rnGlobals.environments.all.globals,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'kitsu/fix-kitsu-imports': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          minimumDescriptionLength: 3,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-duplicates': ['error',
        {
          'prefer-inline': true,
          considerQueryString: true,
        }
      ],
      'react/prop-types': 'off',
      'react-native/no-unused-styles': 2,
      'react-native/no-inline-styles': 1,
      'react-native/no-color-literals': 2,
      'react-native/no-raw-text': 2,
      'react-native/no-single-element-style-arrays': 1,
    },
  },

  // Node-based config files
  {
    files: ['**/*.config.{js,ts}'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2015,
      sourceType: 'commonjs',
    },
  },
);

