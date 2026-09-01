import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseLifeCompanyListParams {
  page: number;
  limit: number;
  search: string;
}

export const useLifeCompanyList = ({ page, limit, search }: UseLifeCompanyListParams) => {
  return useQuery({
    queryKey: ['lifeCompanyList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.LIFE_COMPANY.COMPANY_LIFE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data?.company_list || resData?.data?.list || resData?.data || resData?.company_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          companyList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching life company list');
        return { companyList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useLifeCompanyPlans = (activeCompanyId?: string | number) => {
  return useQuery({
    queryKey: ['lifeCompanyPlans', activeCompanyId],
    queryFn: async () => {
      try {
        const formData = new FormData();
        if (activeCompanyId) {
          formData.append('company_id', String(activeCompanyId));
        }
        const response = await api.post(endPointApi.LIFE_COMPANY.FETCH_COMPANY_PLANS, formData);
        const resData = response?.data;
        const list = resData?.data?.company_plans || resData?.data?.plans || resData?.data?.list || resData?.data || resData?.company_plans || [];
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        return [];
      }
    }
  });
};

export const useLifeCompanyActions = () => {
  const queryClient = useQueryClient();

  const insertLifeCompany = async (name: string, editingCompanyId?: string | number | null) => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (editingCompanyId) {
        formData.append("company_id", String(editingCompanyId));
      }
      const response = await api.post(endPointApi.LIFE_COMPANY.INSERT_COMPANY, formData);
      const resData = response?.data;
      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Company saved successfully');
        queryClient.invalidateQueries({
          queryKey: ["lifeCompanyList"],
        });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save company');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving company');
      return false;
    }
  };

  const insertLifeCompanyPlan = async (companyId: string | number, planName: string, editingPlanId?: string | number | null) => {
    const formData = new FormData();
    formData.append('company_id', String(companyId));
    formData.append('plan_name', planName.trim());

    if (editingPlanId) {
      formData.append('plan_id', String(editingPlanId));
    }

    try {
      const response = await api.post(endPointApi.LIFE_COMPANY.INSERT_COMPANY_PLAN, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Plan saved successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeCompanyPlans'] });
        queryClient.invalidateQueries({ queryKey: ['lifeCompanyList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save plan');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving plan');
      return false;
    }
  };

  const deleteLifeCompany = async (companyId: string | number) => {
    const formData = new FormData();
    formData.append('company_id', String(companyId));

    try {
      const response = await api.post(endPointApi.LIFE_COMPANY.DELETE_COMPANY, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Company deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeCompanyList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete company');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting company');
      return false;
    }
  };

  const deleteLifeCompanyPlan = async (planId: string | number) => {
    const formData = new FormData();
    formData.append('plan_id', String(planId));

    try {
      const response = await api.post(endPointApi.LIFE_COMPANY.DELETE_COMPANY_PLAN, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Plan deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeCompanyPlans'] });
        queryClient.invalidateQueries({ queryKey: ['lifeCompanyList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete plan');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting plan');
      return false;
    }
  };

  return {
    insertLifeCompany,
    insertLifeCompanyPlan,
    deleteLifeCompany,
    deleteLifeCompanyPlan,
  };
};
