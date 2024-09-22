import {
  configureStore,
  type Action,
  type ThunkAction,
} from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    thing() {
      return null;
    },
  },
});

/**
 * @deprecated Redux sucks
 */
export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
