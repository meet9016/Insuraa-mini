import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface GlobalSearchCustomer {
  customer_id: number;
  full_name: string;
  number: string;
  email: string;
  group_code: string;
  customer_type_id?: number;
  customer_type_name?: string;
  city?: string;
  state?: string;
  image?: string;
}

export interface GlobalSearchInsurancePolicy {
  policy_id: number;
  insurance_key: 'life' | 'health' | 'motor' | 'other' | string;
  insurance_type_name: string;
  other_insurance_type?: number;
  policy_number: string;
  company_name: string;
  customer_id: number;
  customer_name: string;
  customer_number: string;
  customer_group_code?: string;
  total_premium: string;
  policy_start_date?: string;
  policy_end_date?: string;
  expired?: number;
}

export interface GlobalSearchClaim {
  claim_id: number;
  claim_number: string;
  insurance_type: string;
  customer_insurance_id?: string;
  customer_id: number;
  customer_name: string;
  customer_number: string;
  claim_amount: number | string;
  claim_status: string;
  created_at: string;
}

export interface GlobalSearchLead {
  id?: number;
  lead_id?: number;
  name?: string;
  customer_name?: string;
  number?: string;
  phone?: string;
  product_name?: string;
  status?: string;
  [key: string]: any;
}

export interface GlobalSearchQuotation {
  id?: number;
  quotation_id?: number;
  quote_number?: string;
  customer_name?: string;
  company_name?: string;
  premium_amount?: string | number;
  [key: string]: any;
}

export interface SearchCategoryGroup<T = any> {
  title: string;
  total: number;
  list: T[];
}

export interface GlobalSearchResults {
  customers?: SearchCategoryGroup<GlobalSearchCustomer>;
  life_insurance?: SearchCategoryGroup<GlobalSearchInsurancePolicy>;
  health_insurance?: SearchCategoryGroup<GlobalSearchInsurancePolicy>;
  motor_insurance?: SearchCategoryGroup<GlobalSearchInsurancePolicy>;
  other_insurance?: SearchCategoryGroup<GlobalSearchInsurancePolicy>;
  leads?: SearchCategoryGroup<GlobalSearchLead>;
  claims?: SearchCategoryGroup<GlobalSearchClaim>;
  health_quotations?: SearchCategoryGroup<GlobalSearchQuotation>;
  motor_quotations?: SearchCategoryGroup<GlobalSearchQuotation>;
  [key: string]: SearchCategoryGroup<any> | undefined;
}

export interface GlobalSearchData {
  query: string;
  type: string;
  limit_per_group: number;
  total_results: number;
  results: GlobalSearchResults;
}

export interface UseGlobalSearchParams {
  query: string;
  type?: string;
  limit_per_group?: number;
  enabled?: boolean;
}

export const useGlobalSearch = ({
  query,
  type = 'all',
  limit_per_group = 5,
  enabled = true,
}: UseGlobalSearchParams) => {
  const cleanQuery = (query || '').trim();
  const shouldFetch = enabled && cleanQuery.length >= 2;

  return useQuery<GlobalSearchData | null>({
    queryKey: ['globalSearch', cleanQuery, type, limit_per_group],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('query', cleanQuery);
        if (type) formData.append('type', type);
        if (limit_per_group) formData.append('limit_per_group', String(limit_per_group));

        const response = await api.post(endPointApi.SEARCH.GLOBAL_SEARCH, formData);
        const resData = response.data;

        if (resData?.status === 200 || resData?.status === '200' || resData?.status === 'success') {
          return resData?.data || null;
        }

        return null;
      } catch (err: any) {
        console.error('Error during global search API call:', err);
        return null;
      }
    },
    enabled: shouldFetch,
    staleTime: 1000 * 30, // 30 seconds cache
    refetchOnWindowFocus: false,
  });
};
