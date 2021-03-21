import logWhen from 'app/hooks/logWhen';

import loadFonts from './loadFonts';
import loadSession from './loadSession';
import setupBlurhash from './setupBlurhash';
import setupI18n from './setupI18n';

export default function isBooted() {
  // Check the boot requirements to see if they've finished loading
  const BOOT_REQUIREMENTS = [
    loadFonts,
    loadSession,
    setupBlurhash,
    setupI18n,
  ];
  const state = BOOT_REQUIREMENTS.map((initializer) => {
    const isBooted = initializer();
    logWhen({
      current: isBooted,
      expected: true,
      level: 'debug',
      message: `Initializers: ✅ ${initializer.name}`
    });
    return isBooted;
  })
  const booted = state.reduce((acc, val) => acc && val, true);

  logWhen({
    current: booted,
    expected: true,
    level: 'debug',
    message: 'Initializers: 🎉  Done!'
  });

  return booted;
}
