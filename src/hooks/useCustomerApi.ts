import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseCustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useCustomerList = ({ page = 1, limit = 10, search = '' }: UseCustomerListParams = {}) => {
  return useQuery({
    queryKey: ['customerList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.CUSTOMER.CUSTOMER_LIST, formData);
        const resData = response.data;
        const list = Array.isArray(resData?.data)
          ? resData.data
          : (resData?.data?.customer_list || resData?.data?.list || resData?.customer_list || []);

        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          customerList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr,
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching customer list');
        return { customerList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export interface PincodeDetailsData {
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  locality?: string[];
  [key: string]: any;
}

export const usePincodeDetails = (pincode?: string) => {
  const cleanPincode = (pincode || '').trim();
  const isValidPincode = cleanPincode.length === 6 && /^\d{6}$/.test(cleanPincode);

  return useQuery<PincodeDetailsData | null>({
    queryKey: ['pincodeDetails', cleanPincode],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('pincode', cleanPincode);

        const response = await api.post(endPointApi.CUSTOMER.GET_PINCODE_DETAILS, formData);
        const resData = response.data;
        if (resData?.status === 200 || resData?.status === 1 || resData?.status === '200' || resData?.data) {
          return resData?.data || null;
        } else {
          if (resData?.message) toast.error(resData.message);
          return null;
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching pincode details');
        return null;
      }
    },
    enabled: isValidPincode,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

