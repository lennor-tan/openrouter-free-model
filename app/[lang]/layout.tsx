import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateStaticParams() {
  return locales.map((locale: string) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: 'OpenRouter Free Models Monitor',
  description: 'Monitor and export free models from OpenRouter',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // 根据Next.js 15要求await params
  const resolvedParams = await params;
  const messages = await getMessages({ locale: resolvedParams.lang });

  return (
    <html lang={resolvedParams.lang}>
      <head>
        {/* 防止浏览器翻译扩展干扰 */}
        <meta name="google" content="notranslate" />
        <meta name="robots" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[480px]`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider
          locale={resolvedParams.lang}
          messages={messages}
        >
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
