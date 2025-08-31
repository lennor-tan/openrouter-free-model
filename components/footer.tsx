'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const t = useTranslations('HomePage');

  return (
    <footer className="text-center mt-10 py-4 border-t">
      <a
        href="https://github.com/jomonylw/openrouter-free-model"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center"
      >
        <Github className="mr-2 h-4 w-4" />
        {t('viewOnGithub')}
      </a>
    </footer>
  );
};
