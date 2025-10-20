import { configureStore } from '@reduxjs/toolkit';
import sidebar_slice from './slices/sidebar-slice';
import theme_slice from './slices/theme-slice';

export const MakeStore = () => {
  return configureStore({
    reducer: {
      sidebar: sidebar_slice,
      theme: theme_slice
    }
  });
};

export type TAppStore = ReturnType<typeof MakeStore>;
export type TRootState = ReturnType<TAppStore['getState']>;
export type TAppDispatch = TAppStore['dispatch'];
