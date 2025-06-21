// src/environments/environment.ts
export const environment = {
  production: false,
  // Per il loader di Transloco, quando il client (browser) chiede
  // i file, li chiederà alla stessa origine da cui è servita l'app.
  // Una stringa vuota è perfetta per questo.
  baseUrl: 'http://localhost:4200',
};
