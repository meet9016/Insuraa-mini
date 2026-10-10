import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface AiCreditData {
  balance: number;
  total_added: number;
  total_used: number;
  price_per_credit: number;
  min_purchase: number;
  max_purchase: number;
  gst_percentage: number;
  free_credits: number;
  plan_credits: Array<{ plan_id: number; credits: number }>;
  can_purchase: number;
  [key: string]: any;
}

export const useFetchAiCredits = () => {
  return useQuery<AiCreditData | null>({
    queryKey: ['aiCreditsData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.AI_CREDIT.AI_CREDIT_INFO);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === 'success')) {
          return resData?.data || null;
        } else {
          return null;
        }
      } catch (err: any) {
        console.error('Error fetching AI credits', err);
        return null;
      }
    },
  });
};

export interface AiCreditQuotePayload {
  credits: number;
}

export interface AiCreditQuoteResponse {
  credits: number;
  price_per_credit: number;
  total_price: number;
  gst_percentage: number;
  gst_amount: number;
  final_amount: number;
}

export const useGetAiCreditQuote = () => {
  return useMutation({
    mutationFn: async (payload: AiCreditQuotePayload) => {
      const formData = new FormData();
      formData.append('credits', payload.credits.toString());

      const response = await api.post(endPointApi.AI_CREDIT.AI_CREDIT_QUOTE, formData);
      return response?.data;
    },
  });
};

export const usePurchaseAiCredit = () => {
  return useMutation({
    mutationFn: async (payload: AiCreditQuotePayload) => {
      const formData = new FormData();
      formData.append('credits', payload.credits.toString());

      const response = await api.post(endPointApi.AI_CREDIT.AI_CREDIT_PURCHASE, formData);
      console.log(response, 'responce');
      
      return response?.data;
    },
  });
};

export interface AiCreditHistoryItem {
  id: number;
  type: number;
  source: string;
  title: string;
  credits: number;
  balance_after: number;
  amount: number;
  note: string;
  created_at: string;
}

export interface AiCreditHistoryResponse {
  data: AiCreditHistoryItem[];
  pagination_arr: {
    page: number;
    limit: number;
    total_records: number;
  };
}

export const useFetchAiCreditHistory = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery<AiCreditHistoryResponse | null>({
    queryKey: ['aiCreditHistory', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', page.toString());
        formData.append('limit', limit.toString());
        if (search) {
          formData.append('search', search);
        }
        
        const response = await api.post(endPointApi.AI_CREDIT.AI_CREDIT_HISTORY, formData);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === 'success')) {
          return {
            data: resData.data || [],
            pagination_arr: resData.pagination_arr || { page: 1, limit: 10, total_records: 0 }
          };
        } else {
          return null;
        }
      } catch (err: any) {
        console.error('Error fetching AI credit history', err);
        return null;
      }
    },
  });
};
