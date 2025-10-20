'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Cn } from '../utils/cn';

import type {
  IContextMenuDividerProps,
  IContextMenuGroupProps,
  IContextMenuItemProps,
  IContextMenuProps,
  IContextMenuSubMenuProps
} from '../interfaces/context-menu';

export function ContextMenuItem({
  icon,
  label,
  variant = 'default',
  class_name,
  is_disabled = false,
  OnClick
}: IContextMenuItemProps) {
  return (
    <button
      type="button"
      onClick={OnClick}
      disabled={is_disabled}
      className={Cn(
        'flex w-full items-center gap-x-3 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium transition-colors',
        variant === 'default' &&
          !is_disabled &&
          'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
        variant === 'danger' &&
          !is_disabled &&
          'text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-hidden dark:text-red-400 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10',
        is_disabled && 'pointer-events-none opacity-50',
        class_name
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export function ContextMenuDivider({ class_name }: IContextMenuDividerProps) {
  return (
    <div
      className={Cn(
        'my-1 h-px w-full bg-gray-200 dark:bg-neutral-800',
        class_name
      )}
    />
  );
}

export function ContextMenuGroup({
  children,
  class_name,
  has_divider = false
}: IContextMenuGroupProps) {
  return (
    <div className={Cn('space-y-0.5 p-1', class_name)}>
      {children}
      {has_divider && <ContextMenuDivider />}
    </div>
  );
}

export function ContextMenuSubMenu({
  trigger_icon,
  trigger_label,
  children,
  class_name,
  trigger_class_name
}: IContextMenuSubMenuProps) {
  const [is_open, set_is_open] = useState(false);
  const [position, set_position] = useState<'right' | 'left'>('right');
  const submenu_ref = useRef<HTMLDivElement>(null);
  const menu_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (is_open && menu_ref.current && submenu_ref.current) {
      const menu_rect = menu_ref.current.getBoundingClientRect();
      const viewport_width = window.innerWidth;
      if (menu_rect.right > viewport_width - 10) {
        set_position('left');
      } else {
        set_position('right');
      }
    }
  }, [is_open]);

  return (
    <div
      ref={submenu_ref}
      className="relative"
      onMouseEnter={() => set_is_open(true)}
      onMouseLeave={() => set_is_open(false)}
    >
      <button
        type="button"
        className={Cn(
          'flex w-full items-center gap-x-3 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
          trigger_class_name
        )}
      >
        {trigger_icon && (
          <span className="shrink-0 [&>svg]:size-3.5">{trigger_icon}</span>
        )}
        <span className="flex-1">{trigger_label}</span>
        <svg
          className="ms-auto size-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
      <AnimatePresence>
        {is_open && (
          <motion.div
            ref={menu_ref}
            initial={{ opacity: 0, x: position === 'right' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position === 'right' ? -10 : 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={Cn(
              'absolute top-0 z-10 min-w-60 rounded-lg border border-gray-200 bg-white shadow-md before:absolute before:top-0 before:h-full before:w-4 after:absolute after:top-0 after:h-full after:w-4 dark:border-neutral-700 dark:bg-neutral-800',
              position === 'right'
                ? 'left-full ml-1 before:-left-4 after:-right-4'
                : 'right-full mr-1 before:-right-4 after:-left-4',
              class_name
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContextMenu({
  trigger,
  children,
  trigger_class_name,
  menu_class_name,
  close_on_click = true,
  position = 'auto',
  offset_x = 0,
  offset_y = 8
}: IContextMenuProps) {
  const [is_open, set_is_open] = useState(false);
  const [menu_position, set_menu_position] = useState({ x: 0, y: 0 });
  const [adjusted_position, set_adjusted_position] = useState<{
    horizontal: 'left' | 'right';
    vertical: 'top' | 'bottom';
  }>({
    horizontal: 'right',
    vertical: 'bottom'
  });
  const trigger_ref = useRef<HTMLDivElement>(null);
  const menu_ref = useRef<HTMLDivElement>(null);
  const long_press_timer_ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function HandleContextMenu(event: MouseEvent) {
      if (
        trigger_ref.current &&
        trigger_ref.current.contains(event.target as Node)
      ) {
        event.preventDefault();
        set_menu_position({ x: event.clientX, y: event.clientY });
        set_is_open(true);
      }
    }
    const trigger_element = trigger_ref.current;
    if (trigger_element) {
      trigger_element.addEventListener('contextmenu', HandleContextMenu);
    }
    return () => {
      if (trigger_element) {
        trigger_element.removeEventListener('contextmenu', HandleContextMenu);
      }
    };
  }, []);

  useEffect(() => {
    function HandleTouchStart(event: TouchEvent) {
      if (
        trigger_ref.current &&
        trigger_ref.current.contains(event.target as Node)
      ) {
        const touch = event.touches[0];
        long_press_timer_ref.current = setTimeout(() => {
          event.preventDefault();
          set_menu_position({ x: touch.clientX, y: touch.clientY });
          set_is_open(true);
        }, 500);
      }
    }
    function HandleTouchEnd() {
      if (long_press_timer_ref.current) {
        clearTimeout(long_press_timer_ref.current);
        long_press_timer_ref.current = null;
      }
    }
    function HandleTouchMove() {
      if (long_press_timer_ref.current) {
        clearTimeout(long_press_timer_ref.current);
        long_press_timer_ref.current = null;
      }
    }
    const trigger_element = trigger_ref.current;
    if (trigger_element) {
      trigger_element.addEventListener('touchstart', HandleTouchStart);
      trigger_element.addEventListener('touchend', HandleTouchEnd);
      trigger_element.addEventListener('touchmove', HandleTouchMove);
    }
    return () => {
      if (trigger_element) {
        trigger_element.removeEventListener('touchstart', HandleTouchStart);
        trigger_element.removeEventListener('touchend', HandleTouchEnd);
        trigger_element.removeEventListener('touchmove', HandleTouchMove);
      }
      if (long_press_timer_ref.current) {
        clearTimeout(long_press_timer_ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (is_open && menu_ref.current) {
      requestAnimationFrame(() => {
        if (!menu_ref.current) return;
        const menu_rect = menu_ref.current.getBoundingClientRect();
        const viewport_width = window.innerWidth;
        const viewport_height = window.innerHeight;
        let new_horizontal: 'left' | 'right' = 'right';
        let new_vertical: 'top' | 'bottom' = 'bottom';
        if (menu_position.x + menu_rect.width > viewport_width - 10) {
          new_horizontal = 'left';
        }
        if (menu_position.y + menu_rect.height > viewport_height - 10) {
          new_vertical = 'top';
        }
        set_adjusted_position({
          horizontal: new_horizontal,
          vertical: new_vertical
        });
      });
    }
  }, [is_open, menu_position]);

  useEffect(() => {
    function HandleClickOutside(event: MouseEvent) {
      if (
        menu_ref.current &&
        !menu_ref.current.contains(event.target as Node)
      ) {
        set_is_open(false);
      }
    }
    if (is_open) {
      document.addEventListener('mousedown', HandleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', HandleClickOutside);
    };
  }, [is_open]);

  useEffect(() => {
    function HandleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        set_is_open(false);
      }
    }
    if (is_open) {
      document.addEventListener('keydown', HandleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', HandleEscapeKey);
    };
  }, [is_open]);

  function HandleMenuClick() {
    if (close_on_click) {
      set_is_open(false);
    }
  }

  const GetMenuStyle = () => {
    if (position === 'fixed') {
      return {
        position: 'fixed' as const,
        left: `${menu_position.x + offset_x}px`,
        top: `${menu_position.y + offset_y}px`
      };
    }
    const style: React.CSSProperties = {
      position: 'fixed' as const
    };
    if (adjusted_position.horizontal === 'right') {
      style.left = `${menu_position.x + offset_x}px`;
    } else {
      style.right = `${window.innerWidth - menu_position.x + offset_x}px`;
    }
    if (adjusted_position.vertical === 'bottom') {
      style.top = `${menu_position.y + offset_y}px`;
    } else {
      style.bottom = `${window.innerHeight - menu_position.y + offset_y}px`;
    }
    return style;
  };

  return (
    <>
      {/* Trigger Element */}
      <div ref={trigger_ref} className={trigger_class_name}>
        {trigger}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {is_open && (
          <motion.div
            ref={menu_ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={GetMenuStyle()}
            className={Cn(
              'z-20 min-w-[240px] rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800',
              menu_class_name
            )}
            onClick={HandleMenuClick}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
