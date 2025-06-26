export const StorageConfig = {
  STORE_COOKIE_KEY: 'tickets_app_store',
  KEYS: {
    AUTH_TOKEN: 'auth_token',
    COOKIE_PREFERENCES: 'cookie_preferences',
    LANGUAGE: 'lang',
    THEME: 'theme',
    USER_INFO: 'current_user',
  },
} as const;

export type StorageKey =
  (typeof StorageConfig.KEYS)[keyof typeof StorageConfig.KEYS];
