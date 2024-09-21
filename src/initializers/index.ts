import initializeBrowser from './browser';
import initializeEdgeToEdge from './edgeToEdge';
import initializeFonts from './fonts';
import initializeSentry from './sentry';

export default async function initialize(): Promise<void> {
  await Promise.allSettled([
    initializeSentry(),
    initializeBrowser(),
    initializeFonts(),
    initializeEdgeToEdge(),
  ]);
}
