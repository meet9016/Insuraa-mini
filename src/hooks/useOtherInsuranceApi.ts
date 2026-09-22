import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export const useOtherInsuranceList = (params: { page: number; limit: number; search?: string }) => {
  return useQuery({
    queryKey: ['otherInsuranceList', params.page, params.limit, params.search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(params.page));
        formData.append('limit', String(params.limit));
        if (params.search) {
          formData.append('search', params.search);
        }

        const response = await api.post(endPointApi.OTHER_INSURANCE.OTHER_INSURANCE_LIST, formData);

        const resData = response.data?.data;
        const list = Array.isArray(resData)
          ? resData
          : (resData?.other_insurance_list || resData?.list || []);

        const pagArr = response.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? list.length;

        return {
          otherInsuranceList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching other insurance list');
        return { otherInsuranceList: [], totalRecords: 0 };
      }
    },
  });
};
export const useOtherInsuranceView = (id: string | null) => {
  return useQuery({
    queryKey: ['otherInsuranceView', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const formData = new FormData();
        formData.append('other_insurance_id', id);
        const response = await api.post(endPointApi.OTHER_INSURANCE.VIEW_OTHER_INSURANCE, formData);
        return response.data?.data || null;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching details');
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useOtherInsuranceActions = () => {
  const queryClient = useQueryClient();
  const insertOtherInsurance = async (payload: any) => {
    try {
      const formData = new FormData();

      // Append all scalar fields
      Object.keys(payload).forEach(key => {
        if (key !== 'other_documents' && key !== 'policy_pdf' && payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      // Append policy pdf
      if (payload.policy_pdf) {
        formData.append('policy_pdf', payload.policy_pdf);
      }

      // Append dynamic documents
      if (payload.other_documents && Array.isArray(payload.other_documents)) {
        payload.other_documents.forEach((doc: any, index: number) => {
          if (doc.other_document_name) {
            formData.append(`other_document_name[${index}]`, doc.other_document_name);
          }
          if (doc.other_document_image) {
            formData.append(`other_document_image[${index}]`, doc.other_document_image);
          }
        });
      }

      const response = await api.post(endPointApi.OTHER_INSURANCE.INSERT_OTHER_INSURANCE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.status === 200;
    } catch (error) {
      console.error('Error inserting other insurance:', error);
      throw error;
    }
  };

  const deleteOtherInsurance = async (id: string) => {
    try {
      const formData = new FormData();
      formData.append('other_insurance_id', id);
      const response = await api.post(endPointApi.OTHER_INSURANCE.DELETE_OTHER_INSURANCE, formData);
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['otherInsuranceList'] });
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error deleting other insurance');
      return false;
    }
  };

  return { insertOtherInsurance, deleteOtherInsurance };
};

export const useOtherInsuranceMasterData = () => {
  return useQuery({
    queryKey: ['otherInsuranceMasterData'],
    queryFn: async () => {
      const response = await api.post(endPointApi.OTHER_INSURANCE.OTHER_INSURANCE_MASTER_DATA);
      return response.data?.data || {
        companies: [],
        insurance_type: [],
        document_name: [],
        plan_type: [],
        policy_status: [],
        max_documents_allowed: 5,
      };
    },
  });
};

export const useOtherInsuranceCompanyPlansAndAgency = (companyId: string) => {
  return useQuery({
    queryKey: ['otherInsuranceCompanyPlans', companyId],
    queryFn: async () => {
      if (!companyId) return { plan_list: [], agency_code: [] };
      const formData = new FormData();
      formData.append('company_id', companyId);
      const response = await api.post(endPointApi.OTHER_INSURANCE.OTHER_INSURANCE_COMPANY_PLANS_AND_AGENCY, formData);
      return response.data?.data || { plan_list: [], agency_code: [] };
    },
    enabled: !!companyId,
  });
};
