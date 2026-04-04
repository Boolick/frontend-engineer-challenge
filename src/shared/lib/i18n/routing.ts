import { defineRouting } from 'next-intl/routing';

import { locales, DEFAULT_LOCALE } from './constants';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'never'
});
