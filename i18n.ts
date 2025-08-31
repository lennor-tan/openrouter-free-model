import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'zh'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Providing a default is required here because getRequestConfig() will be called without a locale.
  const nowLocale = locale || defaultLocale;
  const baseLocale = new Intl.Locale(nowLocale).baseName;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(baseLocale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${baseLocale}.json`)).default,
    locale: baseLocale,
  };
});
