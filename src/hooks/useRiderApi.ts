import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseRiderListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useRiderList = ({ page = 1, limit = 10, search = '' }: UseRiderListParams = {}) => {
  return useQuery({
    queryKey: ['riderList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.RIDER.RIDER_LIST, formData);
        const resData = response.data;
        const list = resData?.data || resData?.rider_list || resData?.list || [];
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching rider list');
        return [];
      }
    }
  });
};

export const useRiderActions = () => {
  const queryClient = useQueryClient();

  const insertRider = async (name: string, editingRiderId?: string | number | null) => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (editingRiderId) {
        formData.append("rider_id", String(editingRiderId));
      }
      const response = await api.post(endPointApi.RIDER.INSERT_RIDER, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Rider saved successfully');
        queryClient.invalidateQueries({
          queryKey: ["riderList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving rider');
      return false;
    }
  };

  const deleteRider = async (riderId: string | number) => {
    try {
      const formData = new FormData();
      formData.append("rider_id", String(riderId));
      const response = await api.post(endPointApi.RIDER.DELETE_RIDER, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Rider deleted successfully');
        queryClient.invalidateQueries({
          queryKey: ["riderList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting rider');
      return false;
    }
  };

  return {
    insertRider,
    deleteRider,
  };
};
