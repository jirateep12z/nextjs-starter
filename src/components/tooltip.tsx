'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Cn } from '../utils/cn';

import type { ITooltipProps } from '../interfaces/tooltip';

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  class_name,
  content_class_name,
  disabled = false,
  show_arrow = true,
  offset = 8,
  animation = 'fade'
}: ITooltipProps) {
  const [is_visible, set_is_visible] = useState(false);
  const [adjusted_position, set_adjusted_position] = useState(position);
  const timeout_ref = useRef<NodeJS.Timeout | undefined>(undefined);
  const trigger_ref = useRef<HTMLDivElement>(null);
  const tooltip_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (is_visible && tooltip_ref.current && trigger_ref.current) {
      requestAnimationFrame(() => {
        if (!tooltip_ref.current) return;
        const tooltip_rect = tooltip_ref.current.getBoundingClientRect();
        const viewport_width = window.innerWidth;
        const viewport_height = window.innerHeight;
        let new_position = position;
        if (position === 'left' && tooltip_rect.left < 10) {
          new_position = 'right';
        } else if (
          position === 'right' &&
          tooltip_rect.right > viewport_width - 10
        ) {
          new_position = 'left';
        }
        if (position === 'top' && tooltip_rect.top < 10) {
          new_position = 'bottom';
        } else if (
          position === 'bottom' &&
          tooltip_rect.bottom > viewport_height - 10
        ) {
          new_position = 'top';
        }
        set_adjusted_position(new_position);
      });
    } else {
      set_adjusted_position(position);
    }
  }, [is_visible, position]);

  function HandleMouseEnter() {
    if (disabled) return;
    timeout_ref.current = setTimeout(() => {
      set_is_visible(true);
    }, delay);
  }

  function HandleMouseLeave() {
    if (timeout_ref.current) {
      clearTimeout(timeout_ref.current);
    }
    set_is_visible(false);
  }

  useEffect(() => {
    return () => {
      if (timeout_ref.current) {
        clearTimeout(timeout_ref.current);
      }
    };
  }, []);

  const GetPositionClasses = () => {
    return Cn(
      'absolute',
      adjusted_position === 'top' && 'bottom-full left-1/2 -translate-x-1/2',
      adjusted_position === 'bottom' && 'top-full left-1/2 -translate-x-1/2',
      adjusted_position === 'left' && 'right-full top-1/2 -translate-y-1/2',
      adjusted_position === 'right' && 'left-full top-1/2 -translate-y-1/2'
    );
  };

  const GetArrowClasses = () => {
    return Cn(
      'absolute h-2 w-2 rotate-45',
      adjusted_position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
      adjusted_position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
      adjusted_position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
      adjusted_position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
    );
  };

  const GetAnimationVariants = () => {
    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
      },
      slide: {
        initial: {
          opacity: 0,
          y:
            adjusted_position === 'top'
              ? 10
              : adjusted_position === 'bottom'
                ? -10
                : 0,
          x:
            adjusted_position === 'left'
              ? 10
              : adjusted_position === 'right'
                ? -10
                : 0
        },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: {
          opacity: 0,
          y:
            adjusted_position === 'top'
              ? 10
              : adjusted_position === 'bottom'
                ? -10
                : 0,
          x:
            adjusted_position === 'left'
              ? 10
              : adjusted_position === 'right'
                ? -10
                : 0
        }
      }
    };
    return variants[animation];
  };

  const animation_variants = GetAnimationVariants();

  return (
    <div
      ref={trigger_ref}
      className={Cn('relative inline-block', class_name)}
      onMouseEnter={HandleMouseEnter}
      onMouseLeave={HandleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {is_visible && !disabled && (
          <motion.div
            ref={tooltip_ref}
            initial={animation_variants.initial}
            animate={animation_variants.animate}
            exit={animation_variants.exit}
            transition={{
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={Cn(
              'pointer-events-none z-20 hidden rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium whitespace-nowrap text-white md:block dark:bg-neutral-800',
              GetPositionClasses(),
              content_class_name
            )}
            style={{
              marginBottom:
                adjusted_position === 'top' ? `${offset}px` : undefined,
              marginTop:
                adjusted_position === 'bottom' ? `${offset}px` : undefined,
              marginRight:
                adjusted_position === 'left' ? `${offset}px` : undefined,
              marginLeft:
                adjusted_position === 'right' ? `${offset}px` : undefined
            }}
          >
            {content}

            {/* Arrow */}
            {show_arrow && (
              <div
                className={Cn(
                  'bg-neutral-900 dark:bg-neutral-800',
                  GetArrowClasses()
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
