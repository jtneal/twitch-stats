import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://id.twitch.tv/oauth2',
  redirectUri: window.location.origin,
  clientId: 'pavhte5wzqhob0qnsb44asmr9iy9vc',
  scope: 'channel:read:subscriptions',
};
