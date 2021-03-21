import { useEffect } from 'react';

import * as Logger from 'app/utils/log';

export default function logWhen({
  current,
  expected,
  message,
  level,
}: {
  current: any;
  expected: any;
  message: string;
  level: Exclude<keyof typeof Logger, 'init' | 'chalk'>;
}) {
  useEffect(() => {
    if (current === expected) {
      Logger[level](message);
    }
  }, [current]);
}
