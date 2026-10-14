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
        const list = resData?.data?.rider_list || resData?.data?.list || resData?.data || resData?.rider_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          riderList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching rider list');
        return { riderList: [], totalRecords: 0, paginationArr: null };
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

  const bulkDeleteRider = async (ids: (string | number)[]) => {
    if (!ids || ids.length === 0) return { success: false, message: 'No records selected' };
    try {
      const formData = new FormData();
      formData.append('ids', ids.join(','));

      const response = await api.post(endPointApi.RIDER.BULK_DELETE_RIDER, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.success) {
        const data = resData?.data;
        const deletedCount = data?.deleted_count ?? ids.length;
        const skipped = Array.isArray(data?.skipped) ? data.skipped : [];
        const skippedCount = data?.skipped_count ?? skipped.length;

        if (skippedCount > 0) {
          if (deletedCount > 0) {
            toast.success(resData?.message || `${deletedCount} records deleted, ${skippedCount} skipped`);
          } else {
            toast.warn(resData?.message || `${skippedCount} records could not be deleted`);
          }
        } else {
          toast.success(resData?.message || `${deletedCount} Rider(s) deleted successfully`);
        }

        queryClient.invalidateQueries({ queryKey: ['riderList'] });
        return { success: true, deletedCount, skippedCount, skipped };
      } else {
        toast.error(resData?.message || 'Failed to bulk delete riders');
        return { success: false };
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting riders');
      return { success: false };
    }
  };

  return {
    insertRider,
    deleteRider,
    bulkDeleteRider,
  };
};
