import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface LeadNoteItem {
  lead_note_id?: string | number;
  id?: string | number;
  lead_id?: string | number;
  remark: string;
  date?: string;
  cdate?: string;
  created_at?: string;
}

export const useLeadNoteList = (leadId?: string | number, enabled: boolean = true) => {
  return useQuery<LeadNoteItem[]>({
    queryKey: ['leadNoteList', leadId],
    queryFn: async () => {
      if (!leadId) return [];
      try {
        const formData = new FormData();
        formData.append('lead_id', String(leadId));

        const response = await api.post(endPointApi.LEAD.LEAD_NOTE_LIST, formData);
        const resData = response.data;
        const list =
          resData?.data?.lead_note_list ||
          resData?.data?.list ||
          resData?.data ||
          resData?.lead_note_list ||
          resData?.list ||
          [];
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching lead note list');
        return [];
      }
    },
    enabled: !!leadId && enabled,
  });
};

export const useLeadNoteActions = () => {
  const queryClient = useQueryClient();

  const insertLeadNote = async ({
    lead_id,
    remark,
    lead_note_id,
  }: {
    lead_id: string | number;
    remark: string;
    lead_note_id?: string | number;
  }) => {
    try {
      const formData = new FormData();
      formData.append('lead_id', String(lead_id));
      formData.append('remark', remark.trim());
      if (lead_note_id) {
        formData.append('lead_note_id', String(lead_note_id));
        formData.append('id', String(lead_note_id));
        formData.append('note_id', String(lead_note_id));
      }

      const response = await api.post(endPointApi.LEAD.INSERT_LEAD_NOTE, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Note saved successfully');
        queryClient.invalidateQueries({ queryKey: ['leadNoteList', lead_id] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save note');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving note');
      return false;
    }
  };

  const deleteLeadNote = async (leadNoteId: string | number, leadId?: string | number) => {
    try {
      const formData = new FormData();
      formData.append('lead_note_id', String(leadNoteId));

      const response = await api.post(endPointApi.LEAD.DELETE_LEAD_NOTE, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Note deleted successfully');
        if (leadId) {
          queryClient.invalidateQueries({ queryKey: ['leadNoteList', leadId] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['leadNoteList'] });
        }
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete note');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting note');
      return false;
    }
  };

  return {
    insertLeadNote,
    deleteLeadNote,
  };
};
