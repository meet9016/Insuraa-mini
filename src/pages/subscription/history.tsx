import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import {
  Sparkles,
  Receipt,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown,
  Tag,
  Percent,
  FileCheck,
  Copy,
  Check,
  Calculator,
  ExternalLink,
  Plus,
  Coins,
  Gift,
  Monitor,
  X,
  Zap,
  Activity,
  ArrowUpRight,
  CalendarDays,
  Layers,
  CreditCard
} from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import { useRouter } from 'next/router';
import {
  useFetchAiCreditHistory,
  useFetchAiCredits,
  useGetAiCreditQuote,
  usePurchaseAiCredit
} from '@/hooks/useAiCreditApi';
import {
  useFetchInvoiceList,
  InvoiceItem,
  useFetchPolicyAddonHistory,
  usePurchasePolicyAddon,
  useGetPolicyAddonQuote,
  PolicyAddonItem,
  PolicyAddonQuoteData
} from '@/hooks/usePricingApi';

const formatPrice = (val: any) => {
  if (val === null || val === undefined) return '0.00';
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return num.toFixed(2);
};

export interface SubscriptionItem {
  subscription_id: number;
  invoice_no?: string;
  plan_id?: number | string;
  plan_name: string;
  ai_limit?: number | string;
  policy_limit?: number | string;
  addon_policies?: number | string;
  total_policy_limit?: number | string;
  tier_name?: string;
  billing_cycle?: string;
  rate_per_policy?: number | string;
  starting_date?: string;
  ending_date?: string;
  days_left?: number;
  status?: number;
  status_name?: string;
  amount?: string | number;
  coupon_code?: string;
  coupon_per?: number;
  discount_amount?: number | string;
  gst_percentage?: number;
  gst_amount?: number | string;
  wallet_amount_used?: string | number;
  final_amount?: string | number;
  razorpay_payment_id?: string;
  pdf_link?: string;
  created_at?: string;
  [key: string]: any;
}

// ============================================================================
// MODAL: BUY AI CREDITS (Quote Calculator)
// ============================================================================
interface BuyAiCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function BuyAiCreditsModal({ isOpen, onClose }: BuyAiCreditsModalProps) {
  const [creditInput, setCreditInput] = useState<number | ''>('');
  const [quoteResult, setQuoteResult] = useState<any>(null);
  const { mutate: getCreditQuote, isPending: isGettingQuote } = useGetAiCreditQuote();
  const { mutate: purchaseCredit, isPending: isPurchasing } = usePurchaseAiCredit();

  useEffect(() => {
    if (!isOpen) {
      setCreditInput('');
      setQuoteResult(null);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGetQuote = () => {
    if (!creditInput || Number(creditInput) <= 0) {
      toast.error('Please enter a valid credit amount');
      return;
    }
    setQuoteResult(null);
    getCreditQuote(
      { credits: Number(creditInput) },
      {
        onSuccess: (res: any) => {
          if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
            toast.error(res?.message || 'Failed to fetch quote');
            return;
          }
          if (res && res.data && Object.keys(res.data).length > 0) {
            setQuoteResult(res.data);
          } else if (res && res.credits) {
            setQuoteResult(res);
          } else {
            toast.error(res?.message || 'Invalid quote response');
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch quote');
        }
      }
    );
  };

  const handlePay = () => {
    if (!quoteResult?.credits) return;
    purchaseCredit(
      { credits: quoteResult.credits },
      {
        onSuccess: (res: any) => {
          if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
            toast.error(res?.message || 'Failed to initiate payment');
            return;
          }
          if (res && res.data && res.data.redirect_url) {
            window.location.href = res.data.redirect_url;
          } else {
            toast.error(res?.message || 'No redirect URL found in response');
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to initiate payment');
        }
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Insuraa Logo Color (#2F439D) */}
        <div className="bg-gradient-to-r from-[#2F439D] to-[#24357D] text-white p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2BBF8C]/15 rounded-full blur-2xl pointer-events-none" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#2BBF8C]">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Buy Ai credits</h3>
              <p className="text-blue-100/80 text-xs font-normal">Instant document scanning quota</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Number of credits</label>
            <div className="relative">
              <Calculator size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                value={creditInput}
                onChange={(e) => {
                  setCreditInput(e.target.value ? Number(e.target.value) : '');
                  setQuoteResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGetQuote();
                  }
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] focus:bg-white transition-all"
                placeholder="Enter credits (e.g. 500)"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGetQuote}
            disabled={isGettingQuote || !creditInput || Number(creditInput) <= 0}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#2F439D] font-medium rounded-xl text-xs border border-indigo-200 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {isGettingQuote ? 'Calculating...' : 'Calculate quote'}
          </button>

          {/* Dynamic Breakdown */}
          {quoteResult && quoteResult.final_amount !== undefined && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900 text-xs border-b border-slate-200 pb-1.5 flex justify-between items-center">
                  <span>Price calculation</span>
                  <span className="text-[11px] font-medium text-[#2F439D] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Ai scan quota
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-normal">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Credits requested:</span>
                    <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {quoteResult.credits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Rate per credit:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.price_per_credit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.total_price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Gst ({quoteResult.gst_percentage ?? 18}%):</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.gst_amount)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs text-slate-600 font-medium">Final amount:</span>
                  <span className="text-base font-semibold text-[#2F439D]">₹{formatPrice(quoteResult.final_amount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={isPurchasing}
                className="w-full py-2.5 rounded-xl text-white font-medium text-xs bg-[#2F439D] hover:bg-[#24357D] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPurchasing ? 'Processing...' : <>Proceed to pay — ₹{formatPrice(quoteResult.final_amount)} <ExternalLink size={13} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL: ADD POLICIES (Quote Calculator)
// ============================================================================
interface AddPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddPoliciesModal({ isOpen, onClose }: AddPoliciesModalProps) {
  const [policiesInput, setPoliciesInput] = useState<number | ''>('');
  const [quoteResult, setQuoteResult] = useState<PolicyAddonQuoteData | any>(null);
  const { mutate: getPolicyQuote, isPending: isGettingQuote } = useGetPolicyAddonQuote();
  const { mutate: purchasePolicyAddon, isPending: isPurchasing } = usePurchasePolicyAddon();

  useEffect(() => {
    if (!isOpen) {
      setPoliciesInput('');
      setQuoteResult(null);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGetQuote = () => {
    if (!policiesInput || Number(policiesInput) <= 0) {
      toast.error('Please enter a valid number of policies');
      return;
    }
    setQuoteResult(null);
    getPolicyQuote(
      { addon_policies: Number(policiesInput) },
      {
        onSuccess: (res: any) => {
          if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
            toast.error(res?.message || 'Failed to fetch policy quote');
            return;
          }
          if (res && res.data && Object.keys(res.data).length > 0) {
            setQuoteResult(res.data);
          } else if (res && res.addon_policies) {
            setQuoteResult(res);
          } else {
            toast.error(res?.message || 'Invalid quote response');
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch policy quote');
        }
      }
    );
  };

  const handlePay = () => {
    const policiesToBuy = quoteResult?.addon_policies || Number(policiesInput);
    if (!policiesToBuy || policiesToBuy <= 0) {
      toast.error('Please enter a valid number of policies');
      return;
    }

    purchasePolicyAddon(
      { addon_policies: Number(policiesToBuy) },
      {
        onSuccess: (res: any) => {
          if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
            toast.error(res?.message || 'Failed to initiate policy purchase');
            return;
          }
          const redirectUrl = res?.data?.redirect_url || res?.redirect_url;
          if (redirectUrl) {
            toast.success(res?.message || 'Redirecting to payment...');
            window.location.href = redirectUrl;
          } else {
            toast.error(res?.message || 'No redirect URL found in response');
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to initiate policy purchase');
        }
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Insuraa Logo Blue */}
        <div className="bg-gradient-to-r from-[#2F439D] to-[#24357D] text-white p-5 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2BBF8C]/15 rounded-full blur-2xl pointer-events-none" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#2BBF8C]">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Add policies</h3>
              <p className="text-blue-100/80 text-xs font-normal">Extend policy quota in your current cycle</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Number of additional policies</label>
            <div className="relative">
              <Calculator size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                value={policiesInput}
                onChange={(e) => {
                  setPoliciesInput(e.target.value ? Number(e.target.value) : '');
                  setQuoteResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGetQuote();
                  }
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2BBF8C]/30 focus:border-[#2BBF8C] focus:bg-white transition-all"
                placeholder="Enter policies (e.g. 100)"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGetQuote}
            disabled={isGettingQuote || !policiesInput || Number(policiesInput) <= 0}
            className="w-full py-2.5 bg-[#2BBF8C]/10 hover:bg-[#2BBF8C]/20 text-[#197a56] font-medium rounded-xl text-xs border border-[#2BBF8C]/30 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {isGettingQuote ? 'Calculating...' : 'Calculate quote'}
          </button>

          {/* Dynamic Breakdown */}
          {quoteResult && quoteResult.final_amount !== undefined && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900 text-xs border-b border-slate-200 pb-1.5 flex justify-between items-center">
                  <span>Policy price breakdown</span>
                  {quoteResult.tier && (
                    <span className="text-[11px] font-medium text-[#197a56] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {quoteResult.tier} tier
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs font-normal">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Additional policies:</span>
                    <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {quoteResult.addon_policies ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Rate per policy:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.rate_per_policy)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Full cycle price:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.full_cycle_price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total days:</span>
                    <span className="font-medium text-slate-900">{quoteResult.days_total ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Remaining days:</span>
                    <span className="font-medium text-slate-900">{quoteResult.days_remaining ?? 0}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs font-normal">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">Prorated amount:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.total_price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Discount:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.coupon_amount ?? 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Price after discount:</span>
                    <span className="font-medium text-slate-900">
                      ₹{formatPrice(quoteResult.price_after_discount ?? quoteResult.total_price)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs font-normal">
                  <div className="font-medium text-slate-800">Gst ({quoteResult.gst_percentage ?? 18}%):</div>
                  <div className="flex justify-between items-center pl-2 text-slate-600">
                    <span>Gst amount:</span>
                    <span className="font-medium text-slate-900">₹{formatPrice(quoteResult.gst_amount)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs text-slate-600 font-medium">Final amount:</span>
                  <span className="text-base font-semibold text-[#197a56]">₹{formatPrice(quoteResult.final_amount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={isPurchasing}
                className="w-full py-2.5 rounded-xl text-white font-medium text-xs bg-[#2BBF8C] hover:bg-[#24a87b] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPurchasing ? 'Processing...' : <>Proceed to pay — ₹{formatPrice(quoteResult.final_amount)} <ExternalLink size={13} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT: SUBSCRIPTION DASHBOARD
// ============================================================================
export default function SubscriptionHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (router.query.tab === 'ai') {
      setActiveTab('ai');
    } else if (router.query.tab === 'subscription') {
      setActiveTab('subscription');
    } else if (router.query.tab === 'policy' || router.query.tab === 'policy_credit') {
      setActiveTab('policy');
    } else {
      setActiveTab('all');
    }
  }, [router.query]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearch('');
    setPage(1);
    router.replace(
      {
        pathname: router.pathname,
        query: tab === 'all' ? {} : { tab },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedInvoice(text);
    toast.success('Invoice number copied!');
    setTimeout(() => setCopiedInvoice(null), 2000);
  };

  // Popup & Expiry details
  const fetchPopupInfo = useCallback(async () => {
    try {
      const res = await api.post(endPointApi.AUTH.SUBSCRIPTION_POPUP);
      const rawData = res.data?.data ?? res.data?.result ?? res.data;
      const popupData = rawData?.data ?? rawData;

      if (popupData) {
        setPopupInfo(popupData);
        const expired =
          popupData.is_expired === 1 ||
          popupData.is_expired === '1' ||
          popupData.is_expired === true ||
          popupData.is_expired === 'true';

        const showPopup =
          popupData.show_popup === true ||
          popupData.show_popup === 'true' ||
          popupData.show_popup === 1 ||
          popupData.show_popup === '1';

        if (expired) {
          setIsExpired(true);
          setIsUpgradeModalOpen(true);
        } else if (showPopup) {
          setIsExpired(false);
          setIsUpgradeModalOpen(true);
        } else {
          setIsExpired(false);
          setIsUpgradeModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error fetching subscription popup info:', err);
    }
  }, []);

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('page', String(page));
      formData.append('search', search);
      formData.append('limit', String(limit));

      const response = await api.post(endPointApi.AUTH.SUBSCRIPTION_LIST, formData);
      const resData = response.data;

      const list: SubscriptionItem[] = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
          ? resData
          : [];

      setSubscriptions(list);

      if (resData?.pagination_arr?.total_records !== undefined) {
        setTotalRecords(Number(resData.pagination_arr.total_records));
      } else {
        setTotalRecords(list.length);
      }
    } catch (error: any) {
      console.error('Error fetching subscription list:', error);
      toast.error('Failed to fetch subscription records');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, limit]);

  useEffect(() => {
    fetchSubscriptions();
    fetchPopupInfo();
  }, [fetchSubscriptions, fetchPopupInfo]);

  // Invoice Query for Tab 1
  const {
    data: invoiceRes,
    isLoading: isInvoiceLoading,
    refetch: refetchInvoices
  } = useFetchInvoiceList(page, limit, search);
  const invoiceList: InvoiceItem[] = invoiceRes?.data || [];
  const totalInvoices = invoiceRes?.pagination_arr?.total_records ?? invoiceList.length ?? 0;

  // AI Credit History Query for Tab 3 & Sidebar
  const {
    data: aiHistoryRes,
    isLoading: isAiHistoryLoading,
    refetch: refetchAiHistory
  } = useFetchAiCreditHistory(page, limit, search);
  const aiHistoryList = aiHistoryRes?.data || [];
  const totalAiRecords = aiHistoryRes?.pagination_arr?.total_records ?? aiHistoryList.length ?? 0;

  // AI Credits balance
  const { data: aiCreditsBalance } = useFetchAiCredits();

  // Policy Addon History Query for Tab 4
  const {
    data: policyHistoryRes,
    isLoading: isPolicyHistoryLoading,
    refetch: refetchPolicyHistory
  } = useFetchPolicyAddonHistory(page, limit, search);
  const policyHistoryList: PolicyAddonItem[] = policyHistoryRes?.data || [];
  const totalPolicyRecords = policyHistoryRes?.pagination_arr?.total_records ?? policyHistoryList.length ?? 0;

  // Active Subscription
  const activeSubscription =
    subscriptions.find((s) => s.status === 1 || String(s.status_name).toLowerCase() === 'active') ||
    subscriptions[0];

  const displayPlanName = activeSubscription?.plan_name || popupInfo?.plan_name || '—';
  const displayDaysLeft = activeSubscription?.days_left !== undefined && activeSubscription?.days_left !== null
    ? activeSubscription.days_left
    : (popupInfo?.days_left ?? 0);
  const activeInvoiceNo = activeSubscription?.invoice_no || '—';
  const activeStartDate = activeSubscription?.starting_date || '—';
  const activeEndDate = activeSubscription?.ending_date || '—';

  const totalPolicies = Number(activeSubscription?.total_policy_limit ?? activeSubscription?.policy_limit ?? 0);
  const aiCredits = Number(aiCreditsBalance?.credits ?? activeSubscription?.ai_limit ?? 0);

  const handleSyncAll = () => {
    fetchSubscriptions();
    fetchPopupInfo();
    refetchInvoices();
    refetchAiHistory();
    refetchPolicyHistory();
    toast.success('Subscription data synced!');
  };

  const getInvoiceTypeBadge = (type?: string) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('ai')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles size={11} className="text-purple-500" />
          <span>Ai credits</span>
        </span>
      );
    }
    if (t.includes('policy') || t.includes('addon') || t.includes('extra')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#2F439D] border border-blue-200">
          <Shield size={11} className="text-[#2F439D]" />
          <span>Extra policies</span>
        </span>
      );
    }
    if (t.includes('trial') || t.includes('free')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Crown size={11} className="text-amber-500" />
          <span>Free trial</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#2F439D] border border-indigo-200">
        <Zap size={11} className="text-[#2F439D]" />
        <span>Subscription</span>
      </span>
    );
  };

  const currentTotal =
    activeTab === 'all'
      ? totalInvoices
      : activeTab === 'subscription'
        ? totalRecords
        : activeTab === 'ai'
          ? totalAiRecords
          : totalPolicyRecords;
  const totalPages = Math.ceil(currentTotal / limit) || 1;

  return (
    <>
      <Head>
        <title>Subscription &amp; Licensing | Insuraa</title>
      </Head>

      {/* Spacious Full-width Container with Proper Margins (Max-w 1680px for Elegant Viewing) */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-5 pb-12 pt-2">
        {/* ================================================================= */}
        {/* 1. TOP HEADER BANNER (Insuraa Logo Colors: #2F439D & #2BBF8C)     */}
        {/* ================================================================= */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#2F439D] via-[#24357D] to-[#1A265E] text-white p-6 sm:p-7 shadow-lg border border-indigo-900/30 overflow-hidden">
          {/* Subtle Ambient Logo Color Glows */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#2BBF8C]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Title & Badge (Natural Font Weight, Clean Sentence Casing) */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-medium backdrop-blur-xs">
                <Crown size={12} className="text-[#2BBF8C]" />
                <span>Billing &amp; membership</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                Subscription &amp; licensing
              </h1>
              <p className="text-blue-100/85 text-xs sm:text-sm font-normal max-w-xl">
                Manage agency policy limits, Ai scanning credits, and download tax invoices.
              </p>
            </div>

            {/* Actions & Plan Capsule */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Sync Button */}
              <button
                type="button"
                onClick={handleSyncAll}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-medium px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Sync all data"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>Sync</span>
              </button>

              {/* Renew / Upgrade Button (Insuraa Mint Green Accent #2BBF8C) */}
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-[#2BBF8C] hover:bg-[#24a87b] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Crown size={14} className="fill-current" />
                <span>Renew / upgrade plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. 4 TOP METRIC CARDS (Compact, Sleek Height)                    */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Active Plan */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] font-medium text-slate-500 block">Active plan</span>
                <div className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5 truncate">{displayPlanName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1 font-normal">
                  <span>{activeInvoiceNo}</span>
                  <span>•</span>
                  <span>Started {activeStartDate}</span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Crown size={14} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal truncate">{activeSubscription?.tier_name || 'Free trial'}</span>
            </div>
          </div>

          {/* Card 2: AI Credits */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-full pr-2 min-w-0">
                <span className="text-[11px] font-medium text-slate-500 block">Ai credits</span>
                <div className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5 truncate">{aiCredits.toLocaleString()} credits</div>
                {/* Progress Bar with Logo Blue */}
                <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#2F439D] h-full rounded-full w-2/5" />
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-[#2F439D] flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2F439D] hover:bg-[#24357D] text-white text-[12px] font-medium rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Plus size={11} />
                <span>Buy Ai credits</span>
              </button>
            </div>
          </div>

          {/* Card 3: Policy Credits */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-full pr-2 min-w-0">
                <span className="text-[11px] font-medium text-slate-500 block">Policy credits</span>
                <div className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5 truncate">{totalPolicies.toLocaleString()} policies</div>
                {/* Progress Bar with Logo Mint Green */}
                <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#2BBF8C] h-full rounded-full w-3/5" />
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-[#197a56] flex items-center justify-center shrink-0">
                <Shield size={14} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center">
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-[#197a56] border border-[#2BBF8C] text-[12px] font-medium rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Plus size={11} />
                <span>Add policies</span>
              </button>
            </div>
          </div>

          {/* Card 4: Invoices (100% Dynamic from invoice_list API) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] font-medium text-slate-500 block">Invoices</span>
                <div className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5 truncate">{totalInvoices} total</div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal truncate">All billing history &amp; tax invoices</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Receipt size={14} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-normal">
              <span className="truncate">{totalInvoices > 0 ? `${totalInvoices} invoices recorded` : 'No invoices recorded'}</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. TWO-COLUMN WORKSPACE: LEFT LIST (8 cols) & RIGHT SIDEBAR (4)   */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* --------------------------------------------------------------- */}
          {/* LEFT: MAIN WORKSPACE WITH 4 TABS & ALL ORIGINAL CONTENT        */}
          {/* --------------------------------------------------------------- */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col">
            {/* Header: Title, Search & Navigation Tabs with Round Record Counts */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 border-b border-slate-100 pb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {activeTab === 'all'
                    ? 'Recent invoices'
                    : activeTab === 'subscription'
                      ? 'Subscription history'
                      : activeTab === 'ai'
                        ? 'Ai credit ledger'
                        : 'Policy credit history'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  {activeTab === 'all'
                    ? 'Official tax invoices & payment records'
                    : activeTab === 'subscription'
                      ? 'Plan history, policy limits, and purchase dates'
                      : activeTab === 'ai'
                        ? 'Ai scan debits & credit top-up history'
                        : 'Purchased addon policies & validity'}
                </p>
              </div>

              {/* Right side controls: Search input & Tab pills with Round Count Badges */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Search Bar moved UP */}
                <div className="relative w-full sm:w-52 md:w-60 shrink-0">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white text-xs font-normal text-slate-900 pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F439D] focus:ring-1 focus:ring-[#2F439D]/20 transition-all placeholder-slate-400"
                  />
                </div>

                {/* Navigation Tabs (Insuraa Logo Navy & White Styling with Round Record Counts) */}
                <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTabChange('all')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === 'all'
                      ? 'bg-[#2F439D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <span>All invoices</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-colors ${activeTab === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                        }`}
                    >
                      {totalInvoices}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('subscription')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === 'subscription'
                      ? 'bg-[#2F439D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <span>Subscriptions</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-colors ${activeTab === 'subscription'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                        }`}
                    >
                      {totalRecords}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('ai')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === 'ai'
                      ? 'bg-[#2F439D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <span>Ai credits</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-colors ${activeTab === 'ai'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                        }`}
                    >
                      {totalAiRecords}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('policy')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === 'policy'
                      ? 'bg-[#2F439D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <span>Policy credits</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-colors ${activeTab === 'policy'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                        }`}
                    >
                      {totalPolicyRecords}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content List for Active Tab */}
            <div className="space-y-3 pt-1 min-h-[320px]">
              {/* TAB 1: ALL INVOICES */}
              {activeTab === 'all' && (
                <>
                  {isInvoiceLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#2F439D]" />
                      <span className="text-xs font-medium text-slate-600">Loading invoices...</span>
                    </div>
                  ) : invoiceList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#2F439D] flex items-center justify-center mb-2 shadow-inner">
                        <Receipt size={22} />
                      </div>
                      <span className="font-medium text-slate-800 text-sm">No invoices found</span>
                      <span className="text-xs text-slate-400 mt-0.5 font-normal">
                        {search ? 'Try adjusting your search criteria.' : 'Your invoice records will appear here.'}
                      </span>
                    </div>
                  ) : (
                    invoiceList.map((item, idx) => {
                      const downloadLink = item.pdf_link || item.invoice_url || item.download_link;
                      const isFirst = idx === 0;

                      return (
                        <div
                          key={item.invoice_no || idx}
                          className={`rounded-xl p-3.5 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${isFirst
                            ? 'border border-indigo-200 bg-indigo-50/20 shadow-2xs'
                            : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                            }`}
                        >
                          {/* Left: Invoice # + Badge + Date */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleCopy(item.invoice_no)}
                                className="font-semibold text-slate-900 text-sm hover:text-[#2F439D] transition-colors cursor-pointer inline-flex items-center gap-1 group font-mono"
                                title="Click to copy invoice number"
                              >
                                <span>{item.invoice_no}</span>
                                {copiedInvoice === item.invoice_no ? (
                                  <Check size={13} className="text-emerald-600" />
                                ) : (
                                  <Copy size={11} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                              {getInvoiceTypeBadge(item.type_name || item.type)}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 font-normal">
                              <Calendar size={11} />
                              <span>{item.created_at || '—'}</span>
                            </div>
                          </div>

                          {/* Right: Amount + Dynamic Status badge + PDF button (Zero Static Badges) */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="font-semibold text-slate-900 text-sm sm:text-base">₹{item.amount ?? 0}</span>

                            {(item.status_name || item.status !== undefined) && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.status_name || (item.status === 1 ? 'Paid' : String(item.status))}
                              </span>
                            )}

                            {downloadLink && (
                              <a
                                href={downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-slate-300 hover:border-[#2F439D] bg-white hover:bg-indigo-50/40 text-slate-800 hover:text-[#2F439D] text-xs font-medium px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Download size={12} />
                                <span>Download invoice</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* TAB 2: SUBSCRIPTIONS (Showing All Original Attributes Cleanly) */}
              {activeTab === 'subscription' && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#2F439D]" />
                      <span className="text-xs font-medium text-slate-600">Loading subscriptions...</span>
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                        <Crown size={22} />
                      </div>
                      <span className="font-medium text-slate-800 text-sm">No subscriptions found</span>
                      <span className="text-xs text-slate-400 mt-0.5 font-normal">Your subscription plans will appear here.</span>
                    </div>
                  ) : (
                    subscriptions.map((item, idx) => {
                      const isActive = item.status === 1 || String(item.status_name).toLowerCase() === 'active';
                      const baseAmt = item.amount ?? '0';
                      const finalAmt = item.final_amount ?? item.amount ?? '0';

                      return (
                        <div
                          key={item.subscription_id || idx}
                          className="border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 transition-all shadow-2xs"
                        >
                          {/* Top Row: Plan Name, Tier, Cycle, Invoice No, Status, PDF */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-900 text-sm sm:text-base">{item.plan_name}</span>
                              {item.tier_name && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#2F439D] border border-indigo-200">
                                  {item.tier_name}
                                </span>
                              )}
                              {item.billing_cycle && (
                                <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                  {item.billing_cycle}
                                </span>
                              )}
                              {item.invoice_no && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.invoice_no)}
                                  className="text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                                  title="Copy invoice #"
                                >
                                  <span>Invoice: {item.invoice_no}</span>
                                  {copiedInvoice === item.invoice_no ? (
                                    <Check size={11} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={10} className="text-slate-400" />
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                              >
                                {isActive ? 'Active' : 'Expired'}
                              </span>

                              {item.pdf_link ? (
                                <a
                                  href={item.pdf_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="border border-slate-300 hover:border-[#2F439D] bg-white hover:bg-indigo-50/40 text-slate-800 text-xs font-medium px-3 py-1 rounded-lg transition-all shadow-2xs inline-flex items-center gap-1"
                                >
                                  <Download size={11} />
                                  <span>Download invoice</span>
                                </a>
                              ) : null}
                            </div>
                          </div>

                          {/* Attributes Grid: Preserving All Original Fields From User's Previous Screen */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs pt-1 border-t border-slate-100">
                            {/* 1. Policy Limit */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Policy limit</span>
                              <span className="font-semibold text-slate-800 flex items-center gap-1">
                                <Shield size={12} className="text-[#2F439D] shrink-0" />
                                {Number(item.total_policy_limit ?? item.policy_limit ?? 0).toLocaleString()}
                              </span>
                            </div>

                            {/* 2. AI Credits */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Ai credits</span>
                              <span className="font-semibold text-slate-800 flex items-center gap-1">
                                <Sparkles size={12} className="text-[#2BBF8C] shrink-0" />
                                {Number(item.ai_limit ?? 0).toLocaleString()}
                              </span>
                            </div>

                            {/* 3. Start Date */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Start date</span>
                              <span className="font-medium text-slate-800 flex items-center gap-1">
                                <Calendar size={12} className="text-indigo-500 shrink-0" />
                                {item.starting_date || '—'}
                              </span>
                            </div>

                            {/* 4. End Date */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">End date</span>
                              <span className="font-medium text-slate-800 flex items-center gap-1">
                                <CalendarDays size={12} className="text-indigo-500 shrink-0" />
                                {item.ending_date || '—'}
                              </span>
                            </div>

                            {/* 5. Days Left */}
                            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                              <span className="text-amber-900/80 block text-[11px] mb-0.5 font-medium">Days left</span>
                              <span className="font-semibold text-amber-950 flex items-center gap-1">
                                <Clock size={12} className="text-amber-600 shrink-0" />
                                {item.days_left ?? 0} days
                              </span>
                            </div>

                            {/* 6. GST Amount */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Gst ({item.gst_percentage ?? 0}%)</span>
                              <span className="font-medium text-slate-800 flex items-center gap-1">
                                <Percent size={12} className="text-blue-500 shrink-0" />
                                ₹{item.gst_amount ?? 0}
                              </span>
                            </div>
                          </div>

                          {/* Financial Footer: Base Amount, Wallet Used, Coupon, Payment ID, Final Amount */}
                          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-4 flex-wrap text-slate-600 font-normal">
                              <div>
                                <span className="text-slate-400">Base amount: </span>
                                <span className="font-medium text-slate-800">₹{baseAmt}</span>
                              </div>
                              {item.wallet_amount_used !== undefined && Number(item.wallet_amount_used) > 0 && (
                                <div>
                                  <span className="text-slate-400">Wallet used: </span>
                                  <span className="font-medium text-slate-800">₹{item.wallet_amount_used}</span>
                                </div>
                              )}
                              {item.discount_amount !== undefined && Number(item.discount_amount) > 0 && (
                                <div>
                                  <span className="text-slate-400">Coupon discount: </span>
                                  <span className="font-medium text-purple-700">₹{item.discount_amount}</span>
                                </div>
                              )}
                              {item.razorpay_payment_id && (
                                <div>
                                  <span className="text-slate-400">Payment ID: </span>
                                  <span className="font-mono text-slate-700">{item.razorpay_payment_id}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-slate-500 font-medium text-xs">Total paid:</span>
                              <span className="text-base font-semibold text-slate-900">
                                ₹{Number(finalAmt).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* TAB 3: AI CREDITS HISTORY (Showing All Original Attributes Cleanly) */}
              {activeTab === 'ai' && (
                <>
                  {isAiHistoryLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#2F439D]" />
                      <span className="text-xs font-medium text-slate-600">Loading Ai credit ledger...</span>
                    </div>
                  ) : aiHistoryList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                        <Sparkles size={22} />
                      </div>
                      <span className="font-medium text-slate-800 text-sm">No transactions found</span>
                      <span className="text-xs text-slate-400 mt-0.5 font-normal">Your Ai credit usage history will appear here.</span>
                    </div>
                  ) : (
                    aiHistoryList.map((item, idx) => {
                      const isAddition = item.type === 1;

                      return (
                        <div
                          key={item.id || idx}
                          className="border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40 rounded-xl p-3.5 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-900 text-sm">{item.title || 'Ai document scan'}</span>
                              {item.source && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                                  {item.source}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-normal">
                              {item.created_at || '—'} • Balance: {Number(item.balance_after || 0).toLocaleString()} credits
                            </div>
                            {item.note && (
                              <div className="text-xs text-slate-500 font-normal mt-0.5">
                                {item.note}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className={`font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-full ${isAddition ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {isAddition ? '+' : '-'}{Number(item.credits || 0).toLocaleString()} credits
                            </span>

                            <span className="font-semibold text-slate-900 text-sm">
                              {Number(item.amount || 0) === 0 ? (
                                <span className="text-emerald-600 font-medium">Free</span>
                              ) : (
                                `₹${Number(item.amount).toLocaleString()}`
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* TAB 4: POLICY CREDITS HISTORY (Preserving All Original Attributes) */}
              {activeTab === 'policy' && (
                <>
                  {isPolicyHistoryLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#2F439D]" />
                      <span className="text-xs font-medium text-slate-600">Loading policy addons...</span>
                    </div>
                  ) : policyHistoryList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                        <Shield size={22} />
                      </div>
                      <span className="font-medium text-slate-800 text-sm">No policy addons found</span>
                      <span className="text-xs text-slate-400 mt-0.5 font-normal">Purchased policy addon packages will appear here.</span>
                    </div>
                  ) : (
                    policyHistoryList.map((item, idx) => {
                      const isActive = item.status === 1 || String(item.status_name).toLowerCase() === 'active';

                      return (
                        <div
                          key={item.addon_id || item.invoice_no || idx}
                          className="border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 transition-all shadow-2xs"
                        >
                          {/* Top Row: Policies Count, Tier, Invoice No, Status, Purchased Date */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-900 text-sm sm:text-base">+{item.addon_policies} policies</span>
                              {item.tier_name && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  {item.tier_name}
                                </span>
                              )}
                              {item.invoice_no && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.invoice_no)}
                                  className="text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                                  title="Copy invoice #"
                                >
                                  <span>Invoice: {item.invoice_no}</span>
                                  {copiedInvoice === item.invoice_no ? (
                                    <Check size={11} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={10} className="text-slate-400" />
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {item.created_at && (
                                <div className="text-xs text-slate-400 font-normal mr-1 hidden sm:block">
                                  Purchased: {item.created_at}
                                </div>
                              )}

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                              >
                                {isActive ? 'Active' : 'Inactive'}
                              </span>

                              {item.pdf_link ? (
                                <a
                                  href={item.pdf_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="border border-slate-300 hover:border-[#2F439D] bg-white hover:bg-indigo-50/40 text-slate-800 text-xs font-medium px-3 py-1 rounded-lg transition-all shadow-2xs inline-flex items-center gap-1"
                                >
                                  <Download size={11} />
                                  <span>Download invoice</span>
                                </a>
                              ) : null}
                            </div>
                          </div>

                          {/* Attributes Grid: Preserving All Original Fields (Rate, Starting, Ending, Days, Base, GST) */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs pt-1 border-t border-slate-100">
                            {/* 1. Rate per policy */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Rate / policy</span>
                              <span className="font-semibold text-slate-800">₹{item.rate_per_policy ?? 0}</span>
                            </div>

                            {/* 2. Starting date */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Starting date</span>
                              <span className="font-medium text-slate-800 flex items-center gap-1">
                                <Calendar size={12} className="text-indigo-500 shrink-0" />
                                {item.starting_date || '—'}
                              </span>
                            </div>

                            {/* 3. Ending date */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Ending date</span>
                              <span className="font-medium text-slate-800 flex items-center gap-1">
                                <CalendarDays size={12} className="text-indigo-500 shrink-0" />
                                {item.ending_date || '—'}
                              </span>
                            </div>

                            {/* 4. Days remaining */}
                            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                              <span className="text-amber-900/80 block text-[11px] mb-0.5 font-medium">Days remaining</span>
                              <span className="font-semibold text-amber-950 flex items-center gap-1">
                                <Clock size={12} className="text-amber-600 shrink-0" />
                                {item.days_remaining ?? 0} days
                              </span>
                            </div>

                            {/* 5. Base amount */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Base amount</span>
                              <span className="font-medium text-slate-800">₹{item.amount ?? 0}</span>
                            </div>

                            {/* 6. GST amount */}
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                              <span className="text-slate-400 block text-[11px] mb-0.5">Gst amount</span>
                              <span className="font-medium text-slate-800">₹{item.gst_amount ?? 0}</span>
                            </div>
                          </div>

                          {/* Footer with Final Amount */}
                          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Total paid amount:</span>
                            <span className="text-base font-semibold text-slate-900">
                              ₹{item.final_amount ?? item.amount ?? 0}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-normal">
                <span className="text-slate-500">
                  Page <span className="text-slate-900 font-medium">{page}</span> of <span className="text-slate-900 font-medium">{totalPages}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* RIGHT: SIDEBAR WIDGETS (Validity & Credit Ledger)               */}
          {/* --------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            {/* WIDGET 1: PLAN VALIDITY & FINANCIAL SNAPSHOT */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#2F439D] flex items-center justify-center font-semibold">
                    <Clock size={15} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">Plan validity</h3>
                </div>
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200/60">
                  {displayDaysLeft} days left
                </span>
              </div>

              {/* Date Metric Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-normal block">Start date</span>
                  <span className="text-xs font-semibold text-slate-900 block mt-0.5">{activeStartDate}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-right">
                  <span className="text-[11px] text-slate-400 font-normal block">Expiry date</span>
                  <span className="text-xs font-semibold text-slate-900 block mt-0.5">{activeEndDate}</span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 font-normal">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base amount:</span>
                  <span className="font-medium text-slate-800">₹{activeSubscription?.amount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wallet used:</span>
                  <span className="font-medium text-slate-800">₹{activeSubscription?.wallet_amount_used ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gst percentage:</span>
                  <span className="font-medium text-slate-800">{activeSubscription?.gst_percentage ?? 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coupon discount:</span>
                  <span className="font-medium text-slate-800">₹{activeSubscription?.discount_amount ?? 0}</span>
                </div>
              </div>
            </div>

            {/* WIDGET 2: CREDIT LEDGER SNAPSHOT */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#197a56] flex items-center justify-center font-semibold">
                    <Activity size={15} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">Credit ledger</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('ai')}
                  className="text-xs text-[#2F439D] font-medium hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {aiHistoryList.length > 0 ? (
                  aiHistoryList.slice(0, 4).map((entry, i) => {
                    const isAddition = entry.type === 1;

                    return (
                      <div key={entry.id || i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-900 truncate max-w-[170px]">
                            {entry.title || 'Ai document scan'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal">{entry.created_at || '—'}</div>
                        </div>

                        <div className={`font-medium text-xs whitespace-nowrap px-2 py-0.5 rounded-full ${isAddition ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {isAddition ? '+' : '-'}{Number(entry.credits || 0).toLocaleString()}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 font-normal">
                    No recent credit transactions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy AI Credits Modal */}
      <BuyAiCreditsModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* Add Policies Modal */}
      <AddPoliciesModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />

      {/* Upgrade & Renew Plan Modal */}
      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        isExpired={isExpired}
        onClose={() => {
          if (isExpired) return;
          setIsUpgradeModalOpen(false);
        }}
      />
    </>
  );
}
