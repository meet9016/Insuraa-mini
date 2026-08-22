import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseSourceOfLeadListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useSourceOfLeadList = ({ page = 1, limit = 10, search = '' }: UseSourceOfLeadListParams = {}) => {
  return useQuery({
    queryKey: ['sourceOfLeadList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.SOURCE_OF_LEAD.LEAD_PRODUCT_LIST, formData);
        const resData = response.data;
        const list = resData?.data?.lead_product_list || resData?.data?.list || resData?.data || resData?.lead_product_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          sourceOfLeadList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching source of lead list');
        return { sourceOfLeadList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useSourceOfLeadActions = () => {
  const queryClient = useQueryClient();

  const insertLeadProduct = async (name: string, editingLeadProductId?: string | number | null) => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (editingLeadProductId) {
        formData.append("lead_product_id", String(editingLeadProductId));
      }
      const response = await api.post(endPointApi.SOURCE_OF_LEAD.INSERT_LEAD_PRODUCT, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Lead product saved successfully');
        queryClient.invalidateQueries({
          queryKey: ["sourceOfLeadList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving lead product');
      return false;
    }
  };

  const deleteLeadProduct = async (leadProductId: string | number) => {
    try {
      const formData = new FormData();
      formData.append("lead_product_id", String(leadProductId));
      const response = await api.post(endPointApi.SOURCE_OF_LEAD.DELETE_LEAD_PRODUCT, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Lead product deleted successfully');
        queryClient.invalidateQueries({
          queryKey: ["sourceOfLeadList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting lead product');
      return false;
    }
  };

  return {
    insertLeadProduct,
    deleteLeadProduct,
  };
};
