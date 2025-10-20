import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { TThemeMode } from '@/types/theme';

export const STORAGE_KEY = 'theme_state';

export interface IThemeState {
  theme: TThemeMode;
  is_hydrated: boolean;
}

const initial_state: IThemeState = {
  theme: 'system',
  is_hydrated: false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: initial_state,
  reducers: {
    ToggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ theme: state.theme })
        );
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    SetTheme: (state, action: PayloadAction<TThemeMode>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ theme: state.theme })
        );
        if (state.theme === 'system') {
          const prefers_dark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          if (prefers_dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    HydrateTheme: (state, action: PayloadAction<TThemeMode>) => {
      state.theme = action.payload;
      state.is_hydrated = true;
      if (typeof window !== 'undefined') {
        if (state.theme === 'system') {
          const prefers_dark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          if (prefers_dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }
});

export const { ToggleTheme, SetTheme, HydrateTheme } = themeSlice.actions;
export default themeSlice.reducer;
