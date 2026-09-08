import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface MotorMasterItem {
  id: string | number;
  name: string;
}

export interface MotorInsuranceMasterData {
  companies?: MotorMasterItem[];
  class_of_vehicle?: MotorMasterItem[];
  document_name?: MotorMasterItem[];
  vehicle_type?: MotorMasterItem[];
  insurance_type?: MotorMasterItem[];
  plan_type?: MotorMasterItem[];
  ncb_options?: MotorMasterItem[];
  max_documents_allowed?: number;
}

export const useMotorInsuranceMasterData = () => {
  return useQuery<MotorInsuranceMasterData>({
    queryKey: ['motorInsuranceMasterData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.MOTOR_INSURANCE.MOTOR_INSURANCE_MASTER_DATA);
        const resData = response?.data;
        return resData?.data || {};
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching motor insurance master data');
        return {};
      }
    }
  });
};

export interface MotorCompanyPlanItem {
  plan_id: string | number;
  plan_name: string;
}

export interface MotorAgencyCodeItem {
  agency_code_id: string | number;
  name: string;
  code: string;
}

export interface MotorCompanyPlansAndAgencyData {
  plan_list: MotorCompanyPlanItem[];
  agency_code: MotorAgencyCodeItem[];
}

export const useMotorInsuranceCompanyPlansAndAgency = (companyId?: string | number) => {
  return useQuery<MotorCompanyPlansAndAgencyData>({
    queryKey: ['motorInsuranceCompanyPlansAndAgency', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return { plan_list: [], agency_code: [] };
      try {
        const formData = new FormData();
        formData.append('company_id', String(companyId));
        const response = await api.post(endPointApi.MOTOR_INSURANCE.MOTOR_INSURANCE_COMPANY_PLANS_AND_AGENCY, formData);
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

export interface OtherDocumentPayload {
  other_document_name: string | number;
  other_document_image?: File | null;
}

export interface MotorInsurancePayload {
  motor_insurance_id?: string | number | null;
  customer_id: string | number;
  companies_id: string | number;
  plan_name?: string | number;
  companies_agency_code?: string | number;
  vehicle_type?: string | number;
  class_of_vehicle?: string | number;
  insurance_type?: string | number;
  registration_number_rto?: string;
  engine_number?: string;
  chasis_no?: string;
  policy_number?: string;
  policy_login_date?: string;
  policy_start_date?: string;
  policy_end_date?: string;
  plan_type?: string | number;
  mfy_year_of_manufacture?: string | number;
  make_model_variant?: string;
  ncb?: string | number;
  cng_value?: string | number;
  vehicle_value?: string | number;
  own_damage_premimum?: string | number;
  tp_premium?: string | number;
  net_premium?: string | number;
  gst_amount?: string | number;
  total_premium?: string | number;
  note?: string;
  policy_pdf?: File | null;
  other_documents?: OtherDocumentPayload[];
}

export interface MotorInsuranceListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface MotorInsuranceListResponse {
  motorInsuranceList: any[];
  totalRecords: number;
  paginationArr: any;
}

export const useMotorInsuranceList = ({ page = 1, limit = 10, search = '' }: MotorInsuranceListParams = {}) => {
  return useQuery<MotorInsuranceListResponse>({
    queryKey: ['motorInsuranceList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        if (search) {
          formData.append('search', search);
        }

        const response = await api.post(endPointApi.MOTOR_INSURANCE.MOTOR_INSURANCE_LIST, formData);
        const resData = response?.data;

        let list = [];
        if (Array.isArray(resData?.data)) {
          list = resData.data;
        } else if (resData?.data?.motor_insurance_list && Array.isArray(resData.data.motor_insurance_list)) {
          list = resData.data.motor_insurance_list;
        }

        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          motorInsuranceList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching motor insurance list');
        return { motorInsuranceList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useMotorInsuranceActions = () => {
  const queryClient = useQueryClient();

  const insertMotorInsurance = async (payload: MotorInsurancePayload) => {
    try {
      const formData = new FormData();

      if (payload.motor_insurance_id) {
        formData.append('motor_insurance_id', String(payload.motor_insurance_id));
      }
      formData.append('customer_id', String(payload.customer_id ?? ''));
      formData.append('companies_id', String(payload.companies_id ?? ''));
      formData.append('plan_name', String(payload.plan_name ?? ''));
      formData.append('companies_agency_code', String(payload.companies_agency_code ?? ''));
      formData.append('vehicle_type', String(payload.vehicle_type ?? ''));
      formData.append('class_of_vehicle', String(payload.class_of_vehicle ?? ''));
      formData.append('insurance_type', String(payload.insurance_type ?? ''));
      formData.append('registration_number_rto', String(payload.registration_number_rto ?? ''));
      formData.append('engine_number', String(payload.engine_number ?? ''));
      formData.append('chasis_no', String(payload.chasis_no ?? ''));
      formData.append('policy_number', String(payload.policy_number ?? ''));
      formData.append('policy_login_date', String(payload.policy_login_date ?? ''));
      formData.append('policy_start_date', String(payload.policy_start_date ?? ''));
      formData.append('policy_end_date', String(payload.policy_end_date ?? ''));
      formData.append('plan_type', String(payload.plan_type ?? ''));
      formData.append('mfy_year_of_manufacture', String(payload.mfy_year_of_manufacture ?? ''));
      formData.append('make_model_variant', String(payload.make_model_variant ?? ''));
      formData.append('ncb', String(payload.ncb ?? ''));
      formData.append('cng_value', String(payload.cng_value ?? ''));
      formData.append('vehicle_value', String(payload.vehicle_value ?? ''));
      formData.append('own_damage_premimum', String(payload.own_damage_premimum ?? ''));
      formData.append('tp_premium', String(payload.tp_premium ?? ''));
      formData.append('net_premium', String(payload.net_premium ?? ''));
      formData.append('gst_amount', String(payload.gst_amount ?? ''));
      formData.append('total_premium', String(payload.total_premium ?? ''));
      formData.append('note', String(payload.note ?? ''));

      if (payload.policy_pdf) {
        formData.append('policy_pdf', payload.policy_pdf);
      }

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

      const response = await api.post(endPointApi.MOTOR_INSURANCE.INSERT_MOTOR_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || response?.status === 200) {
        toast.success(resData?.message || 'Motor Insurance saved successfully');
        queryClient.invalidateQueries({ queryKey: ['motorInsuranceList'] });
        return { success: true, data: resData };
      } else {
        toast.error(resData?.message || 'Failed to save motor insurance');
        return { success: false };
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving motor insurance');
      return { success: false };
    }
  };

  const deleteMotorInsurance = async (id: string | number) => {
    try {
      const formData = new FormData();
      formData.append('motor_insurance_id', String(id));

      const response = await api.post(endPointApi.MOTOR_INSURANCE.DELETE_MOTOR_INSURANCE, formData);
      const resData = response?.data;

      if (resData?.status === 200 || response?.status === 200) {
        toast.success(resData?.message || 'Motor Insurance deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['motorInsuranceList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete motor insurance');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting motor insurance');
      return false;
    }
  };

  return { insertMotorInsurance, deleteMotorInsurance };
};

export const useViewMotorInsurance = (motorInsuranceId: string | number | null) => {
  return useQuery({
    queryKey: ['viewMotorInsurance', motorInsuranceId],
    enabled: Boolean(motorInsuranceId && !String(motorInsuranceId).startsWith('placeholder-')),
    queryFn: async () => {
      if (!motorInsuranceId) return null;
      const formData = new FormData();
      formData.append('motor_insurance_id', String(motorInsuranceId));

      const response = await api.post(endPointApi.MOTOR_INSURANCE.VIEW_MOTOR_INSURANCE, formData);
      const resData = response?.data;
      return resData?.data || resData || null;
    }
  });
};


