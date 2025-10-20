import { ReactNode } from 'react';

export interface IDropdownItemProps {
  icon?: ReactNode;
  label: string;
  variant?: 'default' | 'danger';
  class_name?: string;
  is_active?: boolean;
  OnClick?: () => void;
}

export interface IDropdownDividerProps {
  class_name?: string;
}

export interface IDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  trigger_class_name?: string;
  menu_class_name?: string;
  close_on_click?: boolean;
  tooltip?: string;
  tooltip_position?: 'top' | 'bottom' | 'left' | 'right';
}
