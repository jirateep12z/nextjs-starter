'use client';

import { DesktopIcon, MoonIcon, SunIcon } from '@/components/icons';
import { UseAppDispatch, UseAppSelector } from '@/hooks/use-redux';
import { HydrateTheme, SetTheme } from '@/store/slices/theme-slice';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { ContextMenu, ContextMenuGroup, ContextMenuItem } from './context-menu';
import { Tooltip } from './tooltip';

export function ThemeSwitcher() {
  const t = useTranslations();
  const dispatch = UseAppDispatch();
  const { theme, is_hydrated } = UseAppSelector(state => state.theme);

  useEffect(() => {
    if (!is_hydrated) {
      const stored_theme = localStorage.getItem('theme_state');
      if (stored_theme) {
        try {
          const parsed = JSON.parse(stored_theme);
          dispatch(HydrateTheme(parsed.theme || 'system'));
        } catch {
          dispatch(HydrateTheme('system'));
        }
      } else {
        dispatch(HydrateTheme('system'));
      }
    }
  }, [dispatch, is_hydrated]);

  useEffect(() => {
    if (!is_hydrated || theme !== 'system') return;
    const media_query = window.matchMedia('(prefers-color-scheme: dark)');
    const HandleThemeChange = (event: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (event.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    if (media_query.addEventListener) {
      media_query.addEventListener('change', HandleThemeChange);
    } else {
      media_query.addListener(HandleThemeChange);
    }
    return () => {
      if (media_query.removeEventListener) {
        media_query.removeEventListener('change', HandleThemeChange);
      } else {
        media_query.removeListener(HandleThemeChange);
      }
    };
  }, [is_hydrated, theme]);

  const HandleToggleTheme = () => {
    if (theme === 'system') {
      const prefers_dark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      dispatch(SetTheme(prefers_dark ? 'light' : 'dark'));
    } else {
      dispatch(SetTheme(theme === 'light' ? 'dark' : 'light'));
    }
  };

  const HandleSetTheme = (selected_theme: 'light' | 'dark' | 'system') => {
    dispatch(SetTheme(selected_theme));
  };

  if (!is_hydrated) {
    return (
      <div className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800" />
    );
  }

  return (
    <ContextMenu
      trigger={
        <Tooltip
          content={
            theme === 'system'
              ? t('theme.select_theme')
              : theme === 'light'
                ? t('theme.switch_to_dark')
                : t('theme.switch_to_light')
          }
        >
          <button
            onClick={HandleToggleTheme}
            className="relative z-10 flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label={
              theme === 'system'
                ? t('theme.select_theme')
                : theme === 'light'
                  ? t('theme.switch_to_dark')
                  : t('theme.switch_to_light')
            }
          >
            <motion.div
              key={theme}
              initial={{ y: theme === 'light' ? -20 : 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: theme === 'light' ? 20 : -20, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.3
              }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? (
                <SunIcon class_name="size-5 fill-current" />
              ) : theme === 'dark' ? (
                <MoonIcon class_name="size-5 fill-current" />
              ) : (
                <DesktopIcon class_name="size-5 fill-current" />
              )}
            </motion.div>
          </button>
        </Tooltip>
      }
    >
      <ContextMenuGroup>
        <ContextMenuItem
          icon={<SunIcon class_name="size-4 fill-current" />}
          label={t('theme.light_mode')}
          class_name={
            theme === 'light'
              ? 'cursor-pointer bg-neutral-100 dark:bg-white/10'
              : 'cursor-pointer'
          }
          OnClick={() => HandleSetTheme('light')}
        />
        <ContextMenuItem
          icon={<MoonIcon class_name="size-4 fill-current" />}
          label={t('theme.dark_mode')}
          class_name={
            theme === 'dark'
              ? 'cursor-pointer bg-neutral-100 dark:bg-white/10'
              : 'cursor-pointer'
          }
          OnClick={() => HandleSetTheme('dark')}
        />
        <ContextMenuItem
          icon={<DesktopIcon class_name="size-4 fill-current" />}
          label={t('theme.system_mode')}
          class_name={
            theme === 'system'
              ? 'cursor-pointer bg-neutral-100 dark:bg-white/10'
              : 'cursor-pointer'
          }
          OnClick={() => HandleSetTheme('system')}
        />
      </ContextMenuGroup>
    </ContextMenu>
  );
}
