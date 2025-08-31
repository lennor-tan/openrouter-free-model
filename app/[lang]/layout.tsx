import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
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

// 动态生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  // 建议使用环境变量，例如 process.env.NEXT_PUBLIC_BASE_URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://openrouter-free-model.vercel.app';
  const currentUrl = `${baseUrl}/${lang}`;

  // 根据语言设置不同的元数据
  const isZh = lang === 'zh';

  const title = isZh
    ? 'OpenRouter 免费模型浏览器 - AI模型筛选与导出工具'
    : 'OpenRouter Free Model Explorer - AI Model Browser & Export Tool';

  const description = isZh
    ? '专业的OpenRouter免费AI模型浏览器，支持模型筛选、排序、批量选择和多格式导出。兼容NewAPI和UniAPI，支持中英文界面，为AI开发者提供便捷的模型管理工具。'
    : 'Professional OpenRouter free AI model browser with filtering, sorting, batch selection and multi-format export. Compatible with NewAPI and UniAPI, supports bilingual interface for AI developers.';

  const keywords = isZh
    ? 'OpenRouter, 免费模型, AI模型, 人工智能, 模型浏览器, NewAPI, UniAPI, 模型导出, 模型筛选, 免费AI'
    : 'OpenRouter, free models, AI models, artificial intelligence, model browser, NewAPI, UniAPI, model export, model filtering, free AI';

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'OpenRouter Free Model Explorer' }],
    creator: 'OpenRouter Free Model Explorer',
    publisher: 'OpenRouter Free Model Explorer',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      url: currentUrl,
      title,
      description,
      siteName: isZh
        ? 'OpenRouter 免费模型浏览器'
        : 'OpenRouter Free Model Explorer',
      images: [
        {
          // SEO 建议: 使用PNG或JPG格式的专用社交媒体分享图 (1200x630)，而不是SVG
          url: `${baseUrl}/og-image.png`, // 建议创建一个新的 og-image.png
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`], // 建议创建一个新的 og-image.png
      creator: '@openrouter',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        zh: `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`,
      },
    },
    icons: {
      icon: '/logo.svg',
      shortcut: '/logo.svg',
      apple: '/logo.svg',
    },
    manifest: '/manifest.json',
    other: {
      'google-site-verification': 'your-google-verification-code', // 需要替换为实际的验证码
    },
  };
}

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

  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name:
      resolvedParams.lang === 'zh'
        ? 'OpenRouter 免费模型浏览器'
        : 'OpenRouter Free Model Explorer',
    description:
      resolvedParams.lang === 'zh'
        ? '专业的OpenRouter免费AI模型浏览器，支持模型筛选、排序、批量选择和多格式导出。'
        : 'Professional OpenRouter free AI model browser with filtering, sorting, batch selection and multi-format export.',
    url: `https://openrouter-free-model.vercel.app/${resolvedParams.lang}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'OpenRouter Free Model Explorer',
    },
    inLanguage: resolvedParams.lang === 'zh' ? 'zh-CN' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://openrouter-free-model.vercel.app/${resolvedParams.lang}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={resolvedParams.lang}>
      <head>
        {/* 基础SEO元标签 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* next/font 已自动处理字体优化，无需手动 preconnect */}

        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//openrouter.ai" />
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
