'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';

interface HeaderProps {
  isLoading: boolean;
  isValidating: boolean;
  lastFetched: string | undefined;
  resetAllFilters: () => void;
  handleRefresh: () => void;
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

export const Header: React.FC<HeaderProps> = ({
  isLoading,
  isValidating,
  lastFetched,
  resetAllFilters,
  handleRefresh,
}) => {
  const t = useTranslations('HomePage');
  const tHeader = useTranslations('Header');

  return (
    <header className="flex justify-between items-center mb-6" role="banner">
      <div>
        <Link
          href="/"
          onClick={resetAllFilters}
          className="flex items-center"
          aria-label="Back to homepage"
        >
          <Image
            src="/logo.svg"
            alt={tHeader('logoAlt')}
            width={40}
            height={40}
            className="mr-3"
            priority
          />
          <h1 className="text-2xl font-bold leading-[1.1]">
            {t.rich('title', {
              regular: (chunks) => <span>{chunks}</span>,
              break: (chunks) => (
                <>
                  <br />
                  <span className="text-lg text-muted-foreground">
                    {chunks}
                  </span>
                </>
              ),
            })}
          </h1>
        </Link>
        {/* SEO优化的描述性文本 (对用户视觉隐藏) */}
        <p className="sr-only">
          {t('description', {
            defaultValue:
              'Professional OpenRouter free AI model browser with filtering, sorting, batch selection and multi-format export. Compatible with NewAPI and UniAPI.',
          })}
        </p>
        {/* 更新时间显示逻辑 */}
        <div className="flex items-center text-xs text-muted-foreground mt-1 h-4">
          {isLoading && !lastFetched ? (
            <Skeleton className="h-4 w-48 rounded" />
          ) : lastFetched ? (
            isValidating ? (
              <>
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                <span>
                  {t('updating', {
                    date: formatDateTime(lastFetched),
                  })}
                </span>
              </>
            ) : (
              <span>
                {t('lastUpdated', {
                  date: formatDateTime(lastFetched),
                })}
              </span>
            )
          ) : null}
        </div>
      </div>
      <nav
        className="flex items-center space-x-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <Button
          onClick={handleRefresh}
          aria-label="Refresh AI models data"
          title="Refresh AI models data"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('refresh')}
        </Button>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};
