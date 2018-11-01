import * as Screens from 'kitsu/navigation/types';

export const ONBOARDING = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: Screens.ONBOARDING_WELCOME,
          },
        },
      ],
    },
  },
};
