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

/**
 * Un tipo che rappresenta le possibili chiavi all'interno del nostro store persistito.
 * Garantisce che si possano usare solo chiavi predefinite, evitando errori di battitura.
 */
export type StorageKey =
  (typeof StorageConfig.KEYS)[keyof typeof StorageConfig.KEYS];
