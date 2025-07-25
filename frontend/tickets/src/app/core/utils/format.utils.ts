/**
 * Converte un numero di byte in una stringa formattata più leggibile (es. KB, MB).
 * @param bytes Il numero di byte da formattare.
 * @param decimals Il numero di cifre decimali da visualizzare.
 * @returns Una stringa formattata (es. "1.23 MB").
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
