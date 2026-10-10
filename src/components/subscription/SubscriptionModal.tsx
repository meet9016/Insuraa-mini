import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';
import axios from 'axios';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
  isExpired?: boolean;
}

export interface PlanApiItem {
  plan_id: number | string;
  plan_name: string;
  plan_price?: string | number;
  gst?: string;
  gst_amount?: string;
  final_price?: string | number;
  sms_limit?: number | string;
  policy_limit?: number | string;
  ai_limit?: number | string;
  features?: string[];
  [key: string]: any;
}

export default function SubscriptionModal({ isOpen, onClose, onSelectPlan, isExpired = false }: SubscriptionModalProps) {
  const loginUserData = useAppSelector((state) => state.auth.user);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [plansList, setPlansList] = useState<PlanApiItem[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const fetchPlanList = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const response = await api.post(endPointApi.AUTH.PLAN_LIST);
      const resData = response.data;
      const list: PlanApiItem[] = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.data)
          ? resData.data
          : Array.isArray(resData?.result)
            ? resData.result
            : [];

      setPlansList(list);

      if (list.length > 0) {
        // Find 6Month or 5 or 2nd item as default selection
        const defaultPlan = list.find((p) => String(p.plan_id) === '5') || list[1] || list[0];
        if (defaultPlan) {
          setSelectedPlanId(String(defaultPlan.plan_id));
        }
      }
    } catch (error) {
      console.error('Error fetching plan_list:', error);
      toast.error('Failed to load subscription plans.');
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchPlanList();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fetchPlanList]);

  if (!isOpen) return null;

  const selectedPlanItem = plansList.find((p) => String(p.plan_id) === String(selectedPlanId));
  const isSelectedPlanFree =
    !selectedPlanItem ||
    String(selectedPlanItem.final_price || selectedPlanItem.plan_price) === '0' ||
    String(selectedPlanItem.plan_name).toLowerCase().includes('free');

  const handleProceed = async () => {
    if (isSelectedPlanFree) {
      toast.info('You are currently on the Free Trial Plan');
      if (onSelectPlan && selectedPlanItem) onSelectPlan(String(selectedPlanItem.plan_id));
      onClose();
      return;
    }

    if (!loginUserData || !loginUserData.id) {
      toast.error('User information is missing. Please log in again.');
      return;
    }

    setIsProcessing(true);

    try {
      const billing = String(selectedPlanItem?.plan_name).toLowerCase().includes('year') ? 'yearly' : 'monthly';
      const planid = String(selectedPlanItem?.plan_id || '5');

      const formData = new FormData();
      formData.append('user_id', String(loginUserData.id || ''));
      formData.append('full_name', String(loginUserData.full_name || loginUserData.name || ''));
      formData.append('number', String(loginUserData.number || ''));
      formData.append('billing_cycle', billing);
      formData.append('plan_id', planid);
      formData.append('coupon_code', '');
      formData.append('company_name', String(loginUserData.company_name || ''));

      const paymentEndpoint =
        process.env.NEXT_PUBLIC_PAYMENT_URL ||
        'https://pay.shopno.in/insuraa-payment-check';

      const response = await axios.post(paymentEndpoint, formData);

      const redirectUrl =
        response.data?.url ||
        response.data?.payment_url ||
        response.data?.data?.url ||
        response.data?.redirect_url;

      if (redirectUrl) {
        toast.success('Redirecting to payment gateway...');
        if (onSelectPlan) onSelectPlan(planid);
        window.location.href = redirectUrl;
      } else if (
        response.data?.status === 200 ||
        response.data?.status === true ||
        response.status === 200
      ) {
        toast.success(response.data?.message || 'Payment request processed successfully!');
        if (onSelectPlan) onSelectPlan(planid);
        onClose();
      } else {
        toast.error(response.data?.message || 'Failed to initiate payment.');
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Payment service unavailable. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Light Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-all duration-300"
        onClick={() => {
          if (!isExpired) onClose();
        }}
      />

      {/* Clean White Modal Box */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200 z-10 text-slate-800 max-h-[90vh]">

        {/* Expired Warning Banner */}
        {isExpired && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-center text-amber-900 text-xs font-bold flex items-center justify-center gap-2 shrink-0">
            <span>Your plan has expired. Please select a plan and renew your subscription to continue.</span>
          </div>
        )}

        {/* Close Button (Hidden if plan is expired) */}
        {!isExpired && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all z-20"
            title="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Header */}
        <div className="pt-8 pb-4 px-6 sm:px-8 text-center border-b border-slate-100 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#2E3192] text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles size={14} className="text-[#2E3192]" />
            Insuraa Membership
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 font-medium">
            Choose the right plan to manage leads, policies & quotes effortlessly.
          </p>
        </div>

        {/* Dynamic Cards Container */}
        <div className="p-6 sm:p-8 bg-slate-50/60 overflow-y-auto flex-1">
          {isLoadingPlans ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E3192]" />
              <span className="text-xs font-semibold">Loading membership plans...</span>
            </div>
          ) : plansList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-medium">
              No subscription plans available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {plansList.map((plan, index) => {
                const planIdStr = String(plan.plan_id);
                const isSelected = String(selectedPlanId) === planIdStr;
                const isFree =
                  String(plan.final_price || plan.plan_price) === '0' ||
                  String(plan.plan_name).toLowerCase().includes('free');

                return (
                  <div
                    key={plan.plan_id || index}
                    onClick={() => setSelectedPlanId(planIdStr)}
                    className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all cursor-pointer relative ${isSelected
                      ? 'border-2 border-[#2E3192] ring-2 ring-[#2E3192]/20 shadow-xl scale-[1.02]'
                      : 'border border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 mt-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {isFree ? 'Basic' : plan.plan_name}
                        </span>
                        {isSelected && <CheckCircle2 size={18} className="text-[#2E3192]" />}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {plan.plan_name}
                      </h3>

                      <div className="mb-4">
                        <span className="text-3xl font-extrabold text-[#2E3192]">
                          ₹{plan.final_price ?? plan.plan_price ?? '0'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {plan.gst && plan.gst !== '0%' ? ` (+${plan.gst} GST)` : ' / plan'}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-4 mb-5 space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((feat: string, fIdx: number) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-800 font-semibold">
                              <Check size={15} className="text-[#2E3192] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            {plan.policy_limit && (
                              <div className="flex items-start gap-2 text-xs text-slate-800 font-semibold">
                                <Check size={15} className="text-[#2E3192] shrink-0 mt-0.5" />
                                <span>Policy Limit: {plan.policy_limit}</span>
                              </div>
                            )}
                            {plan.ai_limit && (
                              <div className="flex items-start gap-2 text-xs text-slate-800 font-semibold">
                                <Check size={15} className="text-[#2E3192] shrink-0 mt-0.5" />
                                <span>AI Limit: {plan.ai_limit}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanId(planIdStr);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${isSelected
                        ? 'bg-[#2E3192] hover:bg-[#232569] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {isSelected ? 'Selected' : `Select ${plan.plan_name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Encrypted Payment • Cancel Anytime</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleProceed}
              disabled={isProcessing || isSelectedPlanFree}
              className="px-6 py-2.5 rounded-xl bg-[#2E3192] hover:bg-[#232569] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue with Selected Plan</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
