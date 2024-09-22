import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import usePromise from '@/hooks/usePromise';
import initialize from '@/initializers';
import { mark } from '@/utils/performance';

import Animation from './Animation';

export default function Initializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, error } = usePromise(initialize, []);
  if (error) throw error;
  const [isSuspended, setSuspended] = useState(false);

  const Fallback = useMemo(
    () =>
      function Fallback() {
        useEffect(() => {
          mark('Kitsu.Initializer.Suspend');
          setSuspended(true);
          return () => {
            mark('Kitsu.Initializer.Unsuspend');
            setSuspended(false);
          };
        });

        return <View />;
      },
    [setSuspended]
  );

  useEffect(() => mark('Kitsu.Initializer.Start'), []);

  useEffect(() => {
    if (state === 'fulfilled') {
      mark('Kitsu.Initializer.Resolved');
    }
  }, [state]);

  return (
    <View style={styles.wrapper}>
      <Animation isBooted={!isSuspended && state === 'fulfilled'} />
      <Suspense fallback={<Fallback />}>{children}</Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
});
