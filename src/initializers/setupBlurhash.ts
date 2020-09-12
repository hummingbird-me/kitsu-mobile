import usePromise from 'app/hooks/usePromise';
import { init } from 'app/utils/blurhash';
import * as Console from 'app/utils/log';

export default function setupBlurhashGL() {
  // Check that we're not running in a debugger before doing GL stuff
  // @ts-ignore
  if (global.nativeCallSyncHook) {
    let { state, error } = usePromise(init, []);

    if (state === 'fulfilled') {
      return true;
    } else if (state === 'rejected') {
      Console.warn(error);
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
