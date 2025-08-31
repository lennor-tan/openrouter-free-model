import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntlConfig(nextConfig);
