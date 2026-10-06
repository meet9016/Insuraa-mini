import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id?: string;
  _id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  number?: string;
  company_name?: string;
  role?: string;
  user_role_id?: string;
  username?: string;
  login_type?: string;
}

export interface AuthState {
  user: User | null;
  otpPhoneNumber: string | null;
  isOtpSent: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  otpPhoneNumber: initialUser?.number || null,
  isOtpSent: false,
  token: getInitialToken(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOtpPhoneNumber: (state, action: PayloadAction<string>) => {
      state.otpPhoneNumber = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.isOtpSent = action.payload;
    },
    setAuthTokenRedux: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload);
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;

      if (action.payload?.number) {
        state.otpPhoneNumber = action.payload.number;
      }
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload));
          if (action.payload.login_type) {
            localStorage.setItem('login_type', action.payload.login_type);
          }
        } else {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('login_type');
          localStorage.removeItem('auth_login_type');
        }
      }
    },
    resetOtpState: (state) => {
      state.otpPhoneNumber = null;
      state.isOtpSent = false;
    },
    clearCurrentStaff: (state) => {
      state.user = null;
      state.otpPhoneNumber = null;
      state.isOtpSent = false;
      state.token = null;
      state.status = 'idle';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('login_type');
        localStorage.removeItem('auth_login_type');
      }
    }
  },
});

export const {
  setOtpPhoneNumber,
  setOtpSent,
  setAuthTokenRedux,
  setUser,
  resetOtpState,
  clearCurrentStaff
} = authSlice.actions;

export default authSlice.reducer;

