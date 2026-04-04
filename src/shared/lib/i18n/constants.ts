export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = 'ru';
export const COOKIE_NAME = 'NEXT_LOCALE';
