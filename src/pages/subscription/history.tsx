import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Sparkles,
  Receipt,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  CreditCard,
  Crown,
  Tag,
  Percent,
  Wallet,
  CalendarDays,
  FileCheck
} from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export interface SubscriptionItem {
  subscription_id: number;
  invoice_no?: string;
  plan_id?: number | string;
  plan_name: string;
  ai_limit?: number | string;
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

export default function SubscriptionHistoryPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [popupInfo, setPopupInfo] = useState<any>(null);

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
          // Condition 1: is_expired: 1 -> Popup shows & CANNOT be closed
          setIsExpired(true);
          setIsUpgradeModalOpen(true);
        } else if (showPopup) {
          // Condition 2: show_popup: true, is_expired: 0 -> Popup shows & CAN be closed
          setIsExpired(false);
          setIsUpgradeModalOpen(true);
        } else {
          // Condition 3: show_popup: false, is_expired: 0 -> Do NOT show popup
          setIsExpired(false);
          setIsUpgradeModalOpen(false);
        }
      } else {
        setIsExpired(false);
        setIsUpgradeModalOpen(false);
      }
    } catch (err) {
      console.error('Error fetching subscription popup info:', err);
      setIsExpired(false);
      setIsUpgradeModalOpen(false);
    }
  }, []);

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

  const activeSubscription = subscriptions.find(
    (s) => s.status === 1 || String(s.status_name).toLowerCase() === 'active'
  ) || subscriptions[0];

  const displayPlanName = popupInfo?.plan_name || activeSubscription?.plan_name || 'N/A';
  const displayDaysLeft = popupInfo?.days_left ?? activeSubscription?.days_left ?? 0;

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  return (
    <>
      <Head>
        <title>Subscription List & History | Insuraa</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2E3192] via-[#232569] to-[#191B47] text-white p-8 md:p-10 shadow-xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-md">
                <Sparkles size={14} className="text-[#2BBF8C]" />
                Subscription & Billing Center
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Subscription List
              </h1>
              <p className="text-blue-100/90 text-sm max-w-xl font-normal leading-relaxed">
                View your complete subscription history, active plans, AI credit limits, GST details, and billing invoices.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={fetchSubscriptions}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Crown size={18} className="fill-current" />
                <span>Upgrade / Renew Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Subscription Summary Cards */}
        {activeSubscription && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Active Plan Name */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-[#2E3192]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#2E3192] flex items-center justify-center mb-4 font-semibold shadow-inner">
                <Crown size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-wide">Current Active Plan</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                {displayPlanName}
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </h3>
            </div>

            {/* AI Limit */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-semibold shadow-inner">
                <Zap size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-wide">AI Credit Limit</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {activeSubscription.ai_limit ?? 'N/A'} <span className="text-xs font-semibold text-slate-700">Credits</span>
              </h3>
            </div>

            {/* Days Left */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-semibold shadow-inner">
                <Clock size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-wide">Days Remaining</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {displayDaysLeft} <span className="text-xs font-semibold text-slate-700">Days Left</span>
              </h3>
            </div>

            {/* Latest Invoice */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-semibold shadow-inner">
                <Receipt size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-wide">Invoice Number</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 truncate">
                {activeSubscription.invoice_no || 'N/A'}
              </h3>
            </div>
          </div>
        )}

        {/* Search, Filter & Main Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by invoice number or plan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white text-sm text-slate-800 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 outline-none focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-semibold text-slate-700">
              <span>Total Subscriptions: <span className="text-slate-900 font-bold">{totalRecords}</span></span>
            </div>
          </div>

          {/* Subscription Items List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
                <RefreshCw className="w-10 h-10 animate-spin text-[#2E3192]" />
                <span className="text-sm font-semibold text-slate-700">Fetching subscription list...</span>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-[#2E3192] flex items-center justify-center mb-4 shadow-inner">
                  <Receipt size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Subscriptions Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md font-normal">
                  There are no subscription records matching your current filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map((item, idx) => {
                  const isActive = item.status === 1 || String(item.status_name).toLowerCase() === 'active';
                  const baseAmt = item.amount ?? '0';
                  const finalAmt = item.final_amount ?? item.amount ?? '0';

                  return (
                    <div
                      key={item.subscription_id || idx}
                      className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col gap-6 relative overflow-hidden group hover:shadow-md ${isActive
                        ? 'border-[#2E3192]/40 bg-gradient-to-r from-blue-50/20 via-white to-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {/* Left Accent Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-2 ${isActive ? 'bg-[#2E3192]' : 'bg-slate-300'
                          }`}
                      />

                      {/* Header Row: Plan Name, Status, Invoice No */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isActive
                              ? 'bg-gradient-to-tr from-[#2E3192] to-[#2BBF8C] text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                          >
                            {isActive ? <Crown size={26} /> : <Receipt size={26} />}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h2 className="font-bold text-slate-900 text-lg">
                                {item.plan_name}
                              </h2>

                              {/* Status Badge */}
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full tracking-wide ${isActive
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                              >
                                {isActive ? (
                                  <>
                                    <CheckCircle2 size={13} className="text-emerald-600" />
                                    {item.status_name || 'Active'}
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle size={13} className="text-slate-500" />
                                    {item.status_name || 'Expired'}
                                  </>
                                )}
                              </span>

                              {item.invoice_no && (
                                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-[#2E3192] border border-indigo-100">
                                  Invoice: {item.invoice_no}
                                </span>
                              )}
                            </div>

                            {item.created_at && (
                              <p className="text-xs text-slate-600 font-normal mt-1">
                                Purchased On: {item.created_at}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Invoice Download Action */}
                        <div>
                          {item.pdf_link ? (
                            <a
                              href={item.pdf_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#2E3192] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                            >
                              <Download size={15} />
                              <span>Download Invoice PDF</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                              <Download size={14} />
                              <span>Invoice PDF N/A</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detailed API Data Attributes Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pl-3 text-xs">
                        {/* Start Date */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-slate-700 font-medium block text-[11px] mb-1">Start Date</span>
                          <span className="font-semibold text-slate-900 flex items-center gap-1">
                            <Calendar size={13} className="text-indigo-600" />
                            {item.starting_date || 'N/A'}
                          </span>
                        </div>

                        {/* End Date */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-slate-700 font-medium block text-[11px] mb-1">End Date</span>
                          <span className="font-semibold text-slate-900 flex items-center gap-1">
                            <CalendarDays size={13} className="text-indigo-600" />
                            {item.ending_date || 'N/A'}
                          </span>
                        </div>

                        {/* Days Left */}
                        <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
                          <span className="text-amber-900/80 font-medium block text-[11px] mb-1">Days Left</span>
                          <span className="font-semibold text-amber-950 flex items-center gap-1">
                            <Clock size={13} className="text-amber-600" />
                            {item.days_left ?? 0} Days
                          </span>
                        </div>

                        {/* AI Limit */}
                        <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                          <span className="text-emerald-900/80 font-medium block text-[11px] mb-1">AI Credits</span>
                          <span className="font-semibold text-emerald-950 flex items-center gap-1">
                            <Zap size={13} className="text-emerald-600" />
                            {item.ai_limit ?? 'N/A'}
                          </span>
                        </div>

                        {/* Coupon / Discount */}
                        <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                          <span className="text-purple-900/80 font-medium block text-[11px] mb-1">Coupon Discount</span>
                          <span className="font-semibold text-purple-950 flex items-center gap-1 truncate">
                            <Tag size={13} className="text-purple-600" />
                            {item.coupon_code ? `${item.coupon_code} (${item.coupon_per}% off)` : `₹${item.discount_amount ?? 0}`}
                          </span>
                        </div>

                        {/* GST Amount */}
                        <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                          <span className="text-blue-900/80 font-medium block text-[11px] mb-1">GST ({item.gst_percentage ?? 0}%)</span>
                          <span className="font-semibold text-blue-950 flex items-center gap-1">
                            <Percent size={13} className="text-blue-600" />
                            ₹{item.gst_amount ?? 0}
                          </span>
                        </div>
                      </div>

                      {/* Payment Financial Details Footer */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ml-3">
                        <div className="flex items-center gap-4 flex-wrap text-slate-700 font-normal">
                          <div>
                            <span className="text-slate-600 font-medium">Base Amount: </span>
                            <span className="font-semibold text-slate-900">₹{baseAmt}</span>
                          </div>
                          {item.wallet_amount_used !== undefined && (
                            <div>
                              <span className="text-slate-600 font-medium">Wallet Used: </span>
                              <span className="font-semibold text-slate-900">₹{item.wallet_amount_used}</span>
                            </div>
                          )}
                          {item.razorpay_payment_id && (
                            <div>
                              <span className="text-slate-600 font-medium">Payment ID: </span>
                              <span className="font-mono font-semibold text-slate-900">{item.razorpay_payment_id}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-right self-end sm:self-auto">
                          <span className="text-slate-700 font-medium text-xs">Final Amount:</span>
                          <span className="text-xl font-bold text-slate-900">
                            ₹{Number(finalAmt).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">
                Page <span className="text-slate-900 font-bold">{page}</span> of{' '}
                <span className="text-slate-900 font-bold">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1 || isLoading}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || isLoading}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
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
