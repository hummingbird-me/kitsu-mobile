export type SocialAuthResponse = {
  service: 'apple' | 'facebook';
  token: string;
  // These two are not always available
  suggestedUsername?: string;
  email?: string;
};
