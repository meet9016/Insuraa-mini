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

export interface MotorQuotationMasterData {
  companies?: CompanyItem[];
  vehicle_type?: DropdownItem[];
  make?: DropdownItem[];
}

export const useMotorQuotationMasterData = () => {
  return useQuery<MotorQuotationMasterData>({
    queryKey: ['motorQuotationMasterData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.MOTOR_QUOTATION.MOTOR_QUOTATION_MASTER_DATA);
        const resData = response?.data;
        return resData?.data || {};
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching motor quotation master data');
        return {};
      }
    },
  });
};

export interface MotorQuotationProductItem {
  product_id: string | number;
  name: string;
}

export const useMotorQuotationProducts = (companyId?: string | number) => {
  return useQuery<MotorQuotationProductItem[]>({
    queryKey: ['motorQuotationProducts', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return [];
      try {
        const formData = new FormData();
        formData.append('company_id', String(companyId));
        const response = await api.post(
          endPointApi.MOTOR_QUOTATION.MOTOR_QUOTATION_PRODUCT_LIST_DROPDOWN,
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

export interface MotorQuotationQuoteItem {
  company_id?: string | number;
  company_name?: string;
  product_id?: string | number;
  product_name?: string;
  add_on?: string;
  idv?: string | number;
  premium?: string | number;
  discount?: string;
  remark?: string;
  is_recommended?: boolean | number;
}

export interface MotorQuotationPayload {
  quotation_id?: string | number | null;
  insured_name: string;
  mobile?: string;
  email?: string;
  house_no?: string;
  street?: string;
  area?: string;
  city?: string;
  pincode?: string;
  state?: string;
  vehicle_type_id?: string | number;
  vehicle_type?: string;
  make_id?: string | number;
  make?: string;
  model_id?: string | number;
  model?: string;
  registration_no?: string;
  mfg_year?: string | number;
  cc_gvw?: string | number;
  zone?: string;
  seat_capacity?: string | number;
  total_idv?: string | number;
  ncb_percent?: string | number;
  remarks?: string;
  quotes?: MotorQuotationQuoteItem[];
}

export const useMotorQuotationActions = () => {
  const queryClient = useQueryClient();

  const insertMotorQuotation = async (payload: MotorQuotationPayload) => {
    try {
      const formData = new FormData();
      if (payload.quotation_id) {
        formData.append('quotation_id', String(payload.quotation_id));
      }
      formData.append('insured_name', String(payload.insured_name ?? ''));
      formData.append('mobile', String(payload.mobile ?? ''));
      formData.append('email', String(payload.email ?? ''));
      formData.append('house_no', String(payload.house_no ?? ''));
      formData.append('street', String(payload.street ?? ''));
      formData.append('area', String(payload.area ?? ''));
      formData.append('city', String(payload.city ?? ''));
      formData.append('pincode', String(payload.pincode ?? ''));
      formData.append('state', String(payload.state ?? ''));
      formData.append('vehicle_type_id', String(payload.vehicle_type_id ?? ''));
      formData.append('vehicle_type', String(payload.vehicle_type ?? ''));
      formData.append('make_id', String(payload.make_id ?? ''));
      formData.append('make', String(payload.make ?? ''));
      formData.append('model_id', String(payload.model_id ?? ''));
      formData.append('model', String(payload.model ?? ''));
      formData.append('registration_no', String(payload.registration_no ?? ''));
      formData.append('mfg_year', String(payload.mfg_year ?? ''));
      formData.append('cc_gvw', String(payload.cc_gvw ?? ''));
      formData.append('zone', String(payload.zone ?? ''));
      formData.append('seat_capacity', String(payload.seat_capacity ?? ''));
      formData.append('total_idv', String(payload.total_idv ?? ''));
      formData.append('ncb_percent', String(payload.ncb_percent ?? ''));
      formData.append('remarks', String(payload.remarks ?? ''));

      if (Array.isArray(payload.quotes)) {
        payload.quotes.forEach((q, index) => {
          formData.append(`company_name[${index}]`, String(q.company_id ?? q.company_name ?? ''));
          formData.append(`product_name[${index}]`, String(q.product_id ?? q.product_name ?? ''));
          formData.append(`add_on[${index}]`, String(q.add_on ?? ''));
          formData.append(`idv[${index}]`, String(q.idv ?? ''));
          formData.append(`premium[${index}]`, String(q.premium ?? ''));
          formData.append(`discount[${index}]`, String(q.discount ?? ''));
          formData.append(`remark[${index}]`, String(q.remark ?? ''));
          formData.append(`is_recommended[${index}]`, q.is_recommended ? '1' : '0');
        });
      }

      const response = await api.post(
        endPointApi.MOTOR_QUOTATION.INSERT_MOTOR_QUOTATION,
        formData
      );
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || response?.status === 200) {
        toast.success(resData?.message || 'Motor Quotation saved successfully');
        queryClient.invalidateQueries({ queryKey: ['motorQuotationList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save motor quotation');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving motor quotation');
      return false;
    }
  };

  const deleteMotorQuotation = async (quotationId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('quotation_id', String(quotationId));

      const response = await api.post(
        endPointApi.MOTOR_QUOTATION.DELETE_MOTOR_QUOTATION,
        formData
      );
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.success) {
        toast.success(resData?.message || 'Motor quotation deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['motorQuotationList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete motor quotation');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting motor quotation');
      return false;
    }
  };

  return {
    insertMotorQuotation,
    deleteMotorQuotation,
  };
};

export interface UseMotorQuotationListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useMotorQuotationList = ({
  page = 1,
  limit = 10,
  search = '',
}: UseMotorQuotationListParams = {}) => {
  return useQuery({
    queryKey: ['motorQuotationList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(
          endPointApi.MOTOR_QUOTATION.MOTOR_QUOTATION_LIST,
          formData
        );
        const resData = response?.data;
        const list = resData?.data || [];
        const pagArr = resData?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? (Array.isArray(list) ? list.length : 0);

        return {
          quotationList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr,
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching motor quotation list');
        return { quotationList: [], totalRecords: 0, paginationArr: null };
      }
    },
  });
};

export const useMotorQuotationDetail = (quotationId?: string | number | null) => {
  return useQuery({
    queryKey: ['motorQuotationDetail', quotationId],
    enabled: !!quotationId,
    queryFn: async () => {
      if (!quotationId) return null;
      try {
        const formData = new FormData();
        formData.append('quotation_id', String(quotationId));
        const response = await api.post(
          endPointApi.MOTOR_QUOTATION.MOTOR_QUOTATION_EDIT,
          formData
        );
        const resData = response?.data;
        return resData?.data || null;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching motor quotation details');
        return null;
      }
    },
  });
};




