import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseAgencyCodeListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AgencyCodePayload {
  agency_code_id?: string | number | null;
  id?: string | number | null;
  company_id: string | number;
  name: string;
  code: string;
  remark?: string;
  email?: string;
  mobile_number?: string;
}

// ─── General Insurance Agency Code Hooks ───────────────────────────────────────

export const useCompanyDropdownList = () => {
  return useQuery({
    queryKey: ['companyDropdownList'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.GENERAL_AGENCY_CODE.COMPANY_DROPDOWN_LIST);
        const resData = response?.data;
        const list = resData?.data || resData?.list || resData || [];
        return Array.isArray(list)
          ? list.map((item: any) => ({
              id: item.company_id || item.id,
              name: item.name || item.company_name,
            }))
          : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching company dropdown list');
        return [];
      }
    }
  });
};

export const useAgencyCodeList = ({ page = 1, limit = 10, search = '' }: UseAgencyCodeListParams = {}) => {
  return useQuery({
    queryKey: ['agencyCodeList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.GENERAL_AGENCY_CODE.AGENCY_CODE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data?.agency_code_list || resData?.data?.list || resData?.data || resData?.agency_code_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          agencyCodeList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching agency code list');
        return { agencyCodeList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useAgencyCodeActions = () => {
  const queryClient = useQueryClient();

  const insertAgencyCode = async (payload: AgencyCodePayload) => {
    try {
      const formData = new FormData();
      const codeId = payload.agency_code_id || payload.id;
      if (codeId) {
        formData.append('agency_code_id', String(codeId));
      }
      formData.append('company_id', String(payload.company_id));
      formData.append('name', payload.name.trim());
      formData.append('code', payload.code.trim());
      if (payload.remark !== undefined) formData.append('remark', payload.remark.trim());
      if (payload.email !== undefined) formData.append('email', payload.email.trim());
      if (payload.mobile_number !== undefined) formData.append('mobile_number', payload.mobile_number.trim());

      const response = await api.post(endPointApi.GENERAL_AGENCY_CODE.INSERT_AGENCY_CODE, formData);
      const resData = response?.data;
      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'General Agency Code saved successfully');
        queryClient.invalidateQueries({ queryKey: ['agencyCodeList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save General Agency Code');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving General Agency Code');
      return false;
    }
  };

  const deleteAgencyCode = async (agencyCodeId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('agency_code_id', String(agencyCodeId));

      const response = await api.post(endPointApi.GENERAL_AGENCY_CODE.DELETE_AGENCY_CODE, formData);
      const resData = response?.data;
      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'General Agency Code deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['agencyCodeList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete General Agency Code');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting General Agency Code');
      return false;
    }
  };

  return { insertAgencyCode, deleteAgencyCode };
};

// ─── Life Insurance Agency Code Hooks ──────────────────────────────────────────

export const useLifeCompanyDropdownList = () => {
  return useQuery({
    queryKey: ['lifeCompanyDropdownList'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.LIFE_AGENCY_CODE.COMPANY_DROPDOWN_LIST);
        const resData = response?.data;
        const list = resData?.data || resData?.list || resData || [];
        return Array.isArray(list)
          ? list.map((item: any) => ({
              id: item.company_id || item.id,
              name: item.name || item.company_name,
            }))
          : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching life company dropdown list');
        return [];
      }
    }
  });
};

export const useLifeAgencyCodeList = ({ page = 1, limit = 10, search = '' }: UseAgencyCodeListParams = {}) => {
  return useQuery({
    queryKey: ['lifeAgencyCodeList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.LIFE_AGENCY_CODE.AGENCY_CODE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data?.agency_code_list || resData?.data?.list || resData?.data || resData?.agency_code_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          agencyCodeList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching life agency code list');
        return { agencyCodeList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useLifeAgencyCodeActions = () => {
  const queryClient = useQueryClient();

  const insertAgencyCode = async (payload: AgencyCodePayload) => {
    try {
      const formData = new FormData();
      const codeId = payload.agency_code_id || payload.id;
      if (codeId) {
        formData.append('agency_code_id', String(codeId));
      }
      formData.append('company_id', String(payload.company_id));
      formData.append('name', payload.name.trim());
      formData.append('code', payload.code.trim());
      if (payload.remark !== undefined) formData.append('remark', payload.remark.trim());
      if (payload.email !== undefined) formData.append('email', payload.email.trim());
      if (payload.mobile_number !== undefined) formData.append('mobile_number', payload.mobile_number.trim());

      const response = await api.post(endPointApi.LIFE_AGENCY_CODE.INSERT_AGENCY_CODE, formData);
      const resData = response?.data;
      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Life Agency Code saved successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeAgencyCodeList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save Life Agency Code');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving Life Agency Code');
      return false;
    }
  };

  const deleteAgencyCode = async (agencyCodeId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('agency_code_id', String(agencyCodeId));

      const response = await api.post(endPointApi.LIFE_AGENCY_CODE.DELETE_AGENCY_CODE, formData);
      const resData = response?.data;
      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Life Agency Code deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeAgencyCodeList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete Life Agency Code');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting Life Agency Code');
      return false;
    }
  };

  return { insertAgencyCode, deleteAgencyCode };
};
