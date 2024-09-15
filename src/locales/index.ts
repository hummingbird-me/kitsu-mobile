import { type Locale } from './utils/locale';

const translationFiles: { keys: () => string[] } & ((key: string) => {
  default: Locale;
}) =
  // @ts-ignore: Metro supports this to require a whole directory
  require.context('./bundles', true, /header\.ts$/);

const translations: Record<string, Locale> = {};

for (const key of translationFiles.keys()) {
  const locale = key.replace(/^\.\/([a-zA-Z-]+)\/header\.ts$/, '$1');
  console.log(locale);
  translations[locale] = translationFiles(key).default;
}

export default translations;
