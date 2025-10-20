'use client';

import { LoadingLanguage } from '@/components/loading-language';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { routing } from '@/i18n/routing';
import { AnimatePresence } from 'framer-motion';
import { NextIntlClientProvider } from 'next-intl';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { TLocale } from '@/types/locale';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params?.locale as string;
  const [messages, set_messages] = useState<Record<string, unknown> | null>(
    null
  );
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored_theme = localStorage.getItem('theme_state');
      if (stored_theme) {
        try {
          const parsed = JSON.parse(stored_theme);
          if (parsed.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    set_is_loading(true);
    set_messages(null);
    if (!routing.locales.includes(locale as TLocale)) {
      notFound();
    }
    const loading_start_time = Date.now();
    const MINIMUM_LOADING_DURATION = 500;
    import(`../../../messages/${locale}.json`)
      .then(module => {
        const elapsed_time = Date.now() - loading_start_time;
        const remaining_time = Math.max(
          0,
          MINIMUM_LOADING_DURATION - elapsed_time
        );
        setTimeout(() => {
          set_messages(module.default);
          set_is_loading(false);
        }, remaining_time);
      })
      .catch(() => {
        notFound();
      });
  }, [locale]);

  return (
    <>
      <AnimatePresence mode="wait">
        {(is_loading || !messages) && (
          <LoadingLanguage key="loading" locale={locale} />
        )}
      </AnimatePresence>
      {!is_loading && messages && (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>{children}</ReduxProvider>
        </NextIntlClientProvider>
      )}
    </>
  );
}
