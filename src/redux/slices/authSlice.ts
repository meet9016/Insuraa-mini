import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  number?: string;
  role?: string;
}

export interface AuthState {
  currentStaff: User | null;
  otpPhoneNumber: string | null;
  isOtpSent: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  currentStaff: null,
  otpPhoneNumber: null,
  isOtpSent: false,
  token: null,
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
    },
    resetOtpState: (state) => {
      state.otpPhoneNumber = null;
      state.isOtpSent = false;
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
      state.otpPhoneNumber = null;
      state.isOtpSent = false;
      state.token = null;
      state.status = 'idle';
    }
  },
});

export const { 
  setOtpPhoneNumber, 
  setOtpSent, 
  setAuthTokenRedux, 
  resetOtpState, 
  clearCurrentStaff 
} = authSlice.actions;

export default authSlice.reducer;

