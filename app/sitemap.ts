import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // 对于内容相对稳定的页面，使用固定的构建日期或上次重大更新日期
  const lastModified = new Date().toISOString().split('T')[0];

  // 生成多语言页面的sitemap条目
  const languagePages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${baseUrl}/${lang}`]),
        ),
      },
    },
  ]);

  return [
    // 根页面重定向到默认语言
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...languagePages,
  ];
}
