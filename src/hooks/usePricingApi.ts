import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface PlanTier {
  name: string;
  from: number;
  to: number | null;
  rate: number;
  features: string[];
}

export interface BillingCycle {
  billing_cycle: 'monthly' | 'quarterly' | 'yearly' | string;
  label: string;
  multiplier: number;
  plan_id: number;
}

export interface DirectPlanInfoData {
  min_policies: number;
  max_policies: number;
  gst_percentage: number;
  tiers: PlanTier[];
  cycles: BillingCycle[];
  first_purchase_free_ai_credits: string;
  free_trial_days: number;
}

export interface DirectPlanInfoResponse {
  status: number | string | boolean;
  message?: string;
  data: DirectPlanInfoData;
}

export interface DirectPlanQuoteParams {
  policies: number;
  billing_cycle: string;
  coupon_code?: string;
}

export interface DirectPlanQuoteData {
  plan_id: number;
  billing_cycle: string;
  cycle_label: string;
  months: number;
  policies: number;
  tier: string;
  rate_per_policy: number;
  per_month_price: number;
  plan_name: string;
  total_price: number;
  coupon_per: number;
  coupon_amount: number;
  price_after_discount: number;
  gst_percentage: number;
  gst_amount: number;
  final_amount: number;
  coupon_code: string;
  free_ai_credits: number;
  [key: string]: any;
}

export interface DirectPlanQuoteResponse {
  status: number | string | boolean;
  message?: string;
  data: DirectPlanQuoteData | any;
}

/**
 * Hook to fetch direct plan info for pricing section & checkout modal
 * Follows the existing TanStack Query + axiosInstance pattern across the project.
 */
export const useDirectPlanInfo = () => {
  return useQuery<DirectPlanInfoData | null>({
    queryKey: ['directPlanInfo'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.PRICING.DIRECT_PLAN_INFO);
        const resData = response?.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === true)) {
          return resData?.data || null;
        }
        return resData?.data || null;
      } catch (err: any) {
        console.error('Error fetching direct plan info:', err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

/**
 * Direct async function to fetch plan quote via FormData
 */
export const fetchDirectPlanQuote = async (payload: DirectPlanQuoteParams): Promise<DirectPlanQuoteResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('policies', String(payload.policies));
    formData.append('billing_cycle', payload.billing_cycle);
    formData.append('coupon_code', payload.coupon_code ? payload.coupon_code.trim() : '');

    const response = await api.post(endPointApi.PRICING.DIRECT_PLAN_QUOTE, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchDirectPlanQuote:', err);
    return err?.response?.data || null;
  }
};

/**
 * Mutation hook to fetch plan quote with FormData (policies, billing_cycle, coupon_code)
 */
export const useDirectPlanQuote = () => {
  return useMutation({
    mutationFn: async (payload: DirectPlanQuoteParams) => {
      const formData = new FormData();
      formData.append('policies', String(payload.policies));
      formData.append('billing_cycle', payload.billing_cycle);
      formData.append('coupon_code', payload.coupon_code || '');

      const response = await api.post(endPointApi.PRICING.DIRECT_PLAN_QUOTE, formData);
      return response?.data;
    },
  });
};

export interface DirectVerifyOtpParams {
  number: string;
  otp: string;
}

export interface DirectVerifyOtpResponse {
  status: number | string | boolean;
  message?: string;
  data?: {
    number: string;
    purchase_token: string;
    valid_minutes: number;
  };
}

export interface DirectPlanPurchaseParams {
  purchase_token: string;
  full_name: string;
  email: string;
  company_name: string;
  address: string;
  gst_number?: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  policies: number | string;
  billing_cycle: string;
  coupon_code?: string;
}

export interface DirectPlanPurchaseResponse {
  status: number | string | boolean;
  message?: string;
  data?: any;
  redirect_url?: string;
  url?: string;
  payment_url?: string;
  [key: string]: any;
}

/**
 * Send sign up OTP for mobile verification
 */
export const fetchSendSignUpOtp = async (number: string) => {
  try {
    const formData = new FormData();
    formData.append('number', number.trim());

    const response = await api.post(endPointApi.AUTH.SEND_SIGN_UP_OTP, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchSendSignUpOtp:', err);
    return err?.response?.data || null;
  }
};

/**
 * Direct async function to verify OTP and obtain purchase_token
 */
export const fetchDirectVerifyOtp = async (payload: DirectVerifyOtpParams): Promise<DirectVerifyOtpResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('number', payload.number.trim());
    formData.append('otp', payload.otp.trim());

    const response = await api.post(endPointApi.PRICING.DIRECT_VERIFY_OTP, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchDirectVerifyOtp:', err);
    return err?.response?.data || null;
  }
};

/**
 * Direct async function to purchase plan
 */
export const fetchDirectPlanPurchase = async (payload: DirectPlanPurchaseParams): Promise<DirectPlanPurchaseResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('purchase_token', payload.purchase_token);
    formData.append('full_name', payload.full_name);
    formData.append('email', payload.email);
    formData.append('company_name', payload.company_name);
    formData.append('address', payload.address);
    formData.append('gst_number', payload.gst_number || '');
    formData.append('pincode', payload.pincode);
    formData.append('state', payload.state);
    formData.append('city', payload.city);
    formData.append('country', payload.country || 'India');
    formData.append('policies', String(payload.policies));
    formData.append('billing_cycle', payload.billing_cycle);
    formData.append('coupon_code', payload.coupon_code || '');

    const response = await api.post(endPointApi.PRICING.DIRECT_PLAN_PURCHASE, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchDirectPlanPurchase:', err);
    return err?.response?.data || null;
  }
};

export interface GstTaxpayerAddress {
  bnm?: string;
  loc?: string;
  st?: string;
  bno?: string;
  dst?: string;
  locality?: string;
  pncd?: string;
  landMark?: string;
  stcd?: string;
  flno?: string;
}

export interface GstTaxpayerInfo {
  lgnm?: string;
  legalName?: string;
  legal_name?: string;
  tradeNam?: string;
  tradeName?: string;
  trade_name?: string;
  company_name?: string;
  companyName?: string;
  email?: string;
  gstin?: string;
  panNo?: string;
  pradr?: {
    addr?: GstTaxpayerAddress;
    ntr?: string;
  };
  addr?: GstTaxpayerAddress;
}

export interface GstVerifyResponse {
  status: number | string | boolean;
  message?: string;
  data?: {
    error?: boolean;
    message?: string;
    email?: string;
    taxpayerInfo?: GstTaxpayerInfo;
  };
}

/**
 * Verify GST number and obtain taxpayer info
 */
export const fetchGstVerify = async (gstNumber: string): Promise<GstVerifyResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('gst_number', gstNumber.trim().toUpperCase());

    const response = await api.post(endPointApi.PRICING.GST_VERIFY, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchGstVerify:', err);
    return err?.response?.data || (err?.message ? { status: false, message: err.message, data: { error: true, message: err.message } } : null);
  }
};

/**
 * Verify GST number via direct_gst_verify / gst_verify and obtain taxpayer info
 */
export const fetchDirectGstVerify = async (gstNumber: string): Promise<GstVerifyResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('gst_number', gstNumber.trim().toUpperCase());

    const response = await api.post(endPointApi.PRICING.GST_VERIFY, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchDirectGstVerify:', err);
    return (
      err?.response?.data || {
        status: false,
        message: err?.response?.data?.message || err?.message || 'Error verifying GST number',
        data: { error: true, message: err?.response?.data?.message || err?.message || 'Verification failed' },
      }
    );
  }
};

export interface PolicyPlanBillDetails {
  full_name?: string;
  company_name?: string;
  email?: string;
  number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  nationality?: string;
  gst_number?: string;
}

export interface PolicyPlanInfoData {
  min_policies: number;
  max_policies: number;
  gst_percentage: number;
  bill_details?: PolicyPlanBillDetails;
  tiers: PlanTier[];
  cycles: BillingCycle[];
  is_first_purchase?: boolean;
  first_purchase_free_ai_credits?: string;
  min_policies_for_renew?: number;
  can_purchase?: number | boolean;
}

export interface BillDetailsUpdatePayload {
  full_name: string;
  company_name: string;
  email: string;
  address: string;
  pincode: string;
  nationality?: string;
  state: string;
  city: string;
  gst_number?: string;
  number?: string;
}

/**
 * Update billing details profile via bill_details_update_profile API
 */
export const fetchBillDetailsUpdateProfile = async (payload: BillDetailsUpdatePayload) => {
  try {
    const formData = new FormData();
    formData.append('full_name', payload.full_name.trim());
    formData.append('company_name', payload.company_name.trim());
    formData.append('email', payload.email.trim());
    formData.append('address', payload.address.trim());
    formData.append('pincode', payload.pincode.trim());
    formData.append('nationality', payload.nationality?.trim() || 'India');
    formData.append('state', payload.state.trim());
    formData.append('city', payload.city.trim());
    if (payload.gst_number !== undefined) {
      formData.append('gst_number', payload.gst_number.trim().toUpperCase());
    }
    if (payload.number) {
      formData.append('number', payload.number.trim());
    }

    const response = await api.post(endPointApi.PRICING.BILL_DETAILS_UPDATE_PROFILE, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchBillDetailsUpdateProfile:', err);
    return err?.response?.data || (err?.message ? { status: false, message: err.message } : null);
  }
};

/**
 * Hook to fetch authenticated policy plan info for subscription upgrade/renew
 */
export const usePolicyPlanInfo = (enabled: boolean = true) => {
  return useQuery<PolicyPlanInfoData | null>({
    queryKey: ['policyPlanInfo'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.PRICING.POLICY_PLAN_INFO);
        const resData = response?.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === true)) {
          return resData?.data || null;
        }
        return resData?.data || null;
      } catch (err: any) {
        console.error('Error fetching policy plan info:', err);
        return null;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export interface PolicyPlanQuoteParams {
  policies: number;
  billing_cycle: string;
  coupon_code?: string;
}

/**
 * Fetch authenticated policy plan quote with FormData (policies, billing_cycle, coupon_code)
 */
export const fetchPolicyPlanQuote = async (payload: PolicyPlanQuoteParams): Promise<DirectPlanQuoteResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('policies', String(payload.policies));
    formData.append('billing_cycle', payload.billing_cycle);
    formData.append('coupon_code', payload.coupon_code ? payload.coupon_code.trim() : '');

    const response = await api.post(endPointApi.PRICING.POLICY_PLAN_QUOTE, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchPolicyPlanQuote:', err);
    return err?.response?.data || (err?.message ? { status: false, message: err.message } : null);
  }
};

export interface PolicyPlanPurchaseParams {
  policies: number;
  billing_cycle: string;
  coupon_code?: string;
  full_name?: string;
  email?: string;
  company_name?: string;
  address?: string;
  gst_number?: string;
  number?: string;
}

/**
 * Fetch authenticated policy plan purchase with FormData (policies, billing_cycle, coupon_code, optional user details)
 * Returns redirect_url on success
 */
export const fetchPolicyPlanPurchase = async (payload: PolicyPlanPurchaseParams) => {
  try {
    const formData = new FormData();
    formData.append('policies', String(payload.policies));
    formData.append('billing_cycle', payload.billing_cycle);
    formData.append('coupon_code', payload.coupon_code ? payload.coupon_code.trim() : '');
    if (payload.full_name) formData.append('full_name', payload.full_name.trim());
    if (payload.email) formData.append('email', payload.email.trim());
    if (payload.company_name) formData.append('company_name', payload.company_name.trim());
    if (payload.address) formData.append('address', payload.address.trim());
    if (payload.gst_number) formData.append('gst_number', payload.gst_number.trim());
    if (payload.number) formData.append('number', payload.number.trim());

    const response = await api.post(endPointApi.PRICING.POLICY_PLAN_PURCHASE, formData);
    return response?.data || null;
  } catch (err: any) {
    console.error('Error in fetchPolicyPlanPurchase:', err);
    return err?.response?.data || (err?.message ? { status: false, message: err.message } : null);
  }
};

export interface InvoiceItem {
  invoice_no: string;
  type: string;
  type_name: string;
  amount: number | string;
  created_at: string;
  pdf_link?: string;
  invoice_url?: string;
  download_url?: string;
  [key: string]: any;
}

export interface InvoiceListResponse {
  status: number | string | boolean;
  message?: string;
  data: InvoiceItem[];
  pagination_arr?: {
    page: number;
    limit: number;
    total_records: number;
  };
}

/**
 * Hook to fetch invoice list (All History)
 */
export const useFetchInvoiceList = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery<InvoiceListResponse | null>({
    queryKey: ['invoiceList', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', page.toString());
        formData.append('limit', limit.toString());
        if (search) {
          formData.append('search', search);
        }

        const response = await api.post(endPointApi.AUTH.INVOICE_LIST, formData);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === true || resData.status === 'success')) {
          return {
            status: resData.status,
            message: resData.message,
            data: Array.isArray(resData.data) ? resData.data : [],
            pagination_arr: resData.pagination_arr || {
              page: page,
              limit: limit,
              total_records: Array.isArray(resData.data) ? resData.data.length : 0,
            },
          };
        } else {
          return {
            status: resData?.status || 400,
            message: resData?.message || 'Failed to fetch invoices',
            data: [],
            pagination_arr: { page: 1, limit: limit, total_records: 0 },
          };
        }
      } catch (err: any) {
        console.error('Error fetching invoice list:', err);
        return null;
      }
    },
  });
};

export interface PolicyAddonItem {
  addon_id: number;
  invoice_no: string;
  addon_policies: number;
  tier_name: string;
  rate_per_policy: number;
  starting_date: string;
  ending_date: string;
  days_remaining: number;
  amount: number;
  gst_amount: number;
  final_amount: number;
  status: number;
  status_name: string;
  created_at: string;
  [key: string]: any;
}

export interface PolicyAddonHistoryResponse {
  status: number | string | boolean;
  message?: string;
  data: PolicyAddonItem[];
  pagination_arr?: {
    page: number;
    limit: number;
    total_records: number;
  };
}

export interface PolicyAddonPurchaseData {
  addon_policies: number;
  new_total_limit: number;
  tier: string;
  valid_till: string;
  days_remaining: number;
  total_price: number;
  gst_amount: number;
  final_amount: number;
  redirect_url: string;
  [key: string]: any;
}

export interface PolicyAddonPurchaseResponse {
  status: number | string | boolean;
  message?: string;
  data: PolicyAddonPurchaseData;
}

/**
 * Hook to fetch policy addon history
 */
export const useFetchPolicyAddonHistory = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery<PolicyAddonHistoryResponse | null>({
    queryKey: ['policyAddonHistory', page, limit, search],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('page', page.toString());
        formData.append('limit', limit.toString());
        if (search) {
          formData.append('search', search);
        }

        const response = await api.post(endPointApi.AUTH.POLICY_ADDON_HISTORY, formData);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === true || resData.status === 'success')) {
          return {
            status: resData.status,
            message: resData.message,
            data: Array.isArray(resData.data) ? resData.data : [],
            pagination_arr: resData.pagination_arr || {
              page: page,
              limit: limit,
              total_records: Array.isArray(resData.data) ? resData.data.length : 0,
            },
          };
        } else {
          return {
            status: resData?.status || 400,
            message: resData?.message || 'Failed to fetch policy addon history',
            data: [],
            pagination_arr: { page: 1, limit: limit, total_records: 0 },
          };
        }
      } catch (err: any) {
        console.error('Error fetching policy addon history:', err);
        return null;
      }
    },
  });
};

/**
 * Hook to purchase policy addon with addon_policies via FormData
 */
export const usePurchasePolicyAddon = () => {
  return useMutation<PolicyAddonPurchaseResponse | null, any, { addon_policies: number }>({
    mutationFn: async (payload: { addon_policies: number }) => {
      const formData = new FormData();
      formData.append('addon_policies', payload.addon_policies.toString());

      const response = await api.post(endPointApi.AUTH.POLICY_ADDON_PURCHASE, formData);
      return response.data;
    },
  });
};

export interface PolicyAddonQuoteData {
  subscription_id?: number;
  addon_policies: number;
  plan_limit?: number;
  existing_addon?: number;
  new_total_limit?: number;
  tier?: string;
  rate_per_policy?: number;
  billing_cycle?: any;
  cycle_months?: number;
  starting_date?: string;
  ending_date?: string;
  days_total?: number;
  days_remaining?: number;
  prorated?: boolean;
  full_cycle_price?: number;
  plan_name?: string;
  total_price?: number;
  coupon_per?: number;
  coupon_amount?: number;
  price_after_discount?: number;
  gst_percentage?: number;
  gst_amount?: number;
  final_amount?: number;
  [key: string]: any;
}

export interface PolicyAddonQuoteResponse {
  status: number | string | boolean;
  message?: string;
  data: PolicyAddonQuoteData;
}

/**
 * Hook to fetch policy addon quote with addon_policies via FormData
 */
export const useGetPolicyAddonQuote = () => {
  return useMutation<PolicyAddonQuoteResponse | null, any, { addon_policies: number }>({
    mutationFn: async (payload: { addon_policies: number }) => {
      const formData = new FormData();
      formData.append('addon_policies', payload.addon_policies.toString());

      const response = await api.post(endPointApi.AUTH.POLICY_ADDON_QUOTE, formData);
      return response?.data;
    },
  });
};



