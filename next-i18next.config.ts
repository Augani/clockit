import { UserConfig } from 'next-i18next';

const nextI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'], // Add supported languages
  },
};

export default nextI18NextConfig;
