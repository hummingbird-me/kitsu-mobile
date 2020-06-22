import * as Screens from 'app/navigation/types';

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
