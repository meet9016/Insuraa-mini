import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Loader2,
  Minus,
  Plus,
  Crown,
  Tag,
  Lock,
  Receipt,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  usePolicyPlanInfo,
  fetchPolicyPlanQuote,
  fetchPolicyPlanPurchase,
  DirectPlanQuoteData,
  PlanTier,
  BillingCycle,
} from '@/hooks/usePricingApi';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
  isExpired?: boolean;
}

// Preserve export for backwards compatibility
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

export default function SubscriptionModal({
  isOpen,
  onClose,
  onSelectPlan,
  isExpired = false,
}: SubscriptionModalProps) {
  // Fetch policy plan info from authenticated endpoint
  const { data: planData, isLoading: isLoadingPlans, refetch: refetchPlanInfo } = usePolicyPlanInfo(isOpen);

  const [selectedPlanTier, setSelectedPlanTier] = useState<string>('silver');
  const [policiesCount, setPoliciesCount] = useState<number>(50);
  const policiesCountRef = React.useRef<number>(50);
  const [billingCycle, setBillingCycle] = useState<string>('yearly');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [quoteData, setQuoteData] = useState<DirectPlanQuoteData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Sync ref with policiesCount
  useEffect(() => {
    policiesCountRef.current = policiesCount;
  }, [policiesCount]);

  // Minimum and maximum policies determined dynamically from policy_plan_info API
  // Uses min_policies_for_renew when > 0 (for renewal), otherwise min_policies
  const minAllowedPolicies = useMemo(() => {
    if (planData?.min_policies_for_renew && planData.min_policies_for_renew > 0) {
      return planData.min_policies_for_renew;
    }
    return planData?.min_policies || 50;
  }, [planData]);

  const maxAllowedPolicies = useMemo(() => {
    return planData?.max_policies || 1000000;
  }, [planData]);

  // Dynamic currency/number formatter for exact API responses (no client-side recalculations)
  const formatAmount = (val: any) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') return val.toLocaleString('en-IN');
    const num = Number(val);
    if (!isNaN(num)) return num.toLocaleString('en-IN');
    return String(val);
  };

  // Quote loader via policy_plan_quote API with dynamic error handling
  const loadQuote = useCallback(
    async (
      targetPolicies: number,
      targetCycle: string,
      couponToUse: string = '',
      isCouponAction: boolean = false
    ) => {
      setIsFetchingQuote(true);
      if (isCouponAction) {
        setIsApplyingCoupon(true);
      }
      try {
        const res = await fetchPolicyPlanQuote({
          policies: targetPolicies,
          billing_cycle: targetCycle,
          coupon_code: couponToUse,
        });

        if (
          res &&
          (res.status === 200 || res.status === '200' || res.status === true) &&
          res.data &&
          !Array.isArray(res.data)
        ) {
          setQuoteData(res.data);
          if (isCouponAction) {
            if (Number(res.data.coupon_amount) > 0 || Number(res.data.coupon_per) > 0) {
              setIsCouponApplied(true);
              setAppliedCouponCode(couponToUse);
              if (res.message) toast.success(res.message);
            } else {
              setIsCouponApplied(false);
              setAppliedCouponCode('');
              const dynamicMsg = res.message || res.data?.message;
              if (dynamicMsg) toast.error(dynamicMsg);
            }
          }
        } else {
          // Dynamic error toast directly from API response
          const dynamicMsg = res?.message || res?.data?.message;
          if (dynamicMsg) {
            toast.error(dynamicMsg);
          }
          if (isCouponAction) {
            setIsCouponApplied(false);
            setAppliedCouponCode('');
          }
        }
      } catch (err: any) {
        console.error('Error fetching policy plan quote:', err);
        const dynamicMsg = err?.response?.data?.message || err?.data?.message || err?.message;
        if (dynamicMsg) {
          toast.error(dynamicMsg);
        }
        if (isCouponAction) {
          setIsCouponApplied(false);
          setAppliedCouponCode('');
        }
      } finally {
        setIsFetchingQuote(false);
        if (isCouponAction) {
          setIsApplyingCoupon(false);
        }
      }
    },
    []
  );

  // Reset and initialize on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      refetchPlanInfo();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, refetchPlanInfo]);

  // When planData loads, initialize selection strictly with API values (min_policies_for_renew if > 0, else min_policies)
  useEffect(() => {
    if (isOpen && planData) {
      const startingPolicies =
        planData.min_policies_for_renew && planData.min_policies_for_renew > 0
          ? planData.min_policies_for_renew
          : planData.min_policies || 50;

      let initialTierName = 'silver';
      if (planData.tiers && planData.tiers.length > 0) {
        const matchedTier = planData.tiers.find((t) => {
          if (t.to !== null && t.to !== undefined) {
            return startingPolicies >= t.from && startingPolicies <= t.to;
          }
          return startingPolicies >= t.from;
        });
        const paidTiers = planData.tiers.filter((t) => !t.name.toLowerCase().includes('free'));
        initialTierName = (matchedTier || paidTiers[0] || planData.tiers[0]).name.toLowerCase();
      }

      const yearlyCycle = planData.cycles?.find((c) => c.billing_cycle === 'yearly');
      const initialCycle = yearlyCycle?.billing_cycle || planData.cycles?.[0]?.billing_cycle || 'yearly';

      setSelectedPlanTier(initialTierName);
      setPoliciesCount(startingPolicies);
      policiesCountRef.current = startingPolicies;
      setBillingCycle(initialCycle);
      setIsCouponApplied(false);
      setCouponCode('');
      setAppliedCouponCode('');

      loadQuote(startingPolicies, initialCycle, '');
    }
  }, [isOpen, planData, loadQuote]);

  // Debounced auto-quote update on policies count changes when manually typed
  useEffect(() => {
    if (!isOpen || !planData) return;
    const timer = setTimeout(() => {
      if (
        quoteData &&
        (quoteData.policies !== policiesCount || quoteData.billing_cycle !== billingCycle)
      ) {
        loadQuote(policiesCount, billingCycle, isCouponApplied ? appliedCouponCode : '');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [policiesCount, billingCycle, isCouponApplied, appliedCouponCode, isOpen, planData, quoteData, loadQuote]);

  // Selected tier & cycle helpers
  const currentTier = useMemo(() => {
    return (
      planData?.tiers?.find((t) => t.name.toLowerCase() === selectedPlanTier) ||
      planData?.tiers?.[0]
    );
  }, [planData, selectedPlanTier]);

  const currentCycle = useMemo(() => {
    return (
      planData?.cycles?.find((c) => c.billing_cycle === billingCycle) ||
      planData?.cycles?.[0]
    );
  }, [planData, billingCycle]);

  const handleSelectTier = (tierName: string) => {
    const tierLower = tierName.toLowerCase();
    setSelectedPlanTier(tierLower);
    const foundTier = planData?.tiers?.find((t) => t.name.toLowerCase() === tierLower);
    if (foundTier) {
      const min = Math.max(foundTier.from || 0, minAllowedPolicies);
      const max = foundTier.to || maxAllowedPolicies;
      let nextCount = policiesCount;
      if (nextCount < min) nextCount = min;
      if (max && nextCount > max) nextCount = max;
      setPoliciesCount(nextCount);
      policiesCountRef.current = nextCount;
      loadQuote(nextCount, billingCycle, isCouponApplied ? appliedCouponCode : '');
    }
  };

  const handleSelectCycle = (cycle: string) => {
    setBillingCycle(cycle);
    loadQuote(policiesCount, cycle, isCouponApplied ? appliedCouponCode : '');
  };

  const handlePoliciesStep = (step: number) => {
    const min = minAllowedPolicies;
    const max = maxAllowedPolicies;
    let nextVal = (policiesCountRef.current || policiesCount) + step;
    if (nextVal < min) nextVal = min;
    if (nextVal > max) nextVal = max;

    policiesCountRef.current = nextVal;
    setPoliciesCount(nextVal);

    // Sync selected tier with policy count
    const matchedTier = planData?.tiers?.find((t) => {
      if (t.to !== null && t.to !== undefined) {
        return nextVal >= t.from && nextVal <= t.to;
      }
      return nextVal >= t.from;
    });
    if (matchedTier) {
      setSelectedPlanTier(matchedTier.name.toLowerCase());
    }

    // Call quote API immediately on step button click
    loadQuote(nextVal, billingCycle, isCouponApplied ? appliedCouponCode : '');
  };

  const handleManualPoliciesChange = (valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) {
      setPoliciesCount(0);
      policiesCountRef.current = 0;
      return;
    }
    setPoliciesCount(val);
    policiesCountRef.current = val;

    const matchedTier = planData?.tiers?.find((t) => {
      if (t.to !== null && t.to !== undefined) {
        return val >= t.from && val <= t.to;
      }
      return val >= t.from;
    });
    if (matchedTier) {
      setSelectedPlanTier(matchedTier.name.toLowerCase());
    }
  };

  const handlePoliciesBlur = () => {
    const min = minAllowedPolicies;
    const max = maxAllowedPolicies;
    let nextVal = policiesCount;
    if (nextVal < min) nextVal = min;
    if (nextVal > max) nextVal = max;
    setPoliciesCount(nextVal);
    policiesCountRef.current = nextVal;
    loadQuote(nextVal, billingCycle, isCouponApplied ? appliedCouponCode : '');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    loadQuote(policiesCount, billingCycle, couponCode.trim(), true);
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode('');
    setAppliedCouponCode('');
    loadQuote(policiesCount, billingCycle, '');
  };

  const handleProceedPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetchPolicyPlanPurchase({
        policies: quoteData?.policies ?? policiesCount,
        billing_cycle: billingCycle,
        coupon_code: isCouponApplied ? appliedCouponCode : (couponCode.trim() || ''),
      });

      if (res && (res.status === 200 || res.status === '200' || res.status === true)) {
        toast.success(res.message || 'Payment link created successfully!');
        const redirectUrl =
          res.data?.redirect_url ||
          res.redirect_url ||
          res.data?.url ||
          res.url;

        if (redirectUrl) {
          if (onSelectPlan) {
            onSelectPlan(String(quoteData?.plan_id || ''));
          }
          window.location.href = redirectUrl;
          return;
        } else {
          toast.info('Payment link created, but no redirect URL was returned.');
        }
      } else {
        toast.error(res?.message || 'Failed to initiate payment.');
      }
    } catch (err: any) {
      console.error('Error during policy_plan_purchase:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
        onClick={() => {
          if (!isExpired && !isProcessingPayment) onClose();
        }}
      />

      {/* Main Modal Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200 z-10 text-slate-800 max-h-[92vh]">

        {/* Expired Warning Banner */}
        {isExpired && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 text-center text-amber-900 text-xs font-bold flex items-center justify-center gap-2 shrink-0">
            <Crown size={15} className="text-amber-600 fill-amber-500" />
            <span>Your subscription has expired. Please select a plan and renew to continue uninterrupted access.</span>
          </div>
        )}

        {/* Close Button */}
        {!isExpired && (
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessingPayment}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all z-20 cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Header */}
        <div className="pt-6 pb-3.5 px-6 sm:px-8 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#2D3591]/10 text-[#2D3591] flex items-center justify-center shadow-xs">
              <Crown className="w-4 h-4 fill-[#2D3591]" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Upgrade &amp; Renew Membership Plan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Scale your agency with automated renewal reminders, multi-line policy vault, and instant AI OCR credits.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {isLoadingPlans ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
              <Loader2 className="w-9 h-9 animate-spin text-[#2D3591]" />
              <span className="text-sm font-semibold text-slate-700">Loading policy plan details...</span>
            </div>
          ) : !planData || !planData.tiers || planData.tiers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm font-medium">
              No plan details available right now. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* LEFT COLUMN: Plan Selection & Policy Volume (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">

                {/* Plan Tier Selection */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2D3591]" />
                      1. Select Tier
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Tier adjusts automatically based on policies
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {planData.tiers
                      .filter((p) => !p.name.toLowerCase().includes('free'))
                      .map((plan) => {
                        const activeTierName = quoteData?.tier || selectedPlanTier;
                        const isSelected = activeTierName.toLowerCase() === plan.name.toLowerCase();
                        const rangeLabel = plan.to
                          ? `${plan.from.toLocaleString()} - ${plan.to.toLocaleString()}`
                          : `${plan.from.toLocaleString()}+`;

                        return (
                          <div
                            key={plan.name}
                            onClick={() => handleSelectTier(plan.name)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? 'border-[#2D3591] bg-indigo-50/50 shadow-xs ring-1 ring-[#2D3591]/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-sm font-bold text-slate-900 leading-tight">{plan.name}</div>
                                <div className="text-[11px] text-slate-500 font-normal mt-0.5">{rangeLabel} policies</div>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1.5 transition-all ${isSelected
                                  ? 'bg-[#2D3591] text-white'
                                  : 'border-2 border-slate-300'
                                  }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">Rate:</span>
                              <span className="font-bold text-[#2D3591]">₹{plan.rate}/mo</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Policies Counter & Billing Cycle */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Number of Policies */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          2. Number of Policies
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ₹{quoteData?.rate_per_policy ?? currentTier?.rate ?? 0}/policy/mo
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const step = policiesCount > 1000 ? 100 : 50;
                            handlePoliciesStep(-step);
                          }}
                          className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                          <input
                            type="number"
                            min={minAllowedPolicies}
                            max={maxAllowedPolicies}
                            value={policiesCount || ''}
                            onChange={(e) => handleManualPoliciesChange(e.target.value)}
                            onBlur={handlePoliciesBlur}
                            className="w-full h-10 px-3 text-center rounded-xl border border-slate-200 bg-slate-50/60 font-semibold text-sm text-slate-900 focus:outline-hidden focus:border-[#2D3591] focus:bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const step = policiesCount >= 1000 ? 100 : 50;
                            handlePoliciesStep(step);
                          }}
                          className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* AI OCR Credit Bonus */}
                      {planData?.first_purchase_free_ai_credits === 'equal_to_policies' && (
                        <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Includes {(quoteData?.free_ai_credits ?? quoteData?.policies ?? policiesCount).toLocaleString()} free AI OCR credits</span>
                        </div>
                      )}
                    </div>

                    {/* Billing Cycle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        3. Billing Cycle
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                        {planData?.cycles?.map((cycle) => {
                          const isCycleActive = billingCycle === cycle.billing_cycle;
                          return (
                            <button
                              key={cycle.billing_cycle}
                              type="button"
                              onClick={() => handleSelectCycle(cycle.billing_cycle)}
                              className={`py-2 px-1 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${isCycleActive
                                ? 'bg-[#2D3591] text-white shadow-xs font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                              <span>{cycle.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-1.5 text-center">
                        {billingCycle === 'yearly'
                          ? 'Billed Annually (Best Value)'
                          : billingCycle === 'quarterly'
                            ? 'Billed Every 3 Months'
                            : 'Billed Monthly'}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Features Checklist */}
                {currentTier?.features && currentTier.features.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Plan Features Included in {currentTier.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {currentTier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Price Details & Payment Action (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">

                {/* Price Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#2D3591]" />
                      <h3 className="text-sm font-bold text-slate-900">Price Details</h3>
                    </div>
                    {isFetchingQuote && (
                      <span className="text-[11px] text-[#2D3591] flex items-center gap-1 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                      </span>
                    )}
                  </div>

                  {/* Active Plan Pill */}
                  <div className="px-3 py-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[#2D3591] text-xs font-semibold flex items-center justify-between">
                    <span>
                      {quoteData?.plan_name ||
                        `${currentTier?.name || 'Silver'} - ${policiesCount} Policies - ${currentCycle?.label || 'Yearly'}`}
                    </span>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded-md shadow-2xs font-bold">
                      {currentCycle?.multiplier || 1} mo
                    </span>
                  </div>

                  {/* Price Calculations Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>
                        {quoteData?.policies ?? policiesCount} policies × ₹{quoteData?.rate_per_policy ?? currentTier?.rate ?? 0} ×{' '}
                        {quoteData?.months ?? currentCycle?.multiplier ?? 1} mo
                      </span>
                      <span className="font-semibold text-slate-900">
                        {quoteData ? `₹${formatAmount(quoteData.total_price)}` : '—'}
                      </span>
                    </div>

                    {/* Coupon Discount Row if applied */}
                    {isCouponApplied && quoteData && Number(quoteData.coupon_amount) > 0 && (
                      <div className="flex justify-between items-center text-emerald-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Coupon Discount ({quoteData.coupon_per}%)
                        </span>
                        <span>-₹{formatAmount(quoteData.coupon_amount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-600">
                      <span>GST ({quoteData?.gst_percentage ?? planData?.gst_percentage ?? 18}%)</span>
                      <span className="font-semibold text-slate-900">
                        {quoteData ? `₹${formatAmount(quoteData.gst_amount)}` : '—'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Total Payable</span>
                      <span className="text-2xl font-black text-[#2D3591]">
                        {quoteData ? `₹${formatAmount(quoteData.final_amount)}` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Have a coupon code?
                    </label>
                    {isCouponApplied ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{appliedCouponCode}</span>
                          <span className="text-[10px] text-emerald-600 font-normal">
                            (-₹{quoteData?.coupon_amount || 0})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] text-xs uppercase"
                        />
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-4 py-2 rounded-xl bg-[#2D3591] hover:bg-[#222870] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {isApplyingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Security Assurance */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">
                      100% Secure Payment • Official Payment Gateway Redirection
                    </span>
                  </div>

                  {/* Proceed to Payment Action Button */}
                  <button
                    type="button"
                    onClick={handleProceedPayment}
                    disabled={isProcessingPayment || isFetchingQuote || !quoteData}
                    className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-[#2D3591] hover:bg-[#222870] shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Payment Link...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay Now {quoteData ? `— ₹${formatAmount(quoteData.final_amount)}` : ''}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-0.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-slate-400">
                    Secured by SSL • Instant Activation on Payment Success
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
