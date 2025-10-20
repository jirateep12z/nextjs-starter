'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useTransition } from 'react';
import { Dropdown, DropdownItem } from './dropdown';
import { LanguageIcon } from './icons';

export function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [is_pending, start_transition] = useTransition();

  const HandleChangeLocale = (new_locale: string) => {
    start_transition(() => {
      router.replace(pathname, { locale: new_locale });
    });
  };

  return (
    <Dropdown
      tooltip={t('language.switch_language')}
      tooltip_position="bottom"
      trigger={
        <button
          className="z-10 flex size-10 h-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
          disabled={is_pending}
          aria-label={t('language.switch_language')}
        >
          <LanguageIcon class_name="size-5 fill-current" />
        </button>
      }
    >
      <DropdownItem
        icon={
          <Image
            src="/images/flag/united-states.png"
            alt="US flag"
            width={24}
            height={24}
            className="rounded-full"
          />
        }
        label={t('language.english')}
        OnClick={() => HandleChangeLocale('en')}
        is_active={locale === 'en'}
      />
      <DropdownItem
        icon={
          <Image
            src="/images/flag/thailand.png"
            alt="TH flag"
            width={24}
            height={24}
            className="rounded-full"
          />
        }
        label={t('language.thai')}
        OnClick={() => HandleChangeLocale('th')}
        is_active={locale === 'th'}
      />
    </Dropdown>
  );
}
