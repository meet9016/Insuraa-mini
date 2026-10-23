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
  Layers,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  usePolicyPlanInfo,
  fetchPolicyPlanQuote,
  fetchPolicyPlanPurchase,
  fetchDirectGstVerify,
  fetchBillDetailsUpdateProfile,
  DirectPlanQuoteData,
} from '@/hooks/usePricingApi';
import { fetchPincodeDetails } from '@/hooks/useCustomerApi';

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
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Sync ref with policiesCount
  useEffect(() => {
    policiesCountRef.current = policiesCount;
  }, [policiesCount]);

  // Dynamic bill details from policy_plan_info API (bill_details in response data)
  const billDetails = planData?.bill_details;

  const displayFullName = billDetails?.full_name || '';
  const displayMobile = billDetails?.number || '';
  const displayEmail = billDetails?.email || '';
  const displayCompanyName = billDetails?.company_name || '';
  const displayGst = billDetails?.gst_number || '';
  const displayAddress = billDetails?.address || '';
  const displayCity = billDetails?.city || '';
  const displayState = billDetails?.state || '';
  const displayPincode = billDetails?.pincode || '';

  const displayFullAddress = useMemo(() => {
    const parts = [displayAddress, displayCity, displayState, displayPincode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '—';
  }, [displayAddress, displayCity, displayState, displayPincode]);

  // Edit Billing Details Modal State
  const [isEditBillingOpen, setIsEditBillingOpen] = useState<boolean>(false);
  const [isUpdatingBillDetails, setIsUpdatingBillDetails] = useState<boolean>(false);
  const [isVerifyingGst, setIsVerifyingGst] = useState<boolean>(false);
  const [isGstVerified, setIsGstVerified] = useState<boolean>(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState<boolean>(false);

  const [editForm, setEditForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    nationality: 'India',
    gst_number: '',
  });

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setEditForm((prev) => ({ ...prev, pincode: clean }));

    if (clean.length === 6) {
      setIsFetchingPincode(true);
      try {
        const pData = await fetchPincodeDetails(clean);
        if (pData) {
          setEditForm((prev) => ({
            ...prev,
            city: pData.city || pData.district || prev.city,
            state: pData.state || prev.state,
            nationality: pData.country || prev.nationality || 'India',
          }));
          const locText = [pData.city, pData.state].filter(Boolean).join(', ');
          if (locText) {
            toast.success(`Location auto-filled: ${locText}`);
          }
        }
      } catch (err: any) {
        console.error('Error fetching pincode details:', err);
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  const handleOpenEditBilling = () => {
    const initialPincode = billDetails?.pincode ? String(billDetails.pincode).trim() : '';
    setEditForm({
      full_name: billDetails?.full_name || '',
      company_name: billDetails?.company_name || '',
      email: billDetails?.email || '',
      number: billDetails?.number ? String(billDetails.number).replace(/\D/g, '').slice(-10) : '',
      address: billDetails?.address || '',
      city: billDetails?.city || '',
      state: billDetails?.state || '',
      pincode: initialPincode,
      nationality: billDetails?.nationality || billDetails?.country || 'India',
      gst_number: billDetails?.gst_number || '',
    });
    setIsGstVerified(!!billDetails?.gst_number && billDetails.gst_number.trim().length === 15);
    setIsEditBillingOpen(true);

    // If pincode exists but city or state is missing, auto-fetch
    if (initialPincode.length === 6 && (!billDetails?.city || !billDetails?.state)) {
      fetchPincodeDetails(initialPincode).then((pData) => {
        if (pData) {
          setEditForm((prev) => ({
            ...prev,
            city: prev.city || pData.city || pData.district || '',
            state: prev.state || pData.state || '',
            nationality: prev.nationality || pData.country || 'India',
          }));
        }
      });
    }
  };

  const handleVerifyGstInModal = async () => {
    const rawGst = editForm.gst_number.trim().toUpperCase();
    if (rawGst.length !== 15) {
      toast.error('Please enter a valid 15-character GST number');
      return;
    }

    setIsVerifyingGst(true);
    try {
      const res = await fetchDirectGstVerify(rawGst);
      const isSuccess =
        res &&
        (res.status === 200 || res.status === '200' || res.status === true) &&
        res.data &&
        !res.data.error;

      if (isSuccess) {
        setIsGstVerified(true);
        toast.success(res.message || 'GST number verified successfully!');

        const taxpayer = res.data?.taxpayerInfo;
        if (taxpayer) {
          const matchedCompany =
            taxpayer.tradeNam ||
            taxpayer.tradeName ||
            taxpayer.trade_name ||
            taxpayer.lgnm ||
            taxpayer.legalName;

          const addr = taxpayer.pradr?.addr;
          const addressParts = [
            addr?.bno,
            addr?.bnm,
            addr?.flno,
            addr?.st,
            addr?.locality,
            addr?.loc,
            addr?.landMark,
          ].filter(Boolean);

          const pncd = addr?.pncd ? String(addr.pncd).trim() : '';

          setEditForm((prev) => ({
            ...prev,
            company_name: matchedCompany ? String(matchedCompany).trim() : prev.company_name,
            address: addressParts.length > 0 ? addressParts.join(', ') : prev.address,
            city: addr?.dst ? String(addr.dst).trim() : prev.city,
            state: addr?.stcd ? String(addr.stcd).trim() : prev.state,
            pincode: pncd || prev.pincode,
          }));

          if (pncd && pncd.length === 6 && (!addr?.dst || !addr?.stcd)) {
            fetchPincodeDetails(pncd).then((pData) => {
              if (pData) {
                setEditForm((prev) => ({
                  ...prev,
                  city: prev.city || pData.city || pData.district || '',
                  state: prev.state || pData.state || '',
                  nationality: prev.nationality || pData.country || 'India',
                }));
              }
            });
          }
        }
      } else {
        setIsGstVerified(false);
        const dynamicMsg =
          res?.data?.message ||
          res?.message ||
          'Invalid GST number. Please verify and re-enter.';
        toast.error(dynamicMsg);
      }
    } catch (err: any) {
      setIsGstVerified(false);
      toast.error(err?.response?.data?.message || 'Error verifying GST number');
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const handleSaveBillingDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.full_name.trim()) {
      toast.error('Please enter Full Name');
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      toast.error('Please enter a valid Email Address');
      return;
    }
    if (!editForm.company_name.trim()) {
      toast.error('Please enter Company Name');
      return;
    }

    setIsUpdatingBillDetails(true);
    try {
      const res = await fetchBillDetailsUpdateProfile({
        full_name: editForm.full_name.trim(),
        company_name: editForm.company_name.trim(),
        email: editForm.email.trim(),
        address: editForm.address.trim(),
        pincode: editForm.pincode.trim(),
        nationality: editForm.nationality?.trim() || 'India',
        state: editForm.state.trim(),
        city: editForm.city.trim(),
        gst_number: editForm.gst_number.trim().toUpperCase(),
        number: editForm.number.trim(),
      });

      if (res && (res.status === 200 || res.status === '200' || res.status === true || res.status === 'success')) {
        toast.success(res.message || 'Billing details updated successfully!');
        await refetchPlanInfo();
        setIsEditBillingOpen(false);
      } else {
        toast.error(res?.message || 'Failed to update billing details');
      }
    } catch (err: any) {
      console.error('Error in handleSaveBillingDetails:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update billing details');
    } finally {
      setIsUpdatingBillDetails(false);
    }
  };

  // Minimum and maximum policies determined dynamically from policy_plan_info API
  // Decrement (-) can go down to min_policies; initial/renew count is shown from min_policies_for_renew
  const minAllowedPolicies = useMemo(() => {
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
          setQuoteError(null);
          toast.dismiss('quote-error');
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
          // Dynamic error handling - display error strictly via toast notification
          const dynamicMsg = res?.message || res?.data?.message || 'Failed to calculate quote for selected policies';
          setQuoteError(dynamicMsg);
          toast.error(dynamicMsg, { toastId: 'quote-error' });
          if (isCouponAction) {
            setIsCouponApplied(false);
            setAppliedCouponCode('');
          }
        }
      } catch (err: any) {
        console.error('Error fetching policy plan quote:', err);
        const dynamicMsg = err?.response?.data?.message || err?.data?.message || err?.message || 'Failed to calculate quote';
        setQuoteError(dynamicMsg);
        toast.error(dynamicMsg, { toastId: 'quote-error' });
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
      toast.dismiss();
      setQuoteError(null);
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

  // Current selected tier object from API response
  const currentTier = useMemo(() => {
    if (!planData?.tiers) return null;
    const tierName = quoteData?.tier || selectedPlanTier;
    return (
      planData.tiers.find((t) => t.name.toLowerCase() === tierName.toLowerCase()) ||
      planData.tiers[0] ||
      null
    );
  }, [planData, quoteData, selectedPlanTier]);

  // Current selected billing cycle object from API response
  const currentCycle = useMemo(() => {
    if (!planData?.cycles) return null;
    return planData.cycles.find((c) => c.billing_cycle === billingCycle) || planData.cycles[0] || null;
  }, [planData, billingCycle]);

  // Handler when user clicks on a Plan Tier card
  const handleSelectTier = (tierName: string) => {
    setSelectedPlanTier(tierName.toLowerCase());
    const tierObj = planData?.tiers?.find((t) => t.name.toLowerCase() === tierName.toLowerCase());
    if (tierObj) {
      const min = minAllowedPolicies;
      const max = maxAllowedPolicies;
      let nextCount = tierObj.from;
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
    if (quoteError) {
      toast.error(quoteError, { toastId: 'quote-error' });
      return;
    }
    setIsProcessingPayment(true);
    try {
      const res = await fetchPolicyPlanPurchase({
        policies: quoteData?.policies ?? policiesCount,
        billing_cycle: billingCycle,
        coupon_code: isCouponApplied ? appliedCouponCode : (couponCode.trim() || ''),
        full_name: displayFullName,
        email: displayEmail,
        company_name: displayCompanyName,
        address: displayFullAddress !== '—' ? displayFullAddress : displayAddress,
        gst_number: displayGst,
        number: displayMobile,
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
        onClick={() => {
          if (!isExpired && !isProcessingPayment) onClose();
        }}
      />

      {/* Main Modal Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200 z-10 text-slate-800 max-h-[96vh]">

        {/* Expired Warning Banner */}
        {isExpired && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-center text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0">
            <Crown size={14} className="text-amber-600 fill-amber-500" />
            <span>Your subscription has expired. Please select a plan and renew to continue uninterrupted access.</span>
          </div>
        )}

        {/* Close Button */}
        {!isExpired && (
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessingPayment}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all z-20 cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <X size={16} />
          </button>
        )}

        {/* Header */}
        <div className="py-2.5 px-5 sm:px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#2D3591]/10 text-[#2D3591] flex items-center justify-center shadow-xs">
              <Crown className="w-4 h-4 fill-[#2D3591]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Upgrade &amp; Renew Membership Plan
              </h2>
              <p className="text-[11px] text-slate-500">
                Scale your agency with automated renewal reminders, multi-line policy vault, and instant AI OCR credits.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 bg-slate-50/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {isLoadingPlans ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D3591]" />
              <span className="text-sm font-semibold text-slate-700">Loading policy plan details...</span>
            </div>
          ) : !planData || !planData.tiers || planData.tiers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-medium">
              No plan details available right now. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">

              {/* LEFT COLUMN: Plan Selection & Policy Volume (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-2.5">

                {/* Plan Tier Selection */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#2D3591]" />
                      1. Select Tier
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tier adjusts automatically based on policies
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
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
                            className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? 'border-[#2D3591] bg-indigo-50/50 shadow-xs ring-1 ring-[#2D3591]/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{plan.name}</div>
                                <div className="text-[11px] text-slate-500 font-normal mt-0.5">{rangeLabel}</div>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1 transition-all ${isSelected
                                  ? 'bg-[#2D3591] text-white'
                                  : 'border border-slate-300'
                                  }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">Rate:</span>
                              <span className="font-extrabold text-[#2D3591]">₹{plan.rate}/mo</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Policies Counter & Billing Cycle */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 items-center">

                    {/* Number of Policies */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs sm:text-[13px] font-bold text-slate-800 uppercase tracking-wider">
                          2. Number of Policies
                        </label>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          ₹{quoteData?.rate_per_policy ?? currentTier?.rate ?? 0}/mo
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const step = policiesCount > 1000 ? 100 : 50;
                            handlePoliciesStep(-step);
                          }}
                          disabled={policiesCount <= minAllowedPolicies}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors cursor-pointer shadow-2xs"
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
                            className="w-full h-9 sm:h-10 px-2 text-center rounded-xl border border-slate-200 bg-slate-50/60 font-bold text-sm text-slate-900 focus:outline-hidden focus:border-[#2D3591] focus:bg-white shadow-2xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const step = policiesCount >= 1000 ? 100 : 50;
                            handlePoliciesStep(step);
                          }}
                          disabled={policiesCount >= maxAllowedPolicies}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors cursor-pointer shadow-2xs"
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
                      <label className="block text-xs sm:text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
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
                                ? 'bg-[#2D3591] text-white shadow-xs font-bold'
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

                {/* Features Checklist (Evenly distributed to utilize full card height with zero dead space) */}
                {currentTier?.features && currentTier.features.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs flex-1 flex flex-col">
                    <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Plan Features Included in {currentTier.name}</span>
                    </div>
                    <div
                      className="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-2.5 pt-2.5 flex-1"
                      style={{ gridAutoRows: 'minmax(0, 1fr)' }}
                    >
                      {currentTier.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-indigo-50/30 transition-colors"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="leading-snug text-slate-700 font-medium text-xs truncate" title={feat}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Price Details & Payment Action (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-2.5">

                {/* Price Details Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#2D3591]" />
                      <h3 className="text-xs font-bold text-slate-900">Price Details</h3>
                    </div>
                    {isFetchingQuote && (
                      <span className="text-[10px] text-[#2D3591] flex items-center gap-1 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                      </span>
                    )}
                  </div>

                  {/* Active Plan Pill */}
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[#2D3591] text-[11px] font-semibold flex items-center justify-between">
                    <span className="truncate pr-1">
                      {quoteData?.plan_name ||
                        `${currentTier?.name || 'Silver'} - ${policiesCount} Policies - ${currentCycle?.label || 'Yearly'}`}
                    </span>
                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded shadow-2xs font-bold shrink-0">
                      {currentCycle?.multiplier || 1} mo
                    </span>
                  </div>

                  {/* Price Calculations Breakdown */}
                  <div className="space-y-1 text-xs">
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

                    <div className="pt-1.5 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">Total Payable</span>
                      <span className="text-xl font-black text-[#2D3591]">
                        {quoteData ? `₹${formatAmount(quoteData.final_amount)}` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-1.5 border-t border-slate-100">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Have a coupon code?
                    </label>
                    {isCouponApplied ? (
                      <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span>{appliedCouponCode}</span>
                          <span className="text-[10px] text-emerald-600 font-normal">
                            (-₹{quoteData?.coupon_amount || 0})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] text-xs uppercase"
                        />
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-3 py-1.5 rounded-lg bg-[#2D3591] hover:bg-[#222870] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                        >
                          {isApplyingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Security Assurance */}
                  <div className="p-1.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-medium leading-tight">
                      100% Secure Payment • Official Payment Gateway
                    </span>
                  </div>

                  {/* Proceed to Payment Action Button */}
                  <button
                    type="button"
                    onClick={handleProceedPayment}
                    disabled={isProcessingPayment || isFetchingQuote || !quoteData}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2D3591] hover:bg-[#222870] shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Payment Link...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          Pay Now {quoteData ? `— ₹${formatAmount(quoteData.final_amount)}` : ''}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[9px] text-slate-400">
                    Secured by SSL • Instant Activation on Payment Success
                  </div>
                </div>

                {/* Dynamic Billing & Account Details Card (from policy_plan_info bill_details) */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2D3591]" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                        Billing &amp; Account Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenEditBilling}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#2D3591] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                      title="Edit Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Dynamic Details 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-x-3.5 gap-y-2.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    {/* Full Name */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#2D3591]" /> Full Name
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayFullName || '—'}>
                        {displayFullName || '—'}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#2D3591]" /> Mobile
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayMobile || '—'}>
                        {displayMobile || '—'}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#2D3591]" /> Email
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayEmail || '—'}>
                        {displayEmail || '—'}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#2D3591]" /> Company
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayCompanyName || '—'}>
                        {displayCompanyName || '—'}
                      </div>
                    </div>

                    {/* GST Number */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-[#2D3591]" /> GST Number
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayGst || 'Not Provided'}>
                        {displayGst ? (
                          <span className="text-emerald-700 font-extrabold uppercase">{displayGst}</span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2D3591]" /> Address
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate mt-0.5" title={displayFullAddress || '—'}>
                        {displayFullAddress || '—'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

      {/* Edit Billing Details Sub-Modal */}
      {isEditBillingOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => !isUpdatingBillDetails && setIsEditBillingOpen(false)}
          />

          {/* Edit Dialog Box */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#2D3591]/10 text-[#2D3591] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Billing Details</h3>
                  <p className="text-xs text-slate-500">Update your account information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditBillingOpen(false)}
                disabled={isUpdatingBillDetails}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveBillingDetails} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editForm.full_name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={editForm.number}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, number: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10-digit mobile"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editForm.company_name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter company name"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    {isGstVerified && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Receipt className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={15}
                      value={editForm.gst_number}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, gst_number: e.target.value.toUpperCase() }));
                        setIsGstVerified(false);
                      }}
                      placeholder="15-character GSTIN (e.g. 24ABCDE1234F1Z5)"
                      className="w-full pl-8 pr-16 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs uppercase transition-all"
                    />
                    {editForm.gst_number.trim().length === 15 && !isGstVerified && (
                      <button
                        type="button"
                        onClick={handleVerifyGstInModal}
                        disabled={isVerifyingGst}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-white bg-[#2D3591] hover:bg-[#222870] rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isVerifyingGst ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Pincode, City, State 3-Col Row */}
                <div className="sm:col-span-2 grid grid-cols-3 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Pincode</label>
                      {isFetchingPincode && (
                        <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Fetching...
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={editForm.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="6-digit pincode"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address <span className="text-slate-400 font-normal">(Street / Office)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      rows={2}
                      value={editForm.address}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter street/office address"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditBillingOpen(false)}
                  disabled={isUpdatingBillDetails}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingBillDetails}
                  className="px-5 py-2 rounded-xl bg-[#2D3591] hover:bg-[#222870] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                >
                  {isUpdatingBillDetails ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save &amp; Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
