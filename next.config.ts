import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const next_config: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  cacheComponents: true
};

export default withNextIntl(next_config);
