import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface CompanyItem {
  company_id: string | number;
  name: string;
}

export interface DropdownItem {
  id: string | number;
  value: string;
}

export interface HealthQuotationMasterData {
  companies?: CompanyItem[];
  proposal_type?: DropdownItem[];
  plan_opted?: DropdownItem[];
  family_size?: DropdownItem[];
  policy_tenure?: DropdownItem[];
}

export interface HealthQuotationQuoteItem {
  company_name: string | number;
  product_name: string;
  zone?: string;
  sa?: string | number;
  addon?: string;
  premium_1y: string | number;
  premium_2y?: string | number;
  premium_3y?: string | number;
  recommended?: boolean | number;
}

export interface HealthQuotationMemberItem {
  member_name: string;
  relation: string;
  dob: string;
  age?: string | number;
  gender: string;
  medical_history?: string;
}

export interface HealthQuotationPayload {
  quotation_id?: string | number | null;
  proposal_type: string | number;
  plan_opted: string | number;
  family_size: string | number;
  policy_tenure: string | number;
  insured_name: string;
  mobile?: string;
  email?: string;
  city?: string;
  state?: string;
  house_no?: string;
  street?: string;
  area?: string;
  pincode?: string;
  quotes?: HealthQuotationQuoteItem[];
  members?: HealthQuotationMemberItem[];
}

export const useHealthQuotationMasterData = () => {
  return useQuery<HealthQuotationMasterData>({
    queryKey: ['healthQuotationMasterData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.HEALTH_QUOTATION.HEALTH_QUOTATION_MASTER_DATA);
        const resData = response?.data;
        return resData?.data || {};
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health quotation master data');
        return {};
      }
    }
  });
};

export interface HealthQuotationProductItem {
  product_id: string | number;
  name: string;
}

export const useHealthQuotationProducts = (companyId?: string | number) => {
  return useQuery<HealthQuotationProductItem[]>({
    queryKey: ['healthQuotationProducts', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return [];
      try {
        const formData = new FormData();
        formData.append('company_id', String(companyId));
        const response = await api.post(
          endPointApi.HEALTH_QUOTATION.HEALTH_QUOTATION_PRODUCT_LIST_DROPDOWN,
          formData
        );
        const resData = response?.data;
        return Array.isArray(resData?.data) ? resData.data : [];
      } catch (err: any) {
        return [];
      }
    },
  });
};

export const useHealthQuotationActions = () => {
  const queryClient = useQueryClient();

  const insertHealthQuotation = async (payload: HealthQuotationPayload) => {
    try {
      const formData = new FormData();

      if (payload.quotation_id) {
        formData.append('quotation_id', String(payload.quotation_id));
      }
      formData.append('proposal_type', String(payload.proposal_type ?? ''));
      formData.append('plan_opted', String(payload.plan_opted ?? ''));
      formData.append('family_size', String(payload.family_size ?? ''));
      formData.append('policy_tenure', String(payload.policy_tenure ?? ''));
      formData.append('insured_name', String(payload.insured_name ?? ''));
      formData.append('mobile', String(payload.mobile ?? ''));
      formData.append('email', String(payload.email ?? ''));
      formData.append('city', String(payload.city ?? ''));
      formData.append('state', String(payload.state ?? ''));
      formData.append('house_no', String(payload.house_no ?? ''));
      formData.append('street', String(payload.street ?? ''));
      formData.append('area', String(payload.area ?? ''));
      formData.append('pincode', String(payload.pincode ?? ''));

      if (Array.isArray(payload.quotes)) {
        payload.quotes.forEach((q, index) => {
          formData.append(`company_name[${index}]`, String(q.company_name ?? ''));
          formData.append(`product_name[${index}]`, String(q.product_name ?? ''));
          formData.append(`zone[${index}]`, String(q.zone ?? ''));
          formData.append(`sa[${index}]`, String(q.sa ?? ''));
          formData.append(`addon[${index}]`, String(q.addon ?? ''));
          formData.append(`premium_1y[${index}]`, String(q.premium_1y ?? ''));
          formData.append(`premium_2y[${index}]`, String(q.premium_2y ?? ''));
          formData.append(`premium_3y[${index}]`, String(q.premium_3y ?? ''));
          formData.append(`is_recommended[${index}]`, q.recommended ? '1' : '0');
        });
      }

      if (Array.isArray(payload.members)) {
        payload.members.forEach((m, index) => {
          formData.append(`member_name[${index}]`, String(m.member_name ?? ''));
          formData.append(`relation[${index}]`, String(m.relation ?? ''));
          formData.append(`dob[${index}]`, String(m.dob ?? ''));
          formData.append(`age[${index}]`, String(m.age ?? ''));
          formData.append(`gender[${index}]`, String(m.gender ?? ''));
          formData.append(`medical_history[${index}]`, String(m.medical_history ?? ''));
        });
      }

      const response = await api.post(endPointApi.HEALTH_QUOTATION.INSERT_HEALTH_QUOTATION, formData);
      const resData = response?.data;

      if (resData?.status === 200 || response?.status === 200) {
        toast.success(resData?.message || 'Health Quotation saved successfully');
        queryClient.invalidateQueries({ queryKey: ['healthQuotationList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save health quotation');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving health quotation');
      return false;
    }
  };

  const deleteHealthQuotation = async (quotationId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('quotation_id', String(quotationId));

      const response = await api.post(endPointApi.HEALTH_QUOTATION.DELETE_HEALTH_QUOTATION, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.success) {
        toast.success(resData?.message || 'Health quotation deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['healthQuotationList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete health quotation');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting health quotation');
      return false;
    }
  };

  return {
    insertHealthQuotation,
    deleteHealthQuotation,
  };
};

export interface UseHealthQuotationListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useHealthQuotationList = ({ page = 1, limit = 10, search = '' }: UseHealthQuotationListParams = {}) => {
  return useQuery({
    queryKey: ['healthQuotationList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.HEALTH_QUOTATION.HEALTH_QUOTATION_LIST, formData);
        const resData = response?.data;
        const list = resData?.data || [];
        const pagArr = resData?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? (Array.isArray(list) ? list.length : 0);

        return {
          quotationList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health quotation list');
        return { quotationList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useHealthQuotationDetail = (quotationId?: string | number | null) => {
  return useQuery({
    queryKey: ['healthQuotationDetail', quotationId],
    enabled: !!quotationId,
    queryFn: async () => {
      if (!quotationId) return null;
      try {
        const formData = new FormData();
        formData.append('quotation_id', String(quotationId));
        const response = await api.post(endPointApi.HEALTH_QUOTATION.HEALTH_QUOTATION_EDIT, formData);
        const resData = response?.data;
        return resData?.data || null;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health quotation details');
        return null;
      }
    },
  });
};



