import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { useAppDispatch } from '@/redux/hooks';
import { setOtpPhoneNumber, setOtpSent, setAuthTokenRedux } from '@/redux/slices/authSlice';
import { setAuthToken } from '@/config';

export interface SendOtpPayload {
  number: string;
}

export interface VerifyOtpPayload {
  number: string;
  otp: string;
}

export interface VerifySignUpPayload {
  number: string;
  otp: string;
  full_name: string;
  email: string;
  company_name: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface OtpResponse {
  status?: string | number | boolean;
  message?: string;
  token?: string;
  data?: any;
  [key: string]: any;
}

// React Query Mutation Hook for send_login_otp
export const useSendLoginOtp = () => {
  const dispatch = useAppDispatch();

  return useMutation<OtpResponse, Error, SendOtpPayload>({
    mutationFn: async (payload: SendOtpPayload) => {
      const formData = new FormData();
      formData.append('number', payload.number);

      const response = await api.post(endPointApi.AUTH.SEND_LOGIN_OTP, formData);
      const resData = response.data;

      const isFailed =
        !resData ||
        resData.status === 404 ||
        resData.status === 400 ||
        resData.status === 401 ||
        resData.status === 422 ||
        resData.status === 429 ||
        resData.status === 'Failed' ||
        resData.status === 'failed' ||
        resData.status === 'error' ||
        resData.status === 'Error' ||
        resData.status === false ||
        (resData.status !== undefined &&
          resData.status !== 200 &&
          resData.status !== 201 &&
          resData.status !== true &&
          resData.status !== 'success' &&
          resData.status !== 'Success');

      if (isFailed) {
        throw new Error(resData?.message || 'Number not registered');
      }

      return resData;
    },
    onSuccess: (data, variables) => {
      dispatch(setOtpPhoneNumber(variables.number));
      dispatch(setOtpSent(true));
    },
  });
};

// React Query Mutation Hook for verify_login_otp
export const useVerifyLoginOtp = () => {
  const dispatch = useAppDispatch();

  return useMutation<OtpResponse, Error, VerifyOtpPayload>({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const formData = new FormData();
      formData.append('number', payload.number);
      formData.append('otp', payload.otp);

      const response = await api.post(endPointApi.AUTH.VERIFY_LOGIN_OTP, formData);
      const resData = response.data;

      if (resData && (resData.status === 401 || resData.status === 400 || resData.status === 429 || resData.status === 'Failed' || resData.status === false)) {
        throw new Error(resData.message || 'Invalid or expired OTP');
      }

      return resData;
    },
    onSuccess: (data) => {
      const token = data?.token || data?.data?.token || (typeof data?.data === 'string' ? data.data : null) || data?.access_token || data?.auth_token;
      if (token) {
        setAuthToken(token);
        dispatch(setAuthTokenRedux(token));
      } else {
        setAuthToken('logged_in_user_token');
      }
    },
  });
};

// React Query Mutation Hook for send_sign_up_otp
export const useSendSignUpOtp = () => {
  return useMutation<OtpResponse, Error, SendOtpPayload>({
    mutationFn: async (payload: SendOtpPayload) => {
      const formData = new FormData();
      formData.append('number', payload.number);

      const response = await api.post(endPointApi.AUTH.SEND_SIGN_UP_OTP, formData);
      const resData = response.data;

      const isFailed =
        !resData ||
        resData.status === 404 ||
        resData.status === 400 ||
        resData.status === 401 ||
        resData.status === 422 ||
        resData.status === 429 ||
        resData.status === 'Failed' ||
        resData.status === 'failed' ||
        resData.status === 'error' ||
        resData.status === 'Error' ||
        resData.status === false ||
        (resData.status !== undefined &&
          resData.status !== 200 &&
          resData.status !== 201 &&
          resData.status !== true &&
          resData.status !== 'success' &&
          resData.status !== 'Success');

      if (isFailed) {
        throw new Error(resData?.message || 'Failed to send Sign Up OTP');
      }

      return resData;
    },
  });
};

// React Query Mutation Hook for verify_sign_up_otp
export const useVerifySignUpOtp = () => {
  return useMutation<OtpResponse, Error, VerifySignUpPayload>({
    mutationFn: async (payload: VerifySignUpPayload) => {
      const formData = new FormData();
      formData.append('number', payload.number);
      formData.append('otp', payload.otp);
      formData.append('full_name', payload.full_name);
      formData.append('email', payload.email);
      formData.append('company_name', payload.company_name);
      formData.append('pincode', payload.pincode);
      formData.append('country', payload.country);
      formData.append('state', payload.state);
      formData.append('city', payload.city);
      formData.append('address', payload.address);

      const response = await api.post(endPointApi.AUTH.VERIFY_SIGN_UP_OTP, formData);
      const resData = response.data;

      if (resData && (resData.status === 401 || resData.status === 400 || resData.status === 429 || resData.status === 'Failed' || resData.status === false)) {
        throw new Error(resData.message || 'Failed to complete registration');
      }

      return resData;
    },
  });
};

// React Query Query Hook for checking active login OTP status
export const useGetLoginStatusQuery = (number?: string | null) => {
  return useQuery({
    queryKey: ['loginOtpStatus', number],
    queryFn: async () => {
      if (!number) return null;
      const response = await api.get(`${endPointApi.AUTH.SEND_LOGIN_OTP}?number=${number}`);
      return response.data;
    },
    enabled: Boolean(number),
  });
};
