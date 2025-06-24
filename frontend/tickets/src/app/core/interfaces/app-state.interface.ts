import { UserDetail } from '../../features/auth/interfaces/user-detail.interface';
import { Language } from '../types/language.type';
import { Theme } from '../types/theme.type';
import { CookiePreferences } from './cookie-preference.interface';

export interface AppState {
  auth_token: string | null;
  cookie_preferences: CookiePreferences | null;
  current_user: UserDetail | null;
  lang: Language;
  theme: Theme;
}
