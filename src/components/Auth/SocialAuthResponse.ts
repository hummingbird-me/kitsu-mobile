export type SocialAuthProviderName = 'apple' | 'facebook';

export type SocialAuthResponse = {
  service: SocialAuthProviderName;
  token: string;
  // These two are not always available
  suggestedUsername?: string;
  email?: string;
};
