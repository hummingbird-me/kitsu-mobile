import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { TFunction, TFunctionKeys } from 'i18next';
import { isString } from 'lodash';

export default function useScopedTranslation(
  scope: string | string[]
): UseTranslationResponse {
  const prefix = isString(scope) ? scope : scope.join('.');
  const i18n = useTranslation();

  const t = ((key: TFunctionKeys, ...args: any[]) => {
    if (isString(key)) {
      return i18n.t(`${prefix}.${key}`, ...args);
    } else {
      const keys = key.map((k) => `${prefix}.${k}`);
      return i18n.t(keys, ...args);
    }
  }) as TFunction;

  return {
    ...i18n,
    t,
  };
}
