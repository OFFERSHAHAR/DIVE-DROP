import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale || routing.defaultLocale;

  if (!routing.locales.includes(resolvedLocale as any)) {
    return {
      locale: routing.defaultLocale,
      messages: (
        await import(`./messages/${routing.defaultLocale}.json`)
      ).default
    };
  }

  return {
    locale: resolvedLocale,
    messages: (
      await import(`./messages/${resolvedLocale}.json`)
    ).default
  };
});
