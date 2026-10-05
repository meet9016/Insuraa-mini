import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface StaffItem {
  staff_id?: number | string;
  id?: number | string;
  full_name?: string;
  number?: string;
  email?: string;
  address?: string;
  data_access?: number | string;
  data_access_name?: string;
  status?: number | string;
  status_name?: string;
  policy_counts?: {
    life?: number;
    health?: number;
    motor?: number;
    other?: number;
    total?: number;
  };
  customer_count?: number;
  lead_count?: number;
  last_login_at?: string;
  created_at?: string;
  [key: string]: any;
}

export interface UseStaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface InsertStaffPayload {
  staff_id?: string | number;
  full_name: string;
  number: string;
  email?: string;
  address?: string;
  data_access: string | number;
}

export interface UpdateStaffStatusPayload {
  staff_id: string | number;
  status: string | number;
}

// Custom hook to fetch staff list
export const useStaffList = ({ page = 1, limit = 10, search = '', status = '' }: UseStaffListParams = {}) => {
  return useQuery({
    queryKey: ['staffList', page, limit, search, status],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);
        formData.append('status', status);

        const response = await api.post(endPointApi.STAFF.STAFF_LIST, formData);
        const resData = response.data;
        const list = Array.isArray(resData?.data)
          ? resData.data
          : Array.isArray(resData?.data?.list)
            ? resData.data.list
            : Array.isArray(resData?.list)
              ? resData.list
              : [];

        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          staffList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr,
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching staff list');
        return { staffList: [], totalRecords: 0, paginationArr: null };
      }
    },
  });
};

// Custom hook to fetch detailed staff information by ID
export const useViewStaff = (staffId: string | number | null) => {
  return useQuery<StaffItem | null>({
    queryKey: ['viewStaff', staffId],
    enabled: !!staffId,
    queryFn: async () => {
      if (!staffId) return null;
      try {
        const formData = new FormData();
        formData.append('staff_id', String(staffId));

        const response = await api.post(endPointApi.STAFF.VIEW_STAFF, formData);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
          return resData?.data || null;
        } else {
          if (resData?.message) toast.error(resData.message);
          return null;
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching staff details');
        return null;
      }
    },
  });
};

// Custom hook for inserting or updating a staff record
export const useInsertStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InsertStaffPayload) => {
      const data = new FormData();
      if (payload.staff_id) {
        data.append('staff_id', String(payload.staff_id));
      }
      data.append('full_name', payload.full_name.trim());
      data.append('number', payload.number.trim());
      if (payload.email) data.append('email', payload.email.trim());
      if (payload.address) data.append('address', payload.address.trim());
      data.append('data_access', String(payload.data_access));

      const response = await api.post(endPointApi.STAFF.INSERT_STAFF, data);
      return response?.data;
    },
    onSuccess: (resData, variables) => {
      if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
        const defaultMsg = variables.staff_id ? 'Staff Updated Successfully' : 'Staff Added Successfully';
        toast.success(resData.message || defaultMsg);
        queryClient.invalidateQueries({ queryKey: ['staffList'] });
        queryClient.invalidateQueries({ queryKey: ['viewStaff'] });
      } else {
        toast.error(resData?.message || 'Failed to save staff');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Something went wrong');
    },
  });
};

// Custom hook for updating staff status
export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staff_id, status }: UpdateStaffStatusPayload) => {
      const formData = new FormData();
      formData.append('staff_id', String(staff_id));
      formData.append('status', String(status));

      const response = await api.post(endPointApi.STAFF.UPDATE_STAFF_STATUS, formData);
      return response?.data;
    },
    onSuccess: (resData) => {
      if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
        toast.success(resData.message || 'Staff status updated successfully');
        queryClient.invalidateQueries({ queryKey: ['staffList'] });
        queryClient.invalidateQueries({ queryKey: ['viewStaff'] });
      } else {
        toast.error(resData?.message || 'Failed to update staff status');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Something went wrong');
    },
  });
};

// Custom hook for deleting a staff record
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staffId: string | number) => {
      const formData = new FormData();
      formData.append('staff_id', String(staffId));
      const response = await api.post(endPointApi.STAFF.DELETE_STAFF, formData);
      return response?.data;
    },
    onSuccess: (resData) => {
      if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
        toast.success(resData.message || 'Staff Successfully Removed');
        queryClient.invalidateQueries({ queryKey: ['staffList'] });
      } else {
        toast.error(resData?.message || 'Failed to delete staff');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Something went wrong');
    },
  });
};
