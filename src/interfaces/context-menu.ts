import { ReactNode } from 'react';

export interface IContextMenuItemProps {
  icon?: ReactNode;
  label: string;
  variant?: 'default' | 'danger';
  class_name?: string;
  is_disabled?: boolean;
  OnClick?: () => void;
}

export interface IContextMenuDividerProps {
  class_name?: string;
}

export interface IContextMenuGroupProps {
  children: ReactNode;
  class_name?: string;
  has_divider?: boolean;
}

export interface IContextMenuSubMenuProps {
  trigger_icon?: ReactNode;
  trigger_label: string;
  children: ReactNode;
  class_name?: string;
  trigger_class_name?: string;
}

export interface IContextMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  trigger_class_name?: string;
  menu_class_name?: string;
  close_on_click?: boolean;
  position?: 'auto' | 'fixed';
  offset_x?: number;
  offset_y?: number;
}
