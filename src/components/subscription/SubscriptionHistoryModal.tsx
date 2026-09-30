import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
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
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

interface SubscriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  amount?: string;
  coupon_code?: string;
  coupon_per?: number;
  discount_amount?: number;
  gst_percentage?: number;
  gst_amount?: number;
  wallet_amount_used?: string;
  final_amount?: string;
  razorpay_payment_id?: string;
  pdf_link?: string;
  created_at?: string;
  [key: string]: any;
}

export default function SubscriptionHistoryModal({
  isOpen,
  onClose,
}: SubscriptionHistoryModalProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);

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
        setTotalRecords(resData.pagination_arr.total_records);
      } else {
        setTotalRecords(list.length);
      }
    } catch (error: any) {
      console.error('Error fetching subscription list:', error);
      toast.error('Failed to load subscription history');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, limit]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchSubscriptions();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fetchSubscriptions]);

  if (!isOpen) return null;

  const activeSubscription = subscriptions.find(
    (s) => s.status === 1 || String(s.status_name).toLowerCase() === 'active'
  ) || subscriptions[0];

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Main Container Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200 z-10 text-slate-800 max-h-[90vh]">

        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-[#2E3192] via-[#232569] to-[#17183B] p-6 sm:p-8 text-white relative overflow-hidden shrink-0">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-md z-20 hover:scale-105 active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10 pr-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-bold tracking-wide mb-2 backdrop-blur-md">
                <Sparkles size={13} className="text-[#2BBF8C]" />
                Subscription & Invoices
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                My Subscription History
              </h2>
              <p className="text-blue-100/80 text-xs sm:text-sm mt-1 max-w-lg font-medium leading-relaxed">
                Check active plans, transaction history, AI credits, and download official invoices.
              </p>
            </div>

            {/* Refresh Action */}
            <button
              type="button"
              onClick={fetchSubscriptions}
              disabled={isLoading}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Active Plan Stats Strip if available */}
          {activeSubscription && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs font-medium">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider block">Active Plan</span>
                <span className="text-white font-extrabold text-sm truncate block mt-0.5">{activeSubscription.plan_name}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider block">AI Credits</span>
                <span className="text-white font-extrabold text-sm truncate block mt-0.5">{activeSubscription.ai_limit ?? 'N/A'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider block">Days Left</span>
                <span className="text-white font-extrabold text-sm truncate block mt-0.5">{activeSubscription.days_left ?? 0} Days</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider block">Invoice No</span>
                <span className="text-white font-extrabold text-sm truncate block mt-0.5">{activeSubscription.invoice_no || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice number or plan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 transition-all shadow-inner"
            />
          </div>

          <div className="text-xs text-slate-500 font-bold self-end sm:self-auto">
            Showing <span className="text-slate-900 font-black">{subscriptions.length}</span> of{' '}
            <span className="text-slate-900 font-black">{totalRecords}</span> Records
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <RefreshCw className="w-9 h-9 animate-spin text-[#2E3192]" />
              <span className="text-xs font-bold text-slate-600">Loading subscriptions...</span>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#2E3192] flex items-center justify-center mb-3 shadow-inner">
                <Receipt size={32} />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Subscriptions Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No matching subscription records found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((item, idx) => {
                const isActive =
                  item.status === 1 ||
                  String(item.status_name).toLowerCase() === 'active';
                const finalAmt = item.final_amount ?? item.amount ?? '0';

                return (
                  <div
                    key={item.subscription_id || idx}
                    className={`bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group hover:shadow-lg ${
                      isActive
                        ? 'border-[#2E3192]/40 ring-1 ring-[#2E3192]/10 shadow-sm'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Status Color Left Pill */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-2 ${
                        isActive ? 'bg-gradient-to-b from-[#2E3192] to-[#2BBF8C]' : 'bg-slate-300'
                      }`}
                    />

                    {/* Main Details */}
                    <div className="flex items-start gap-4 pl-3">
                      <div
                        className={`w-13 h-13 p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          isActive
                            ? 'bg-gradient-to-br from-[#2E3192] to-[#2BBF8C] text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isActive ? <Crown size={24} /> : <Receipt size={24} />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-black text-slate-900 text-base">
                            {item.plan_name}
                          </h3>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isActive ? (
                              <CheckCircle2 size={11} className="text-emerald-600" />
                            ) : (
                              <Clock size={11} />
                            )}
                            {item.status_name || (isActive ? 'Active' : 'Expired')}
                          </span>

                          {item.invoice_no && (
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              #{item.invoice_no}
                            </span>
                          )}
                        </div>

                        {/* Dates & Limits */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap font-medium pt-1">
                          {item.starting_date && item.ending_date && (
                            <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                              <Calendar size={13} className="text-indigo-600" />
                              {item.starting_date} to {item.ending_date}
                            </span>
                          )}

                          {item.ai_limit !== undefined && (
                            <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                              <Zap size={13} className="text-emerald-600" />
                              AI Credits: {item.ai_limit}
                            </span>
                          )}

                          {item.days_left !== undefined && (
                            <span className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                              <Clock size={13} className="text-amber-600" />
                              {item.days_left} Days Left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Invoice Download */}
                    <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0 pl-3 md:pl-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Final Amount</span>
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          ₹{Number(finalAmt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {item.pdf_link ? (
                        <a
                          href={item.pdf_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#2E3192] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                          <Download size={14} />
                          <span>Invoice PDF</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed border border-slate-200"
                        >
                          <Download size={14} />
                          <span>Invoice N/A</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-500 font-bold">
              Page <span className="text-slate-900 font-black">{page}</span> of{' '}
              <span className="text-slate-900 font-black">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages || isLoading}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
