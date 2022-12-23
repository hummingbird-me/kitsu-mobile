import * as Screens from 'kitsu/navigation/types';

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
