import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface MasterItem {
  id: string | number;
  name?: string;
  term?: string | number;
}

export interface LifeInsuranceMasterData {
  companies?: MasterItem[];
  payment_mode?: MasterItem[];
  riders?: MasterItem[];
  policy_term?: MasterItem[];
  document_name?: MasterItem[];
  relationship?: MasterItem[];
  plan_type?: MasterItem[];
  max_documents_allowed?: number;
}

export const useLifeInsuranceMasterData = () => {
  return useQuery<LifeInsuranceMasterData>({
    queryKey: ['lifeInsuranceMasterData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.LIFE_INSURANCE.LIFE_INSURANCE_MASTER_DATA);
        const resData = response?.data;
        return resData?.data || {};
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching life insurance master data');
        return {};
      }
    }
  });
};

export interface CompanyPlanItem {
  plan_id: string | number;
  plan_name: string;
}

export interface AgencyCodeItem {
  id?: string | number;
  agency_code_id?: string | number;
  code?: string;
  name?: string;
  agency_code?: string;
}

export interface CompanyPlansAndAgencyData {
  plan_list: CompanyPlanItem[];
  agency_code: AgencyCodeItem[];
}

export const useLifeInsuranceCompanyPlansAndAgency = (companyId?: string | number) => {
  return useQuery<CompanyPlansAndAgencyData>({
    queryKey: ['lifeInsuranceCompanyPlansAndAgency', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return { plan_list: [], agency_code: [] };
      try {
        const formData = new FormData();
        formData.append('company_id', String(companyId));
        const response = await api.post(endPointApi.LIFE_INSURANCE.LIFE_INSURANCE_COMPANY_PLANS_AND_AGENCY, formData);
        const resData = response?.data;
        const data = resData?.data || {};
        return {
          plan_list: Array.isArray(data.plan_list) ? data.plan_list : [],
          agency_code: Array.isArray(data.agency_code) ? data.agency_code : [],
        };
      } catch (err: any) {
        return { plan_list: [], agency_code: [] };
      }
    }
  });
};

export interface RiderItemPayload {
  riders_id: string | number;
  riders_amount: string | number;
  riders_note?: string;
}

export interface NomineeItemPayload {
  nomainee_name: string;
  nomainee_relationship: string | number;
  nomainee_per: string | number;
}

export interface OtherDocumentItemPayload {
  other_document_name: string | number;
  other_document_image?: File | null;
}

export interface LifeInsurancePayload {
  life_insurance_id?: string | number | null;
  customer_id: string | number;
  companies_id: string | number;
  companies_agency_code?: string | number;
  plan_name: string | number;
  payment_mode: string | number;
  policy_number: string;
  policy_term: string | number;
  policy_premium_term: string | number;
  policy_login_date: string;
  policy_start_date: string;
  policy_end_date?: string;
  plan_type: string | number;
  maturity_amount?: string | number;
  sum_assured: string | number;
  net_premium: string | number;
  fy_gst?: string | number;
  gst_amount?: string | number;
  note?: string;
  bank_name?: string;
  account_type?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
  premium_overdue_days?: string | number;
  customer_payment_mode?: string | number;
  regenerate_installments?: string | number | boolean;
  policy_pdf?: File | null;
  riders?: RiderItemPayload[];
  nominees?: NomineeItemPayload[];
  other_documents?: OtherDocumentItemPayload[];
}

export interface UseLifeInsuranceListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useLifeInsuranceList = ({ page = 1, limit = 10, search = '' }: UseLifeInsuranceListParams = {}) => {
  return useQuery({
    queryKey: ['lifeInsuranceList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.LIFE_INSURANCE.LIFE_INSURANCE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data?.life_insurance_list || resData?.data?.list || resData?.data || resData?.life_insurance_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          lifeInsuranceList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching life insurance list');
        return { lifeInsuranceList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useLifeInsuranceActions = () => {
  const queryClient = useQueryClient();

  const insertLifeInsurance = async (payload: LifeInsurancePayload) => {
    try {
      const formData = new FormData();

      if (payload.life_insurance_id) {
        formData.append('life_insurance_id', String(payload.life_insurance_id));
      }
      formData.append('customer_id', String(payload.customer_id ?? ''));
      formData.append('companies_id', String(payload.companies_id ?? ''));
      formData.append('companies_agency_code', String(payload.companies_agency_code ?? ''));
      formData.append('plan_name', String(payload.plan_name ?? ''));
      formData.append('payment_mode', String(payload.payment_mode ?? ''));
      formData.append('policy_number', String(payload.policy_number ?? ''));
      formData.append('policy_term', String(payload.policy_term ?? ''));
      formData.append('policy_premium_term', String(payload.policy_premium_term ?? ''));
      formData.append('policy_login_date', String(payload.policy_login_date ?? ''));
      formData.append('policy_start_date', String(payload.policy_start_date ?? ''));
      formData.append('policy_end_date', String(payload.policy_end_date ?? ''));
      formData.append('plan_type', String(payload.plan_type ?? ''));
      formData.append('maturity_amount', String(payload.maturity_amount ?? ''));
      formData.append('sum_assured', String(payload.sum_assured ?? ''));
      formData.append('net_premium', String(payload.net_premium ?? ''));
      formData.append('fy_gst', String(payload.fy_gst ?? ''));
      formData.append('gst_amount', String(payload.gst_amount ?? ''));
      formData.append('note', String(payload.note ?? ''));
      formData.append('bank_name', String(payload.bank_name ?? ''));
      formData.append('account_type', String(payload.account_type ?? ''));
      formData.append('account_number', String(payload.account_number ?? ''));
      formData.append('ifsc_code', String(payload.ifsc_code ?? ''));
      formData.append('account_holder_name', String(payload.account_holder_name ?? ''));
      formData.append('premium_overdue_days', String(payload.premium_overdue_days ?? ''));
      formData.append('customer_payment_mode', String(payload.customer_payment_mode ?? ''));
      formData.append('regenerate_installments', payload.regenerate_installments ? '1' : '0');

      if (payload.policy_pdf) {
        formData.append('policy_pdf', payload.policy_pdf);
      }

      // Riders
      if (payload.riders && payload.riders.length > 0) {
        payload.riders.forEach((rider, index) => {
          if (rider.riders_id) {
            formData.append(`riders_id[${index}]`, String(rider.riders_id));
            formData.append(`riders_amount[${index}]`, String(rider.riders_amount ?? ''));
            formData.append(`riders_note[${index}]`, String(rider.riders_note ?? ''));
          }
        });
      }

      // Nominees (Postman keys: nomainee_name, nomainee_relationship, nomainee_per)
      if (payload.nominees && payload.nominees.length > 0) {
        payload.nominees.forEach((nominee, index) => {
          if (nominee.nomainee_name) {
            formData.append(`nomainee_name[${index}]`, String(nominee.nomainee_name));
            formData.append(`nomainee_relationship[${index}]`, String(nominee.nomainee_relationship ?? ''));
            formData.append(`nomainee_per[${index}]`, String(nominee.nomainee_per ?? ''));
          }
        });
      }

      // Other documents (Postman keys: other_document_name, other_document_image)
      if (payload.other_documents && payload.other_documents.length > 0) {
        payload.other_documents.forEach((doc, index) => {
          if (doc.other_document_name) {
            formData.append(`other_document_name[${index}]`, String(doc.other_document_name));
          }
          if (doc.other_document_image) {
            formData.append(`other_document_image[${index}]`, doc.other_document_image);
          }
        });
      }

      const response = await api.post(endPointApi.LIFE_INSURANCE.INSERT_LIFE_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Life insurance saved successfully!');
        queryClient.invalidateQueries({ queryKey: ['lifeInsuranceList'] });
        return { success: true, data: resData };
      } else {
        toast.error(resData?.message || 'Failed to save life insurance');
        return { success: false, message: resData?.message };
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Error saving life insurance';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const deleteLifeInsurance = async (lifeInsuranceId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('life_insurance_id', String(lifeInsuranceId));

      const response = await api.post(endPointApi.LIFE_INSURANCE.DELETE_LIFE_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.status === 'success' || resData?.success) {
        toast.success(resData?.message || 'Life insurance deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['lifeInsuranceList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete life insurance');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Error deleting life insurance');
      return false;
    }
  };

  return { insertLifeInsurance, deleteLifeInsurance };
};

export const useViewLifeInsurance = (lifeInsuranceId: string | number | null) => {
  return useQuery({
    queryKey: ['viewLifeInsurance', lifeInsuranceId],
    enabled: Boolean(lifeInsuranceId && !String(lifeInsuranceId).startsWith('placeholder-')),
    queryFn: async () => {
      if (!lifeInsuranceId) return null;
      const formData = new FormData();
      formData.append('life_insurance_id', String(lifeInsuranceId));

      const response = await api.post(endPointApi.LIFE_INSURANCE.VIEW_LIFE_INSURANCE, formData);
      const resData = response?.data;
      return resData?.data || resData || null;
    }
  });
};
