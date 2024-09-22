import {
  useDispatch as _useDispatch,
  useSelector as _useSelector,
  useStore as _useStore,
} from 'react-redux';

import type { AppDispatch, AppStore, RootState } from './store';

export const useDispatch = _useDispatch.withTypes<AppDispatch>();
export const useSelector = _useSelector.withTypes<RootState>();
export const useStore = _useStore.withTypes<AppStore>();
