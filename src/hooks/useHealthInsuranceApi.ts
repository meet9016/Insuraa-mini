import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface HealthMasterItem {
  id: string | number;
  name?: string;
  term?: string | number;
}

export interface HealthInsuranceMasterData {
  companies?: HealthMasterItem[];
  payment_mode?: HealthMasterItem[];
  insurance_type?: HealthMasterItem[];
  policy_term?: HealthMasterItem[];
  document_name?: HealthMasterItem[];
  relationship?: HealthMasterItem[];
  plan_type?: HealthMasterItem[];
  health_check_up?: HealthMasterItem[];
  max_documents_allowed?: number;
}

export interface InsuredMemberPayload {
  member_name: string;
  member_relationship: string | number;
  member_dob: string;
  member_age: string | number;
}

export interface OtherDocumentPayload {
  other_document_name: string | number;
  other_document_image?: File | null;
}

export interface HealthInsurancePayload {
  health_insurance_id?: string | number | null;
  customer_id: string | number;
  companies_id: string | number;
  companies_agency_code?: string;
  plan_name: string | number;
  insurance_type: string | number;
  payment_mode: string | number;
  policy_number: string;
  policy_login_date: string;
  policy_start_date: string;
  policy_end_date: string;
  policy_inspection_date?: string;
  plan_type: string | number;
  sum_assured: string | number;
  net_premium: string | number;
  gst_amount?: string | number;
  total_premium: string | number;
  deductable?: string | number;
  bonus?: string | number;
  health_check_up?: string | number;
  health_check_up_amount?: string | number;
  claim?: string | number;
  note?: string;
  policy_pdf?: File | null;
  members?: InsuredMemberPayload[];
  other_documents?: OtherDocumentPayload[];
}

export const useHealthInsuranceMasterData = () => {
  return useQuery<HealthInsuranceMasterData>({
    queryKey: ['healthInsuranceMasterData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.HEALTH_INSURANCE.HEALTH_INSURANCE_MASTER_DATA);
        const resData = response?.data;
        return resData?.data || {};
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health insurance master data');
        return {};
      }
    }
  });
};

export interface HealthCompanyPlanItem {
  plan_id: string | number;
  plan_name: string;
}

export interface HealthCompanyPlansAndAgencyData {
  plan_list: HealthCompanyPlanItem[];
  agency_code: any[];
}

export const useHealthInsuranceCompanyPlansAndAgency = (companyId?: string | number) => {
  return useQuery<HealthCompanyPlansAndAgencyData>({
    queryKey: ['healthInsuranceCompanyPlansAndAgency', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return { plan_list: [], agency_code: [] };
      try {
        const formData = new FormData();
        formData.append('company_id', String(companyId));
        const response = await api.post(endPointApi.HEALTH_INSURANCE.HEALTH_INSURANCE_COMPANY_PLANS_AND_AGENCY, formData);
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

export const useHealthInsuranceActions = () => {
  const queryClient = useQueryClient();

  const insertHealthInsurance = async (payload: HealthInsurancePayload) => {
    try {
      const formData = new FormData();

      if (payload.health_insurance_id) {
        formData.append('health_insurance_id', String(payload.health_insurance_id));
      }
      formData.append('customer_id', String(payload.customer_id ?? ''));
      formData.append('companies_id', String(payload.companies_id ?? ''));
      formData.append('companies_agency_code', String(payload.companies_agency_code ?? ''));
      formData.append('plan_name', String(payload.plan_name ?? ''));
      formData.append('insurance_type', String(payload.insurance_type ?? ''));
      formData.append('payment_mode', String(payload.payment_mode ?? ''));
      formData.append('policy_number', String(payload.policy_number ?? ''));
      formData.append('policy_login_date', String(payload.policy_login_date ?? ''));
      formData.append('policy_start_date', String(payload.policy_start_date ?? ''));
      formData.append('policy_end_date', String(payload.policy_end_date ?? ''));
      formData.append('policy_inspection_date', String(payload.policy_inspection_date ?? ''));
      formData.append('plan_type', String(payload.plan_type ?? ''));
      formData.append('sum_assured', String(payload.sum_assured ?? ''));
      formData.append('net_premium', String(payload.net_premium ?? ''));
      formData.append('gst_amount', String(payload.gst_amount ?? ''));
      formData.append('total_premium', String(payload.total_premium ?? ''));
      formData.append('deductable', String(payload.deductable ?? ''));
      formData.append('bonus', String(payload.bonus ?? ''));
      formData.append('health_check_up', String(payload.health_check_up ?? ''));
      formData.append('health_check_up_amount', String(payload.health_check_up_amount ?? ''));
      formData.append('claim', String(payload.claim ?? ''));
      formData.append('note', String(payload.note ?? ''));

      if (payload.policy_pdf) {
        formData.append('policy_pdf', payload.policy_pdf);
      }

      // Append insured members array
      if (Array.isArray(payload.members)) {
        payload.members.forEach((m, index) => {
          if (m.member_name) {
            formData.append(`member_name[${index}]`, String(m.member_name));
            formData.append(`member_relationship[${index}]`, String(m.member_relationship ?? ''));
            formData.append(`member_dob[${index}]`, String(m.member_dob ?? ''));
            formData.append(`member_age[${index}]`, String(m.member_age ?? ''));
          }
        });
      }

      // Append other documents array
      if (Array.isArray(payload.other_documents)) {
        payload.other_documents.forEach((d, index) => {
          if (d.other_document_name) {
            formData.append(`other_document_name[${index}]`, String(d.other_document_name));
            if (d.other_document_image) {
              formData.append(`other_document_image[${index}]`, d.other_document_image);
            }
          }
        });
      }

      const response = await api.post(endPointApi.HEALTH_INSURANCE.INSERT_HEALTH_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || response?.status === 200) {
        toast.success(resData?.message || 'Health Insurance saved successfully');
        queryClient.invalidateQueries({ queryKey: ['healthInsuranceList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save health insurance');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving health insurance');
      return false;
    }
  };

  const deleteHealthInsurance = async (healthInsuranceId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('health_insurance_id', String(healthInsuranceId));

      const response = await api.post(endPointApi.HEALTH_INSURANCE.DELETE_HEALTH_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.success) {
        toast.success(resData?.message || 'Health insurance deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['healthInsuranceList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete health insurance');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting health insurance');
      return false;
    }
  };

  return {
    insertHealthInsurance,
    deleteHealthInsurance,
  };
};

export interface UseHealthInsuranceListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useHealthInsuranceList = ({ page = 1, limit = 10, search = '' }: UseHealthInsuranceListParams = {}) => {
  return useQuery({
    queryKey: ['healthInsuranceList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.HEALTH_INSURANCE.HEALTH_INSURANCE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data || [];
        const pagArr = resData?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? (Array.isArray(list) ? list.length : 0);

        return {
          healthInsuranceList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health insurance list');
        return { healthInsuranceList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useViewHealthInsurance = (healthInsuranceId: string | number | null) => {
  return useQuery({
    queryKey: ['viewHealthInsurance', healthInsuranceId],
    enabled: Boolean(healthInsuranceId && !String(healthInsuranceId).startsWith('placeholder-')),
    queryFn: async () => {
      if (!healthInsuranceId) return null;
      try {
        const formData = new FormData();
        formData.append('health_insurance_id', String(healthInsuranceId));

        const response = await api.post(endPointApi.HEALTH_INSURANCE.VIEW_HEALTH_INSURANCE, formData);
        const resData = response?.data;
        return resData?.data || resData || null;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching health insurance details');
        return null;
      }
    }
  });
};
