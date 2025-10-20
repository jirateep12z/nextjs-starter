import { Noto_Sans_Thai } from 'next/font/google';
import '../globals.css';

import { Loading } from '@/components/loading';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ClientProviders } from './providers';

import type { TLocale } from '@/types/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Starter',
  description:
    'A modern Next.js starter template with TypeScript, Tailwind CSS, and internationalization support.'
};

const noto_sans_thai = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['latin', 'thai']
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as TLocale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme_state');
                  const theme = stored ? JSON.parse(stored).theme : null;
                  const prefers_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const is_dark = theme === 'dark' || (!theme && prefers_dark);
                  if (is_dark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={noto_sans_thai.variable}>
        <ClientProviders>
          <Loading />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
