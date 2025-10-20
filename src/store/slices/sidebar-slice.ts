import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const STORAGE_KEY = 'sidebar_state';

export interface ISidebarState {
  is_collapsed: boolean;
  is_hovered: boolean;
  is_hydrated: boolean;
  is_mobile_open: boolean;
}

const initial_state: ISidebarState = {
  is_collapsed: false,
  is_hovered: false,
  is_hydrated: false,
  is_mobile_open: false
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initial_state,
  reducers: {
    ToggleSidebar: state => {
      state.is_collapsed = !state.is_collapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ is_collapsed: state.is_collapsed })
        );
      }
    },
    SetSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.is_collapsed = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ is_collapsed: state.is_collapsed })
        );
      }
    },
    SetSidebarHovered: (state, action: PayloadAction<boolean>) => {
      state.is_hovered = action.payload;
    },
    HydrateSidebar: (state, action: PayloadAction<boolean>) => {
      state.is_collapsed = action.payload;
      state.is_hydrated = true;
    },
    ToggleMobileSidebar: state => {
      state.is_mobile_open = !state.is_mobile_open;
    },
    SetMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.is_mobile_open = action.payload;
    }
  }
});

export const {
  ToggleSidebar,
  SetSidebarCollapsed,
  SetSidebarHovered,
  HydrateSidebar,
  ToggleMobileSidebar,
  SetMobileSidebarOpen
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
