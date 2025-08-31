'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('LanguageSwitcher');

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    const newPathname = pathname.replace(new RegExp(`^/${locale}`), '');
    router.replace(`/${newLocale}${newPathname || '/'}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-2 px-3"
          >
            <Globe className="h-5 w-5" />
            <span className="font-medium">{locale.toUpperCase()}</span>
            <span className="sr-only">{t('tooltip')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('tooltip')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
