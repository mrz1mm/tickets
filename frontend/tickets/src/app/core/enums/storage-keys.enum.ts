export const StorageConfig = {
  STORE_COOKIE_KEY: 'tickets_app_store',
  KEYS: {
    COOKIE_PREFERENCES: 'cookie_preferences',
    LANGUAGE: 'app_lang',
    THEME: 'app_theme',
    USER_INFO: 'user_info',
  },
} as const;

/**
 * Un tipo che rappresenta le possibili chiavi all'interno del nostro store persistito.
 * Garantisce che si possano usare solo chiavi predefinite, evitando errori di battitura.
 */
export type StorageKey =
  (typeof StorageConfig.KEYS)[keyof typeof StorageConfig.KEYS];
