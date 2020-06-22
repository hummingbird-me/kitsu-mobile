import * as Screens from 'app/navigation/types';

export const INTRO = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: Screens.AUTH_INTRO,
          },
        },
      ],
    },
  },
};
