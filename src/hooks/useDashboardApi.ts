import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface DashboardSummaryData {
  total_policy?: number | string;
  total_quotation?: number | string;
  total_renewal?: number | string;
  total_customer?: number | string;
  total_lead?: number | string;
  total_claim?: number | string;
  [key: string]: any;
}

export const useDashboardSummary = () => {
  return useQuery<DashboardSummaryData>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.DASHBOARD.DASHBOARD_SUMMARY);
        const resData = response.data;
        if (resData?.status === 200 || resData?.status === '200' || resData?.data) {
          return resData?.data || {};
        }
        return {};
      } catch (err: any) {
        console.error('Error fetching dashboard summary:', err);
        return {};
      }
    },
  });
};

export interface UseCalendarEventsParams {
  side: 'left' | 'right';
  year: number | string;
  month: number | string;
}

export interface CalendarEventsResponseData {
  side?: string;
  year?: number | string;
  month?: number | string;
  events?: Record<string, string[]>;
  [key: string]: any;
}

export const useCalendarEvents = ({ side, year, month }: UseCalendarEventsParams) => {
  const monthStr = String(month);
  const formattedMonth = String(month).padStart(2, '0');

  return useQuery<CalendarEventsResponseData>({
    queryKey: ['calendarEvents', side, String(year), monthStr, formattedMonth],
    queryFn: async () => {
      const attempts = [
        // 1. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_CALENDAR_EVENTS, {
          side,
          year: String(year),
          month: monthStr,
        }),
        // 2. URLSearchParams unpadded month
        () => {
          const params = new URLSearchParams();
          params.append('side', side);
          params.append('year', String(year));
          params.append('month', monthStr);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CALENDAR_EVENTS, params);
        },
        // 3. URLSearchParams padded month (e.g. "10" or "09")
        () => {
          const params = new URLSearchParams();
          params.append('side', side);
          params.append('year', String(year));
          params.append('month', formattedMonth);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CALENDAR_EVENTS, params);
        },
        // 4. FormData unpadded
        () => {
          const formData = new FormData();
          formData.append('side', side);
          formData.append('year', String(year));
          formData.append('month', monthStr);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CALENDAR_EVENTS, formData);
        },
        // 5. FormData padded
        () => {
          const formData = new FormData();
          formData.append('side', side);
          formData.append('year', String(year));
          formData.append('month', formattedMonth);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CALENDAR_EVENTS, formData);
        },
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            return resData.data || {};
          }
        } catch (e) {
          // continue to next format attempt
        }
      }

      return {};
    },
    enabled: !!side && !!year && !!month,
  });
};

export interface BirthdayEventItem {
  customer_id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  dob?: string;
  age?: number | string;
  [key: string]: any;
}

export interface AnniversaryEventItem {
  customer_id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  anniversary_date?: string;
  [key: string]: any;
}

export interface LeadEventItem {
  id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}

export interface PolicyRenewalItem {
  policy_id?: number | string;
  main_policy_id?: number | string;
  insurance_type_name?: string;
  other_insurance_type?: number | string;
  customer_id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  policy_number?: string;
  premium_amount?: string | number;
  expiry?: string;
  [key: string]: any;
}

export interface DashboardDayDetailsResponseData {
  side?: string;
  date?: string;
  total_events?: number;
  events?: {
    birthday?: BirthdayEventItem[];
    anniversary?: AnniversaryEventItem[];
    lead?: LeadEventItem[];
    health?: PolicyRenewalItem[];
    motor?: PolicyRenewalItem[];
    life?: PolicyRenewalItem[];
    other?: PolicyRenewalItem[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface UseDashboardDayDetailsParams {
  side: 'left' | 'right';
  date: string;
}

export const useDashboardDayDetails = ({ side, date }: UseDashboardDayDetailsParams) => {
  return useQuery<DashboardDayDetailsResponseData>({
    queryKey: ['dashboardDayDetails', side, date],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('side', side);
          formData.append('date', date);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_DAY_DETAILS, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('side', side);
          params.append('date', date);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_DAY_DETAILS, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_DAY_DETAILS, { side, date }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            return resData.data || {};
          }
        } catch (e) {
          // continue
        }
      }

      return {};
    },
    enabled: Boolean(side && date),
  });
};

export interface UseDashboardPaymentPendingParams {
  period: string;
  from?: string;
  to?: string;
}

export interface PaymentPendingItem {
  installment_id?: number | string;
  ins_type?: string;
  policy_id?: number | string;
  policy_number?: string;
  customer_id?: number | string;
  customer_name?: string;
  phone?: string;
  due_date?: string;
  amount?: string | number;
  gst_amount?: string | number;
  final_amount?: string | number;
  payment_status?: number | string;
  [key: string]: any;
}

export interface DashboardPaymentPendingResponseData {
  range_label?: string;
  from?: string;
  to?: string;
  total_records?: number;
  list?: PaymentPendingItem[];
  [key: string]: any;
}

export const useDashboardPaymentPending = ({ period, from = '', to = '' }: UseDashboardPaymentPendingParams) => {
  return useQuery<DashboardPaymentPendingResponseData>({
    queryKey: ['dashboardPaymentPending', period, from, to],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('period', period);
          formData.append('from', from);
          formData.append('to', to);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_PAYMENT_PENDING, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('period', period);
          params.append('from', from);
          params.append('to', to);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_PAYMENT_PENDING, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_PAYMENT_PENDING, { period, from, to }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            return resData.data || {};
          }
        } catch (e) {
          // continue
        }
      }

      return {};
    },
    enabled: Boolean(period),
  });
};

export interface RenewalTypeItem {
  id: string | number;
  name: string;
  [key: string]: any;
}

export const useDashboardRenewalTypeList = () => {
  return useQuery<RenewalTypeItem[]>({
    queryKey: ['dashboardRenewalTypeList'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.DASHBOARD.DASHBOARD_RENEWAL_TYPE_LIST);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200')) {
          return Array.isArray(resData.data) ? resData.data : [];
        }
        return [];
      } catch (err) {
        console.error('Error fetching renewal type list:', err);
        return [];
      }
    },
  });
};

export interface UseDashboardRenewalPendingParams {
  period: string;
  type?: string;
  from?: string;
  to?: string;
}

export interface RenewalPendingItem {
  policy_id?: number | string;
  main_policy_id?: number | string;
  insurance_key?: string;
  ins_type?: string;
  other_insurance_type?: number | string;
  customer_id?: number | string;
  customer_name?: string;
  phone?: string;
  policy_number?: string;
  premium_amount?: string | number;
  policy_start_date?: string;
  policy_end_date?: string;
  days_left?: number | string;
  is_expired?: number | string;
  [key: string]: any;
}

export interface DashboardRenewalPendingResponseData {
  range_label?: string;
  total_records?: number;
  list?: RenewalPendingItem[];
  [key: string]: any;
}

export const useDashboardRenewalPending = ({ period, type = 'all', from = '', to = '' }: UseDashboardRenewalPendingParams) => {
  return useQuery<DashboardRenewalPendingResponseData>({
    queryKey: ['dashboardRenewalPending', period, type, from, to],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('period', period);
          formData.append('type', String(type));
          formData.append('from', from);
          formData.append('to', to);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_RENEWAL_PENDING, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('period', period);
          params.append('type', String(type));
          params.append('from', from);
          params.append('to', to);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_RENEWAL_PENDING, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_RENEWAL_PENDING, { period, type: String(type), from, to }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            return resData.data || {};
          }
        } catch (e) {
          // continue
        }
      }

      return {};
    },
    enabled: Boolean(period),
  });
};

export const CHART_COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#6366F1', // Indigo accent
];

export interface UseDashboardChartCompanyParams {
  yearFilter: 'all' | 'curr' | 'prev' | string;
  companyType: 'general' | 'life' | string;
}

export interface CompanyChartItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardChartCompanyResponseData {
  year?: string;
  title?: string;
  total?: number;
  items?: CompanyChartItem[];
  [key: string]: any;
}

export const useDashboardChartCompany = ({ yearFilter, companyType }: UseDashboardChartCompanyParams) => {
  return useQuery<DashboardChartCompanyResponseData>({
    queryKey: ['dashboardChartCompany', yearFilter, companyType],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('year_filter', yearFilter);
          formData.append('company_type', companyType);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_COMPANY, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('year_filter', yearFilter);
          params.append('company_type', companyType);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_COMPANY, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_COMPANY, { year_filter: yearFilter, company_type: companyType }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            const rawData = resData.data || {};
            const section = rawData[companyType] || rawData.general || rawData.life || {};
            const labels: string[] = Array.isArray(section.labels) ? section.labels : [];
            const values: number[] = Array.isArray(section.data) ? section.data : [];

            const items: CompanyChartItem[] = labels.map((label, idx) => ({
              name: String(label || 'Unknown'),
              value: Number(values[idx] || 0),
              color: CHART_COLORS[idx % CHART_COLORS.length],
            }));

            return {
              year: rawData.year || 'All',
              title: section.title || (companyType === 'general' ? 'General Insurance' : 'Life Insurance'),
              total: Number(section.total || 0),
              items,
            };
          }
        } catch (e) {
          // continue
        }
      }

      return { items: [] };
    },
    enabled: Boolean(yearFilter && companyType),
  });
};

export interface UseDashboardChartTypeParams {
  yearFilter: 'all' | 'curr' | 'prev' | string;
}

export interface TypeChartItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardChartTypeResponseData {
  year?: string;
  items?: TypeChartItem[];
  [key: string]: any;
}

export const useDashboardChartType = ({ yearFilter }: UseDashboardChartTypeParams) => {
  return useQuery<DashboardChartTypeResponseData>({
    queryKey: ['dashboardChartType', yearFilter],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('year_filter', yearFilter);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_TYPE, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('year_filter', yearFilter);
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_TYPE, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_TYPE, { year_filter: yearFilter }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            const rawData = resData.data || {};
            const labels: string[] = Array.isArray(rawData.labels) ? rawData.labels : [];
            const values: number[] = Array.isArray(rawData.data) ? rawData.data : [];

            const items: TypeChartItem[] = labels.map((label, idx) => ({
              name: String(label || 'Unknown'),
              value: Number(values[idx] || 0),
              color: CHART_COLORS[idx % CHART_COLORS.length],
            }));

            return {
              year: rawData.year || 'All',
              items,
            };
          }
        } catch (e) {
          // continue
        }
      }

      return { items: [] };
    },
    enabled: Boolean(yearFilter),
  });
};

export interface UseDashboardChartPolicyParams {
  mode: string;
  year: string | number;
}

export interface PolicyChartItem {
  name: string;
  value: number;
}

export interface DashboardChartPolicyResponseData {
  mode?: string;
  year?: string | number;
  items?: PolicyChartItem[];
  [key: string]: any;
}

export const useDashboardChartPolicy = ({ mode, year }: UseDashboardChartPolicyParams) => {
  return useQuery<DashboardChartPolicyResponseData>({
    queryKey: ['dashboardChartPolicy', mode, year],
    queryFn: async () => {
      const attempts = [
        // 1. FormData (Primary)
        () => {
          const formData = new FormData();
          formData.append('mode', mode);
          formData.append('year', String(year));
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_POLICY, formData);
        },
        // 2. URLSearchParams (x-www-form-urlencoded)
        () => {
          const params = new URLSearchParams();
          params.append('mode', mode);
          params.append('year', String(year));
          return api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_POLICY, params);
        },
        // 3. JSON Payload
        () => api.post(endPointApi.DASHBOARD.DASHBOARD_CHART_POLICY, { mode, year: String(year) }),
      ];

      for (const attempt of attempts) {
        try {
          const response = await attempt();
          const resData = response?.data;
          if (resData && (resData.status === 200 || resData.status === '200')) {
            const rawData = resData.data || {};
            const labels: string[] = Array.isArray(rawData.labels) ? rawData.labels : [];
            const values: number[] = Array.isArray(rawData.data) ? rawData.data : [];

            const items: PolicyChartItem[] = labels.map((label, idx) => ({
              name: String(label || ''),
              value: Number(values[idx] || 0),
            }));

            return {
              mode: rawData.mode || mode,
              year: rawData.year || year,
              items,
            };
          }
        } catch (e) {
          // continue
        }
      }

      return { items: [] };
    },
    enabled: Boolean(mode && year),
  });
};











