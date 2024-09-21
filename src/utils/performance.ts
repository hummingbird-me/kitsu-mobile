export const startTime = performance.now();

export function mark(name: string) {
  console.log(`MARK: ${name} ${(performance.now() - startTime).toFixed(2)}ms`);
}

mark('Kitsu.App.Start');
