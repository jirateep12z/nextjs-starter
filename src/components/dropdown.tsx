'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Cn } from '../utils/cn';
import { Tooltip } from './tooltip';

import type {
  IDropdownDividerProps,
  IDropdownItemProps,
  IDropdownProps
} from '../interfaces/dropdown';

export function DropdownItem({
  icon,
  label,
  variant = 'default',
  class_name,
  is_active = false,
  OnClick
}: IDropdownItemProps) {
  return (
    <li>
      <button
        onClick={OnClick}
        className={Cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium',
          variant === 'default' &&
            !is_active &&
            'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-white/5',
          variant === 'default' &&
            is_active &&
            'bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white',
          variant === 'danger' &&
            'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10',
          class_name
        )}
      >
        {icon && <>{icon}</>}
        {label}
      </button>
    </li>
  );
}

export function DropdownDivider({ class_name }: IDropdownDividerProps) {
  return (
    <li>
      <span
        className={Cn(
          'my-1.5 block h-px w-full bg-neutral-200 dark:bg-[#353C49]',
          class_name
        )}
      />
    </li>
  );
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  trigger_class_name,
  menu_class_name,
  close_on_click = true,
  tooltip,
  tooltip_position = 'top'
}: IDropdownProps) {
  const [is_open, set_is_open] = useState(false);
  const [adjusted_position, set_adjusted_position] = useState({
    horizontal: align,
    vertical: 'bottom' as 'bottom' | 'top'
  });
  const dropdown_ref = useRef<HTMLDivElement>(null);
  const menu_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (is_open && menu_ref.current && dropdown_ref.current) {
      requestAnimationFrame(() => {
        if (!menu_ref.current) return;
        const menu_rect = menu_ref.current.getBoundingClientRect();
        const viewport_width = window.innerWidth;
        const viewport_height = window.innerHeight;
        let new_horizontal = align;
        let new_vertical: 'bottom' | 'top' = 'bottom';
        if (align === 'left') {
          if (menu_rect.right > viewport_width - 10) {
            new_horizontal = 'right';
          }
        } else if (align === 'right') {
          if (menu_rect.left < 10) {
            new_horizontal = 'left';
          }
        } else if (align === 'center') {
          if (menu_rect.right > viewport_width - 10) {
            new_horizontal = 'right';
          } else if (menu_rect.left < 10) {
            new_horizontal = 'left';
          }
        }
        if (menu_rect.bottom > viewport_height - 10) {
          new_vertical = 'top';
        }
        set_adjusted_position({
          horizontal: new_horizontal,
          vertical: new_vertical
        });
      });
    } else {
      set_adjusted_position({
        horizontal: align,
        vertical: 'bottom'
      });
    }
  }, [is_open, align]);

  useEffect(() => {
    function HandleClickOutside(event: MouseEvent) {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
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

  function HandleToggle() {
    set_is_open(!is_open);
  }

  function HandleMenuClick() {
    if (close_on_click) {
      set_is_open(false);
    }
  }

  const GetHorizontalClasses = () => {
    if (adjusted_position.horizontal === 'left') return 'left-0';
    if (adjusted_position.horizontal === 'right') return 'right-0';
    return 'left-1/2 -translate-x-1/2';
  };

  const GetVerticalClasses = () => {
    if (adjusted_position.vertical === 'bottom') return 'mt-2 top-full';
    return 'bottom-full mb-2';
  };

  const TriggerElement = (
    <div onClick={HandleToggle} className={trigger_class_name}>
      {trigger}
    </div>
  );

  return (
    <div ref={dropdown_ref} className="relative inline-block">
      {/* Trigger Button */}
      {tooltip ? (
        <Tooltip content={tooltip} position={tooltip_position}>
          {TriggerElement}
        </Tooltip>
      ) : (
        TriggerElement
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {is_open && (
          <motion.div
            ref={menu_ref}
            initial={{
              opacity: 0,
              y: adjusted_position.vertical === 'bottom' ? -10 : 10,
              scale: 0.95
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: adjusted_position.vertical === 'bottom' ? -10 : 10,
              scale: 0.95
            }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={Cn(
              'absolute z-10 w-full min-w-[240px] rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-800',
              GetHorizontalClasses(),
              GetVerticalClasses(),
              menu_class_name
            )}
            onClick={HandleMenuClick}
          >
            <ul className="flex flex-col gap-1">{children}</ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
