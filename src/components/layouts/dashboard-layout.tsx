'use client';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { UseAppSelector } from '@/hooks/use-redux';
import { Cn } from '@/utils/cn';

import type { IDashboardLayoutProps } from '@/interfaces/dashboard-layout';

export function DashboardLayout({ children }: IDashboardLayoutProps) {
  const { is_collapsed, is_hovered } = UseAppSelector(state => state.sidebar);

  return (
    <div className="min-h-screen xl:flex">
      <Sidebar />
      <div
        className={Cn(
          'flex-1 transition-all duration-300 ease-in-out',
          is_collapsed && !is_hovered ? 'xl:ml-[72px]' : 'xl:ml-[300px]'
        )}
      >
        <Header />
        <div className="mx-auto w-full p-4">{children}</div>
      </div>
    </div>
  );
}
