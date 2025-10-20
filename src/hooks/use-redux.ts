import { useDispatch, useSelector, useStore } from 'react-redux';

import type { TAppDispatch, TAppStore, TRootState } from '@/store';

export const UseAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const UseAppSelector = useSelector.withTypes<TRootState>();
export const UseAppStore = useStore.withTypes<TAppStore>();
