import type { ReactNode } from 'react';

export interface ITooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  class_name?: string;
  content_class_name?: string;
  disabled?: boolean;
  show_arrow?: boolean;
  offset?: number;
  animation?: 'fade' | 'scale' | 'slide';
}
