import { type Locale as DateFnsLocale } from 'date-fns';
import { mapValues } from 'lodash-es';
import { type MessageFormatElement } from 'react-intl';

type KitsuLocale = Record<string, MessageFormatElement[]>;

export enum LocaleStatus {
  /** The locale has at least 99% string coverage */
  'COMPLETE',
  /** The locale has at least 80% string coverage */
  'BETA',
  /** The locale has less than 80% string coverage */
  'INCOMPLETE',
}

export type LocaleBundles = {
  main: {
    kitsu: KitsuLocale;
    dateFns: DateFnsLocale;
  };
};

export type Locale = {
  /** The name of the locale */
  name: string;
  /** Specifies how complete the locale is */
  status: LocaleStatus;
  /** Load the locale data */
  bundles: {
    [key in keyof LocaleBundles]: () => Promise<LocaleBundles[key]>;
  };
};

export function defineLocale({
  name,
  status,
  bundles: bundleLoaders,
}: {
  name: string;
  status: LocaleStatus;
  bundles: {
    [key in keyof LocaleBundles]: () => Promise<{
      default: LocaleBundles[key];
    }>;
  };
}): Locale {
  return {
    name,
    status,
    bundles: mapValues(bundleLoaders, async (loader) => {
      return (await loader()).default;
    }) as unknown as Locale['bundles'],
  };
}
