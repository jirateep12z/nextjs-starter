'use client';

import { MakeStore } from '@/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

import type { IReduxProviderProps } from '@/interfaces/redux-provider';
import type { TAppStore } from '@/store';

export function ReduxProvider({ children }: IReduxProviderProps) {
  const store_ref = useRef<TAppStore | undefined>(undefined);
  if (!store_ref.current) {
    store_ref.current = MakeStore();
  }
  return <Provider store={store_ref.current!}>{children}</Provider>;
}
