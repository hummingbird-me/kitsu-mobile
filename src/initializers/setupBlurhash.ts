import usePromise from 'app/hooks/usePromise';
import { init } from 'app/utils/blurhash';
import * as Console from 'app/utils/log';

export default function setupBlurhashGL() {
  let { state, error } = usePromise(init, []);

  if (state === 'fulfilled') {
    return true;
  } else if (state === 'rejected') {
    Console.error(error);
    return true;
  } else {
    return false;
  }
}
