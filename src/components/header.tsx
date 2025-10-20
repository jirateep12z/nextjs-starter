'use client';

import {
  AnglesLeftIcon,
  AnglesRightIcon,
  CircleUserIcon,
  EllipsisIcon,
  LeftFromBracketIcon,
  MenuIcon,
  NextJSIcon,
  XMarkIcon
} from '@/components/icons';
import { UseAppDispatch, UseAppSelector } from '@/hooks/use-redux';
import { Link } from '@/i18n/routing';
import {
  ToggleMobileSidebar,
  ToggleSidebar
} from '@/store/slices/sidebar-slice';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Dropdown, DropdownDivider, DropdownItem } from './dropdown';
import { LanguageSwitcher } from './language-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { Tooltip } from './tooltip';

export function Header() {
  const t = useTranslations();
  const dispatch = UseAppDispatch();
  const { is_collapsed, is_mobile_open } = UseAppSelector(
    state => state.sidebar
  );
  const [is_mobile, set_is_mobile] = useState(false);
  const [is_mobile_actions_open, set_is_mobile_actions_open] = useState(false);

  useEffect(() => {
    const HandleResize = () => {
      set_is_mobile(window.innerWidth < 1280);
    };
    HandleResize();
    window.addEventListener('resize', HandleResize);
    return () => window.removeEventListener('resize', HandleResize);
  }, []);

  const HandleToggleSidebar = () => {
    if (is_mobile) {
      dispatch(ToggleMobileSidebar());
    } else {
      dispatch(ToggleSidebar());
    }
  };

  const HandleToggleMobileActions = () => {
    set_is_mobile_actions_open(!is_mobile_actions_open);
  };

  return (
    <header className="sticky top-0 z-10 flex w-full flex-col border-neutral-200 bg-white xl:h-[72px] xl:border-b dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex grow flex-col items-center justify-between xl:flex-row xl:px-4">
        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between gap-3 border-b border-neutral-200 p-4 xl:justify-normal xl:border-b-0 xl:px-0 dark:border-neutral-800">
          <Tooltip
            content={
              is_mobile
                ? is_mobile_open
                  ? t('common.close_menu')
                  : t('common.open_menu')
                : is_collapsed
                  ? t('common.expand_sidebar')
                  : t('common.collapse_sidebar')
            }
          >
            <button
              onClick={HandleToggleSidebar}
              className="z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Toggle Sidebar"
            >
              {is_mobile ? (
                is_mobile_open ? (
                  <XMarkIcon class_name="size-5 fill-current" />
                ) : (
                  <MenuIcon class_name="size-5 fill-current" />
                )
              ) : is_collapsed ? (
                <AnglesLeftIcon class_name="size-5 fill-current" />
              ) : (
                <AnglesRightIcon class_name="size-5 fill-current" />
              )}
            </button>
          </Tooltip>
          <Link
            href="/"
            className="text-neutral-800 xl:hidden dark:text-neutral-200"
            title="Home"
          >
            <NextJSIcon class_name="w-full h-5 block xl:hidden fill-current" />
          </Link>
          <button
            onClick={HandleToggleMobileActions}
            className="z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-100 xl:hidden dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Toggle Actions Menu"
          >
            <EllipsisIcon class_name="size-5 fill-current" />
          </button>
        </div>

        {/* Mobile Actions Menu */}
        <div
          className={`w-full transition-all duration-300 ease-in-out xl:hidden ${
            is_mobile_actions_open
              ? 'max-h-20 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex w-full items-center justify-end gap-3 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Dropdown
              tooltip="@jirateep12z"
              tooltip_position="bottom"
              trigger={
                <button
                  className="z-10 flex h-10 w-auto cursor-pointer items-center justify-center gap-3 rounded-xl border border-neutral-200 pr-3 pl-1 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  aria-label="User menu"
                >
                  <Image
                    className="size-8 rounded-lg"
                    src="https://avatars.githubusercontent.com/u/70580937?v=4"
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium">@jirateep12z</span>
                </button>
              }
            >
              <DropdownItem
                icon={<CircleUserIcon class_name="size-5 fill-current" />}
                label={t('header.edit_profile')}
              />
              <DropdownDivider />
              <DropdownItem
                icon={<LeftFromBracketIcon class_name="size-5 fill-current" />}
                label={t('header.logout')}
              />
            </Dropdown>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden w-full items-center justify-between gap-3 p-4 xl:flex xl:justify-end xl:px-0">
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Dropdown
              tooltip="@jirateep12z"
              tooltip_position="bottom"
              trigger={
                <button
                  className="z-10 flex h-10 w-auto cursor-pointer items-center justify-center gap-3 rounded-xl border border-neutral-200 pr-3 pl-1 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  aria-label="User menu"
                >
                  <Image
                    className="size-8 rounded-lg"
                    src="https://avatars.githubusercontent.com/u/70580937?v=4"
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium">@jirateep12z</span>
                </button>
              }
            >
              <DropdownItem
                icon={<CircleUserIcon class_name="size-5 fill-current" />}
                label={t('header.edit_profile')}
              />
              <DropdownDivider />
              <DropdownItem
                icon={<LeftFromBracketIcon class_name="size-5 fill-current" />}
                label={t('header.logout')}
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
