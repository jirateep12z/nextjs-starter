'use client';

import { NextJSIcon } from '@/components/icons';
import { UseAppDispatch, UseAppSelector } from '@/hooks/use-redux';
import { Link } from '@/i18n/routing';
import {
  HydrateSidebar,
  SetMobileSidebarOpen,
  SetSidebarHovered,
  STORAGE_KEY
} from '@/store/slices/sidebar-slice';
import { Cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const dispatch = UseAppDispatch();
  const { is_collapsed, is_hovered, is_hydrated, is_mobile_open } =
    UseAppSelector(state => state.sidebar);
  const [is_mobile, set_is_mobile] = useState(false);

  useEffect(() => {
    if (!is_hydrated) {
      try {
        const stored_state = localStorage.getItem(STORAGE_KEY);
        if (stored_state) {
          const parsed = JSON.parse(stored_state);
          dispatch(HydrateSidebar(parsed.is_collapsed ?? false));
        } else {
          dispatch(HydrateSidebar(false));
        }
      } catch (error) {
        console.error('Error loading sidebar state:', error);
        dispatch(HydrateSidebar(false));
      }
    }
  }, [dispatch, is_hydrated]);

  useEffect(() => {
    const HandleResize = () => {
      const is_mobile_view = window.innerWidth < 1280;
      set_is_mobile(is_mobile_view);
      if (is_mobile_view) {
        dispatch(SetSidebarHovered(false));
      } else {
        dispatch(SetMobileSidebarOpen(false));
      }
    };
    HandleResize();
    window.addEventListener('resize', HandleResize);
    return () => window.removeEventListener('resize', HandleResize);
  }, [dispatch]);

  const GetSidebarWidth = () => {
    if (is_mobile || is_mobile_open) return 'w-[300px]';
    if (is_collapsed && !is_hovered) return 'w-[72px]';
    return 'w-[300px]';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {is_mobile_open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 xl:z-10 xl:hidden"
          onClick={() => dispatch(SetMobileSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={Cn(
          'fixed top-0 left-0 z-20 flex h-full flex-col transition-all duration-300 ease-in-out xl:z-10 xl:translate-x-0',
          GetSidebarWidth(),
          is_mobile_open ? 'translate-x-0' : '-translate-x-full'
        )}
        onMouseEnter={() => {
          if (is_collapsed && window.innerWidth >= 1280) {
            dispatch(SetSidebarHovered(true));
          }
        }}
        onMouseLeave={() => {
          if (is_collapsed) {
            dispatch(SetSidebarHovered(false));
          }
        }}
      >
        <div className="h-full rounded-xl border-r border-neutral-200 bg-white text-neutral-800 xl:rounded-none dark:border-neutral-800 dark:bg-neutral-900">
          {/* Logo */}
          <div className="my-4 flex h-10 items-center justify-center">
            <Link
              href="/"
              className="text-neutral-800 dark:text-neutral-200"
              title="Home"
            >
              {is_collapsed && !is_hovered && !is_mobile ? (
                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-800 dark:bg-neutral-200">
                  <span className="text-xl font-bold text-neutral-200 dark:text-neutral-800">
                    N
                  </span>
                </div>
              ) : (
                <>
                  <NextJSIcon class_name="block dark:hidden w-full h-8 fill-current" />
                  <NextJSIcon class_name="hidden dark:block w-full h-8 fill-current" />
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <div className="no-scrollbar flex flex-col overflow-x-hidden overflow-y-auto px-5 duration-300 ease-linear">
            <nav className="mb-6">
              <div className="flex flex-col gap-4"></div>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
