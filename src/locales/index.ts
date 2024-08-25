import { Locale } from './utils/locale';

const translationFiles: { keys: () => string[] } & ((key: string) => {
  default: Locale;
}) =
  // @ts-ignore: Metro supports this to require a whole directory
  require.context('./headers', true, /\.ts$/);

const translations: Record<string, Locale> = {};

for (const key of translationFiles.keys()) {
  const locale = key.replace(/^\.\/(.*)\.ts$/, '$1');
  translations[locale] = translationFiles(key).default;
}

export default translations;
