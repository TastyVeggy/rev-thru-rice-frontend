import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from './../../config';
import Cookies from 'js-cookie';
interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${config.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Login failed');
    }

    const data = await res.json();

    return (await data.user) as User;
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (signupData: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  }) => {
    const res = await fetch(`${config.apiUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
      credentials: 'include',
    });
    if (!res.ok) {
      const errorMessage = await res.text();
      if (errorMessage.includes('eqfield')) {
        throw new Error('Password and confirm password does not match');
      } else if (
        errorMessage.includes("'Username' failed on the 'min' tag") ||
        errorMessage.includes("'Username' failed on the 'max' tag")
      ) {
        throw new Error('Username must be between 3-30 characters');
      } else if (errorMessage.includes("'Password' failed on the 'min' tag")) {
        throw new Error('Password must be at least 6 characters');
      } else if (errorMessage.includes("failed on the 'email' tag")) {
        throw new Error('Please use a valid email');
      } else if (
        errorMessage.includes(
          'duplicate key value violates unique constraint "users_username_key"'
        )
      ) {
        throw new Error('Username has been taken');
      } else if (
        errorMessage.includes(
          'duplicate key value violates unique constraint "users_email_key"'
        )
      ) {
        throw new Error('Email has been taken');
      } else {
        throw new Error(
          'Server failed :( Traffic may be high, please try again'
        );
      }
    }
    const data = await res.json();
    return (await data.user) as User;
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const res = await fetch(`${config.apiUrl}/auth/verify_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return (await res.json()) as User;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await fetch(`${config.apiUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(
        login.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state: AuthState, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(signup.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(
        signup.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(signup.rejected, (state: AuthState, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(checkAuth.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(
        checkAuth.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || null;
      })
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
