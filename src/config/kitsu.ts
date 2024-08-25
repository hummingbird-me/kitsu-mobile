export type Environment = 'production' | 'staging';

export const environment: Environment = 'production';
export const isProduction = environment === 'production';
export const kitsuUrl = isProduction
  ? 'https://kitsu.app'
  : `https://${environment}.kitsu.app`;

export const apiPrefix = `${kitsuUrl}/api`;

export const clientId =
  'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
