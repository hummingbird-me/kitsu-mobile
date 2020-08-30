import { BackendModule } from 'i18next';

import translations from 'app/translations';

const translationLoader: BackendModule = {
  type: 'backend',
  init: () => {},
  create: () => {},
  read(language, _namespace, callback) {
    try {
      callback(null, translations[language]);
    } catch (error) {
      callback(error, false);
    }
  },
};
export default translationLoader;
