import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntlConfig(nextConfig);
