import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface LeadReminderItem {
  reminder_id?: string | number;
  id?: string | number;
  lead_id?: string | number;
  date: string;
  time: string;
  message: string;
  created_at?: string;
}

export const useLeadReminderList = (leadId?: string | number, enabled: boolean = true) => {
  return useQuery<LeadReminderItem[]>({
    queryKey: ['leadReminderList', leadId],
    queryFn: async () => {
      if (!leadId) return [];
      try {
        const formData = new FormData();
        formData.append('lead_id', String(leadId));

        const response = await api.post(endPointApi.LEAD.LEAD_REMINDER_LIST, formData);
        const resData = response.data;
        const list =
          resData?.data?.lead_reminder_list ||
          resData?.data?.list ||
          resData?.data ||
          resData?.lead_reminder_list ||
          resData?.list ||
          [];
        return Array.isArray(list) ? list : [];
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching lead reminder list');
        return [];
      }
    },
    enabled: !!leadId && enabled,
  });
};

export const useLeadReminderActions = () => {
  const queryClient = useQueryClient();

  const insertLeadReminder = async ({
    lead_id,
    date,
    time,
    message,
    reminder_id,
  }: {
    lead_id: string | number;
    date: string;
    time: string;
    message: string;
    reminder_id?: string | number;
  }) => {
    try {
      const formData = new FormData();
      formData.append('lead_id', String(lead_id));
      formData.append('date', date || '');
      formData.append('time', time || '');
      formData.append('message', message.trim());
      if (reminder_id) {
        formData.append('reminder_id', String(reminder_id));
      }

      const response = await api.post(endPointApi.LEAD.INSERT_LEAD_REMINDER, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Reminder saved successfully');
        queryClient.invalidateQueries({ queryKey: ['leadReminderList', lead_id] });
        return true;
      } else {
        toast.error(resData?.message || 'Failed to save reminder');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving reminder');
      return false;
    }
  };

  const deleteLeadReminder = async (reminderId: string | number, leadId?: string | number) => {
    try {
      const formData = new FormData();
      formData.append('reminder_id', String(reminderId));

      const response = await api.post(endPointApi.LEAD.DELETE_LEAD_REMINDER, formData);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Reminder deleted successfully');
        if (leadId) {
          queryClient.invalidateQueries({ queryKey: ['leadReminderList', leadId] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['leadReminderList'] });
        }
        return true;
      } else {
        toast.error(resData?.message || 'Failed to delete reminder');
        return false;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting reminder');
      return false;
    }
  };

  return {
    insertLeadReminder,
    deleteLeadReminder,
  };
};
