import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import countriesReducer from './slices/countriesSlice';
import subforumsReducer from './slices/subforumsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    countries: countriesReducer,
    subforums: subforumsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
