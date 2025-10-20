'use client';

import { DashboardLayout } from '@/components/layouts';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  return (
    <DashboardLayout>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          {t('common.dashboard')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('common.welcome')}
        </p>
      </div>
    </DashboardLayout>
  );
}
