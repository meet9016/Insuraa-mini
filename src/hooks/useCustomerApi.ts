import { useQuery, useQueryClient } from '@tanstack/react-query';
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
export const useCustomerActions = () => {
  const queryClient = useQueryClient();

  const bulkDeleteCustomer = async (ids: (string | number)[]) => {
    if (!ids || ids.length === 0) {
      return {
        success: false,
        message: 'No records selected',
      };
    }

    try {
      const formData = new FormData();

      // Pass IDs as comma-separated values: ids = 1,2,3
      formData.append('ids', ids.join(','));

      const response = await api.post(
        endPointApi.CUSTOMER.BULK_DELETE_CUSTOMER,
        formData
      );

      const resData = response?.data;

      if (
        resData?.status === 200 ||
        resData?.status === '200' ||
        resData?.success
      ) {
        const data = resData?.data;

        const deletedCount = data?.deleted_count ?? ids.length;
        const skipped = Array.isArray(data?.skipped)
          ? data.skipped
          : [];

        const skippedCount = data?.skipped_count ?? skipped.length;

        if (skippedCount > 0) {
          if (deletedCount > 0) {
            toast.success(
              resData?.message ||
                `${deletedCount} records deleted, ${skippedCount} skipped`
            );
          } else {
            toast.warn(
              resData?.message ||
                `${skippedCount} records could not be deleted`
            );
          }
        } else {
          toast.success(
            resData?.message ||
              `${deletedCount} customer records deleted successfully`
          );
        }

        queryClient.invalidateQueries({
          queryKey: ['customerList'],
        });

        return {
          success: true,
          data: resData,
        };
      } else {
        toast.error(
          resData?.message || 'Failed to bulk delete customers'
        );

        return {
          success: false,
          message: resData?.message,
        };
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Error bulk deleting customers';

      toast.error(errMsg);

      return {
        success: false,
        message: errMsg,
      };
    }
  };

  return { bulkDeleteCustomer };
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

export const useViewCustomer = (customerId: string | number | null) => {
  return useQuery({
    queryKey: ['viewCustomer', customerId],
    enabled: Boolean(customerId && !String(customerId).startsWith('placeholder-')),
    queryFn: async () => {
      if (!customerId) return null;
      const formData = new FormData();
      formData.append('customer_id', String(customerId));

      const response = await api.post(endPointApi.CUSTOMER.SINGLE_CUSTOMER_LIST, formData);
      const resData = response?.data;
      return resData?.data || resData || null;
    }
  });
};

export const useSingleCustomerList = useViewCustomer;

