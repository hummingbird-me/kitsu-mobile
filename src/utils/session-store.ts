import * as SecureStore from 'expo-secure-store';

import { Session } from 'app/types/session';

export const SESSION_STORE_KEY = 'io.kitsu.session';

export async function load(): Promise<Session | void> {
  const serialized = await SecureStore.getItemAsync(SESSION_STORE_KEY);
  return serialized && JSON.parse(serialized);
}

export function save(value: Session): Promise<void> {
  const serialized = JSON.stringify(value);
  return SecureStore.setItemAsync(SESSION_STORE_KEY, serialized);
}

export function clear(): Promise<void> {
  return SecureStore.deleteItemAsync(SESSION_STORE_KEY);
}
