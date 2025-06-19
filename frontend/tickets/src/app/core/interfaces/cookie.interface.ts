export interface Cookie {
  readonly essentialCookies: true;
  analyticsCookies: boolean | null;
  functionalCookies: boolean | null;
  targetingCookies: boolean | null;
}
