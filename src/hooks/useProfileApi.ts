import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface ProfileData {
  login_type?: string;
  user_id?: string | number;
  user_code?: string;
  full_name?: string;
  company_name?: string;
  number?: string;
  email?: string;
  pincode?: string;
  country?: string;
  nationality?: string;
  state?: string;
  city?: string;
  address?: string;
  staff_count?: number;
  subscription?: {
    plan_name?: string;
    starting_date?: string;
    ending_date?: string;
    days_left?: number;
    is_expired?: number | boolean;
  };
  created_at?: string;
  [key: string]: any;
}

export interface UpdateProfilePayload {
  full_name: string;
  company_name: string;
  email: string;
  address: string;
  pincode: string;
  nationality: string;
  state: string;
  city: string;
}

export const useFetchProfile = () => {
  return useQuery<ProfileData | null>({
    queryKey: ['profileData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.PROFILE.FETCH_PROFILE);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === 'success')) {
          return resData?.data || null;
        } else {
          return null;
        }
      } catch (err: any) {
        console.error('Error fetching profile', err);
        return null;
      }
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const data = new FormData();
      data.append('full_name', payload.full_name);
      data.append('company_name', payload.company_name);
      data.append('email', payload.email);
      data.append('address', payload.address);
      data.append('pincode', payload.pincode);
      data.append('nationality', payload.nationality);
      data.append('state', payload.state);
      data.append('city', payload.city);

      const response = await api.post(endPointApi.PROFILE.UPDATE_PROFILE, data);
      return response?.data;
    },
    onSuccess: (resData) => {
      if (resData && (resData.status === 200 || resData.status === '200' || resData.status === 'success')) {
        toast.success(resData.message || 'Profile Updated Successfully');
        queryClient.invalidateQueries({ queryKey: ['profileData'] });
      } else {
        toast.error(resData?.message || 'Failed to update profile');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Something went wrong');
    },
  });
};
