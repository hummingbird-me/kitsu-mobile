import { AsyncStorage } from 'react-native';

export async function getItem(key) {
  return AsyncStorage.getItem(`@Kitsu:${key}`).then(value => JSON.parse(value));
}

export async function setItem(key, value) {
  return AsyncStorage.setItem(`@Kitsu:${key}`, JSON.stringify(value));
}

export async function removeItem(key) {
  return AsyncStorage.removeItem(`@Kitsu:${key}`);
}

// App Settings
export async function getDataSaver() {
  return getItem('dataSaver');
}

export async function setDataSaver(value) {
  return setItem('dataSaver', !!value);
}
