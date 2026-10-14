import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseDocumentListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useDocumentList = ({ page = 1, limit = 10, search = '' }: UseDocumentListParams = {}) => {
  return useQuery({
    queryKey: ['documentList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);

        const response = await api.post(endPointApi.DOCUMENT.DOCUMENT_LIST, formData);
        const resData = response.data;
        const list = resData?.data?.document_list || resData?.data?.list || resData?.data || resData?.document_list || [];
        const pagArr = resData?.pagination_arr || resData?.data?.pagination_arr;
        const totalRecords = pagArr?.total_records ?? pagArr?.totalRecords ?? pagArr?.total ?? (Array.isArray(list) ? list.length : 0);

        return {
          documentList: Array.isArray(list) ? list : [],
          totalRecords: Number(totalRecords),
          paginationArr: pagArr
        };
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error fetching document list');
        return { documentList: [], totalRecords: 0, paginationArr: null };
      }
    }
  });
};

export const useDocumentActions = () => {
  const queryClient = useQueryClient();

  const insertDocument = async (name: string, editingDocumentId?: string | number | null) => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (editingDocumentId) {
        formData.append("document_id", String(editingDocumentId));
      }
      const response = await api.post(endPointApi.DOCUMENT.INSERT_DOCUMENT, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Document saved successfully');
        queryClient.invalidateQueries({
          queryKey: ["documentList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving document');
      return false;
    }
  };

  const deleteDocument = async (documentId: string | number) => {
    try {
      const formData = new FormData();
      formData.append("document_id", String(documentId));
      const response = await api.post(endPointApi.DOCUMENT.DELETE_DOCUMENT, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message || 'Document deleted successfully');
        queryClient.invalidateQueries({
          queryKey: ["documentList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting document');
      return false;
    }
  };

  const bulkDeleteDocument = async (ids: (string | number)[]) => {
    if (!ids || ids.length === 0) return { success: false, message: 'No records selected' };
    try {
      const formData = new FormData();
      formData.append('ids', ids.join(','));

      const response = await api.post(endPointApi.DOCUMENT.BULK_DELETE_DOCUMENT, formData);
      const resData = response?.data;

      if (resData?.status === 200 || resData?.status === '200' || resData?.success) {
        const data = resData?.data;
        const deletedCount = data?.deleted_count ?? ids.length;
        const skipped = Array.isArray(data?.skipped) ? data.skipped : [];
        const skippedCount = data?.skipped_count ?? skipped.length;

        if (skippedCount > 0) {
          if (deletedCount > 0) {
            toast.success(resData?.message || `${deletedCount} records deleted, ${skippedCount} skipped`);
          } else {
            toast.warn(resData?.message || `${skippedCount} records could not be deleted`);
          }
        } else {
          toast.success(resData?.message || `${deletedCount} Document(s) deleted successfully`);
        }

        queryClient.invalidateQueries({ queryKey: ['documentList'] });
        return { success: true, deletedCount, skippedCount, skipped };
      } else {
        toast.error(resData?.message || 'Failed to bulk delete documents');
        return { success: false };
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting documents');
      return { success: false };
    }
  };

  return {
    insertDocument,
    deleteDocument,
    bulkDeleteDocument,
  };
};
