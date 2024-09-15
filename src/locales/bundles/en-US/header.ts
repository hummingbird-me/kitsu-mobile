import { LocaleStatus, defineLocale } from '../../utils/locale';

export default defineLocale({
  name: 'English (United States)',
  status: LocaleStatus.COMPLETE,
  bundles: {
    main: () => import('./main.bundle'),
    zxcvbn: () => import('./zxcvbn.bundle'),
  },
});
