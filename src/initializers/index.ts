import loadFonts from './loadFonts';
import loadSession from './loadSession';
import setupBlurhash from './setupBlurhash';
import setupI18n from './setupI18n';

export default function isBooted() {
  // Check the boot requirements to see if they've finished loading
  const BOOT_REQUIREMENTS = [
    loadFonts(),
    loadSession(),
    setupBlurhash(),
    setupI18n(),
  ];
  return BOOT_REQUIREMENTS.reduce((acc, val) => acc && val, true);
}
