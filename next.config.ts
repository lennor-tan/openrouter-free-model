import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default withNextIntlConfig(nextConfig);
