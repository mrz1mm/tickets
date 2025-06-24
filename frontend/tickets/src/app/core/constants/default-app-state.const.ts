import { AppState } from '../interfaces/app-state.interface';

export const DEFAULT_APP_STATE: AppState = {
  auth_token: null,
  current_user: null,
  cookie_preferences: null,
  lang: 'it',
  theme: 'dark',
};
