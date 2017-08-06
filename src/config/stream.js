import stream from 'getstream';
import { kitsuConfig } from './env';

export const getStream = () => {
  const { API_KEY, API_SECRET, APP_ID } = kitsuConfig.stream;
  const aaa = stream.connect(API_KEY, null, APP_ID);
  return aaa;
};
