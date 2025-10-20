'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { TGlassShadowConfig, TTranslationModule } from '@/types/loading';

const MINIMUM_LOADING_DURATION = 500;

export function Loading() {
  const pathname = usePathname();
  const search_params = useSearchParams();
  const [is_loading, set_is_loading] = useState(false);
  const [is_mounted, set_is_mounted] = useState(false);
  const [is_dark_mode, set_is_dark_mode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [loading_text, set_loading_text] = useState('Loading');
  const loading_start_time = useRef<number | null>(null);

  useEffect(() => {
    set_is_mounted(true);
    const CheckDarkMode = () => {
      const is_dark = document.documentElement.classList.contains('dark');
      set_is_dark_mode(is_dark);
    };
    CheckDarkMode();
    const observer = new MutationObserver(CheckDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const locale = pathname.split('/')[1] || 'en';
    import(`../../messages/${locale}.json`)
      .then((module: TTranslationModule) => {
        set_loading_text(module.default.common.loading || 'Loading');
      })
      .catch(() => {
        set_loading_text('Loading');
      });
  }, [pathname]);

  useEffect(() => {
    if (!is_mounted) return;
    if (loading_start_time.current) {
      const elapsed_time = Date.now() - loading_start_time.current;
      const remaining_time = Math.max(
        0,
        MINIMUM_LOADING_DURATION - elapsed_time
      );
      setTimeout(() => {
        set_is_loading(false);
        loading_start_time.current = null;
      }, remaining_time);
    }
  }, [pathname, search_params, is_mounted]);

  useEffect(() => {
    const HandleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const current_url = new URL(window.location.href);
      const target_url = new URL(target.href);
      if (target_url.pathname !== current_url.pathname) {
        loading_start_time.current = Date.now();
        set_is_loading(true);
      }
    };
    const HandleMutation = () => {
      const anchor_elements = document.querySelectorAll('a[href]');
      anchor_elements.forEach(anchor => {
        anchor.addEventListener('click', HandleAnchorClick as EventListener);
      });
    };
    HandleMutation();
    const observer = new MutationObserver(HandleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
      const anchor_elements = document.querySelectorAll('a[href]');
      anchor_elements.forEach(anchor => {
        anchor.removeEventListener('click', HandleAnchorClick as EventListener);
      });
    };
  }, []);

  if (!is_mounted) {
    return null;
  }

  const GetGlassShadow = (config: TGlassShadowConfig) => {
    const { light_reflex, dark_reflex } = config;
    return `
      inset 0 0 0 1px color-mix(in srgb, #ffffff ${light_reflex * 10}%, transparent),
      inset 1.8px 3px 0px -2px color-mix(in srgb, #ffffff ${light_reflex * 90}%, transparent),
      inset -2px -2px 0px -2px color-mix(in srgb, #ffffff ${light_reflex * 80}%, transparent),
      inset -3px -8px 1px -6px color-mix(in srgb, #ffffff ${light_reflex * 60}%, transparent),
      inset -0.3px -1px 4px 0px color-mix(in srgb, #000000 ${dark_reflex * 12}%, transparent),
      inset -1.5px 2.5px 0px -2px color-mix(in srgb, #000000 ${dark_reflex * 20}%, transparent),
      inset 0px 3px 4px -2px color-mix(in srgb, #000000 ${dark_reflex * 20}%, transparent),
      inset 2px -6.5px 1px -4px color-mix(in srgb, #000000 ${dark_reflex * 10}%, transparent),
      0px 1px 5px 0px color-mix(in srgb, #000000 ${dark_reflex * 10}%, transparent),
      0px 6px 16px 0px color-mix(in srgb, #000000 ${dark_reflex * 8}%, transparent)
    `;
  };

  return (
    <AnimatePresence mode="wait">
      {is_loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/20 saturate-200 backdrop-blur-sm dark:bg-neutral-900/20"
          style={{
            boxShadow: GetGlassShadow({
              light_reflex: is_dark_mode ? 0.3 : 1,
              dark_reflex: is_dark_mode ? 2 : 1
            })
          }}
        >
          {/* Loading Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3">
              {[0, 1, 2].map(index => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.15
                  }}
                  className="size-4 rounded-xl bg-neutral-800 dark:bg-white"
                />
              ))}
            </div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-lg font-medium text-neutral-800 dark:text-white"
            >
              {loading_text}
              {[0, 1, 2].map(index => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    times: [0, 0.2, 0.8, 1],
                    ease: 'easeInOut'
                  }}
                >
                  .
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
