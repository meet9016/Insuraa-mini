import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface LeadItem {
  lead_id: string | number;
  full_name: string;
  number: string;
  whatsapp_number?: string;
  reference?: string;
  business_group_id?: string | number;
  business_group_name?: string;
  product_id?: string | number;
  product_name?: string;
  date?: string;
  cdate?: string;
}

export interface KanbanStatusGroup {
  status_id: string | number;
  status_name: string;
  color?: string;
  total_count?: number;
  leads?: LeadItem[];
}

export interface InsertLeadParams {
  lead_id?: string | number;
  full_name: string;
  number: string;
  whatsapp_number: string;
  reference: string;
  business_group_id: string | number;
  product_id: string | number;
  date: string;
}

export const useLeadKanbanList = () => {
  return useQuery<KanbanStatusGroup[]>({
    queryKey: ['leadKanbanList'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.LEAD.KANBAN_LIST);
        const resData = response.data;
        const list = resData?.data || resData?.list || resData?.kanban_list || [];
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching kanban lead list');
        return [];
      }
    },
  });
};

export const loadMoreKanbanLeads = async (statusId: string | number, page: number) => {
  try {
    const formData = new FormData();
    formData.append('status_id', String(statusId));
    formData.append('page', String(page));

    const response = await api.post(endPointApi.LEAD.KANBAN_LOAD_MORE, formData);
    const resData = response.data;
    const list = Array.isArray(resData?.data)
      ? resData.data
      : resData?.data?.leads || resData?.data?.list || resData?.leads || resData?.list || [];

    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const useBusinessGroupsDropdown = () => {
  return useQuery<Array<{ business_group_id: string | number; name: string }>>({
    queryKey: ['businessGroupsDropdown'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.LEAD.BUSINESS_GROUPS_DROPDOWN);
        const resData = response.data;
        const list = resData?.data || resData?.list || (Array.isArray(resData) ? resData : []);
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching business groups dropdown');
        return [];
      }
    },
  });
};

export const useLeadProductDropdown = () => {
  return useQuery<Array<{ lead_product_id: string | number; name: string }>>({
    queryKey: ['leadProductDropdown'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.LEAD.LEAD_PRODUCT_DROPDOWN);
        const resData = response.data;
        const list = resData?.data || resData?.list || (Array.isArray(resData) ? resData : []);
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching lead product dropdown');
        return [];
      }
    },
  });
};

export const useLeadTableList = ({
  page = 1,
  limit = 10,
  search = '',
  enabled = true,
}: {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ['leadTableList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.LEAD.LEAD_TABLE_LIST, formData);
        const resData = response.data;
        const list = Array.isArray(resData?.data)
          ? resData.data
          : resData?.data?.lead_list || resData?.data?.list || resData?.lead_list || [];

        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const rawTotal =
          pagArr?.total_records ??
          pagArr?.totalRecords ??
          pagArr?.total ??
          resData?.total_records ??
          resData?.totalRecords ??
          resData?.total ??
          resData?.total_count ??
          resData?.data?.total_records ??
          resData?.data?.totalRecords ??
          resData?.data?.total ??
          resData?.data?.total_count ??
          (Array.isArray(list) ? list.length : 0);

        return {
          leadList: Array.isArray(list) ? list : [],
          totalRecords: Number(rawTotal) || (Array.isArray(list) ? list.length : 0),
          paginationArr: pagArr,
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching lead table list');
        return { leadList: [], totalRecords: 0, paginationArr: null };
      }
    },
    enabled,
  });
};

export const useLeadActions = () => {
  const queryClient = useQueryClient();

  const insertLead = async (data: InsertLeadParams) => {
    try {
      const formData = new FormData();
      if (data.lead_id) {
        formData.append('lead_id', String(data.lead_id));
      }
      formData.append('full_name', data.full_name.trim());
      formData.append('number', data.number.trim());
      formData.append('whatsapp_number', data.whatsapp_number.trim());
      formData.append('reference', data.reference.trim());
      formData.append('business_group_id', String(data.business_group_id || ''));
      formData.append('product_id', String(data.product_id || ''));
      formData.append('date', data.date || '');

      const response = await api.post(endPointApi.LEAD.INSERT_LEAD, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Lead inserted successfully');
        queryClient.invalidateQueries({ queryKey: ['leadKanbanList'] });
        queryClient.invalidateQueries({ queryKey: ['leadTableList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to insert lead');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error inserting lead');
      return false;
    }
  };

  const deleteLead = async (leadId: string | number) => {
    try {
      const formData = new FormData();
      formData.append('lead_id', String(leadId));

      const response = await api.post(endPointApi.LEAD.DELETE_LEAD, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Lead deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['leadKanbanList'] });
        queryClient.invalidateQueries({ queryKey: ['leadTableList'] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete lead');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting lead');
      return false;
    }
  };

  return {
    insertLead,
    deleteLead,
  };
};
