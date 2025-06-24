export interface CookiePreferences {
  readonly essentialCookies: true;
  analyticsCookies: boolean | null;
  functionalCookies: boolean | null;
  targetingCookies: boolean | null;
}
