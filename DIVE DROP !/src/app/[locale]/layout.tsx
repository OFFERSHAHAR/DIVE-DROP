import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import '../../styles/design-system.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 16+
  const { locale } = await params;

  // Ensure locale is valid
  if (!routing.locales.includes(locale as 'en' | 'he')) {
    notFound();
  }

  const isRtl = locale === 'he';

  return (
    <html lang={locale as 'en' | 'he'} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <title>DiveDrop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
