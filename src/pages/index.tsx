import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Shield,
  FileText,
  Users,
  Calculator,
  PhoneCall,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  LogIn,
  ChevronDown,
  Star,
  Activity,
  HeartPulse,
  Stethoscope,
  Car,
  Umbrella,
  Database,
  Lock,
  Zap,
  Check,
  TrendingUp,
  Clock,
  RefreshCw,
  Award,
  Menu,
  X,
  FileCheck2,
  Building2,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  BarChart3,
  MessageCircle,
  Laptop,
  Compass,
  Calendar,
  Globe2,
  Target,
  Smile,
  BadgeCheck,
  User,
  Tag,
  Crown,
  Percent,
  Headphones,
  Minus,
  Plus,
  Wallet,
  Receipt,
  Loader2
} from 'lucide-react';
import {
  useDirectPlanInfo,
  fetchDirectPlanQuote,
  DirectPlanQuoteData,
  fetchSendSignUpOtp,
  fetchDirectVerifyOtp,
  fetchDirectPlanPurchase,
} from '@/hooks/usePricingApi';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pricing & Payment Flow States (Powered purely by dynamic useDirectPlanInfo hook)
  const { data: planData, isLoading: isLoadingPlans } = useDirectPlanInfo();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<string>('silver');
  const [policiesCount, setPoliciesCount] = useState<number>(100);
  const [billingCycle, setBillingCycle] = useState<string>('yearly');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [quoteData, setQuoteData] = useState<DirectPlanQuoteData | null>(null);
  const [isMobileVerified, setIsMobileVerified] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [purchaseToken, setPurchaseToken] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [billingForm, setBillingForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    gstNumber: '',
    phone: '',
    companyAddress: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  });

  // Reusable quote loader that sends multipart/form-data to direct_plan_quote API
  const loadQuote = async (
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
      const res = await fetchDirectPlanQuote({
        policies: targetPolicies,
        billing_cycle: targetCycle,
        coupon_code: couponToUse,
      });

      if (res && (res.status === 200 || res.status === '200') && res.data && !Array.isArray(res.data)) {
        setQuoteData(res.data);
        if (res.data.tier) {
          setSelectedPlanTier(res.data.tier.toLowerCase());
        }
        if (couponToUse) {
          setAppliedCouponCode(couponToUse);
          setIsCouponApplied(true);
          if (isCouponAction) {
            toast.success(res.message || 'Coupon applied successfully!');
          }
        } else {
          setAppliedCouponCode('');
          setIsCouponApplied(false);
        }
      } else {
        if (isCouponAction) {
          toast.error(res?.message || 'Invalid coupon code');
        }
      }
    } catch (err: any) {
      console.error('Error fetching plan quote:', err);
      if (isCouponAction) {
        toast.error('Failed to apply coupon');
      }
    } finally {
      setIsFetchingQuote(false);
      setIsApplyingCoupon(false);
    }
  };

  // Automatically sync initial tier & policies count once dynamic API data loads
  useEffect(() => {
    if (planData?.tiers && planData.tiers.length > 0) {
      const paidTiers = planData.tiers.filter(t => !t.name.toLowerCase().includes('free'));
      const tiersToUse = paidTiers.length > 0 ? paidTiers : planData.tiers;
      const tierMatches = tiersToUse.some(t => t.name.toLowerCase() === selectedPlanTier.toLowerCase());
      if (!tierMatches) {
        setSelectedPlanTier(tiersToUse[0].name.toLowerCase());
        setPoliciesCount(tiersToUse[0].from || planData.min_policies || 100);
      }
    }
  }, [planData, selectedPlanTier]);

  const currentTier =
    planData?.tiers?.find(
      (t) =>
        t.name.toLowerCase() ===
        (quoteData?.tier?.toLowerCase() || selectedPlanTier.toLowerCase())
    ) ||
    planData?.tiers?.find((t) => t.name.toLowerCase() === selectedPlanTier.toLowerCase()) ||
    planData?.tiers?.[0];

  const currentCycle =
    planData?.cycles?.find((c) => c.billing_cycle === billingCycle) ||
    planData?.cycles?.[2] ||
    planData?.cycles?.[0];

  const monthsMultiplier = currentCycle?.multiplier || 1;
  const currentRate = currentTier?.rate ?? 0;
  const baseSubtotal = Math.round(policiesCount * currentRate * monthsMultiplier);
  const discountAmount = isCouponApplied ? Math.round(baseSubtotal * 0.05) : 0;
  const discountedSubtotal = Math.max(0, baseSubtotal - discountAmount);
  const gstRate = (planData?.gst_percentage ?? 18) / 100;
  const gstAmount = Math.round(discountedSubtotal * gstRate);
  const totalAmount = discountedSubtotal + gstAmount;

  const toggleCardExpand = (planId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [planId.toLowerCase()]: !prev[planId.toLowerCase()],
    }));
  };

  // Triggered when user clicks "Get Started" button on any pricing card
  const handleOpenPlanModal = (planTier: string) => {
    const tierLower = String(planTier).toLowerCase();
    if (tierLower === 'free' || tierLower.includes('free')) {
      router.push('/auth/register');
      return;
    }

    const paidTiers = planData?.tiers?.filter((t) => !t.name.toLowerCase().includes('free'));
    const foundTier = paidTiers?.find((t) => t.name.toLowerCase() === tierLower) || paidTiers?.[0] || planData?.tiers?.[0];
    const initialPolicies = foundTier?.from || planData?.min_policies || 100;

    if (foundTier) {
      setSelectedPlanTier(foundTier.name.toLowerCase());
      setPoliciesCount(initialPolicies);
    }
    setIsCouponApplied(false);
    setCouponCode('');
    setAppliedCouponCode('');
    setIsMobileVerified(false);
    setIsOtpSent(false);
    setOtpValue('');
    setPurchaseToken('');
    setPaymentSuccess(false);
    setPricingModalOpen(true);

    // Immediately call direct_plan_quote API via FormData with initial policies & cycle
    loadQuote(initialPolicies, billingCycle, '');
  };

  const handleSelectTier = (tierName: string) => {
    const tierLower = tierName.toLowerCase();
    if (tierLower === 'free' || tierLower.includes('free')) {
      setPricingModalOpen(false);
      router.push('/auth/register');
      return;
    }
    setSelectedPlanTier(tierLower);
    const foundTier = planData?.tiers?.find((t) => t.name.toLowerCase() === tierLower);
    if (foundTier) {
      const min = foundTier.from || planData?.min_policies || 100;
      const max = foundTier.to || planData?.max_policies || 1000000;
      let nextCount = policiesCount;
      if (nextCount < min) nextCount = min;
      if (max && nextCount > max) nextCount = max;
      setPoliciesCount(nextCount);
      loadQuote(nextCount, billingCycle, isCouponApplied ? appliedCouponCode : '');
    }
  };

  const handleSelectCycle = (cycle: string) => {
    setBillingCycle(cycle);
    loadQuote(policiesCount, cycle, isCouponApplied ? appliedCouponCode : '');
  };

  const handlePoliciesStep = (delta: number) => {
    const min = planData?.min_policies || 100;
    const max = planData?.max_policies || 1000000;
    const nextVal = Math.min(max, Math.max(min, policiesCount + delta));
    setPoliciesCount(nextVal);
    const matchedTier = planData?.tiers?.find((t) => {
      if (t.to !== null && t.to !== undefined) {
        return nextVal >= t.from && nextVal <= t.to;
      }
      return nextVal >= t.from;
    });
    if (matchedTier) {
      setSelectedPlanTier(matchedTier.name.toLowerCase());
    }
    loadQuote(nextVal, billingCycle, isCouponApplied ? appliedCouponCode : '');
  };

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply !== undefined ? codeToApply : couponCode).trim();
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }
    setCouponCode(code);
    await loadQuote(policiesCount, billingCycle, code, true);
  };

  const handleRemoveCoupon = async () => {
    setIsCouponApplied(false);
    setCouponCode('');
    setAppliedCouponCode('');
    await loadQuote(policiesCount, billingCycle, '');
    toast.info('Coupon removed');
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingForm.email.trim());
  const isBillingFormValid =
    billingForm.fullName.trim().length > 0 &&
    isEmailValid &&
    billingForm.companyName.trim().length > 0 &&
    billingForm.companyAddress.trim().length > 0 &&
    billingForm.pincode.trim().length >= 6 &&
    billingForm.city.trim().length > 0 &&
    billingForm.state.trim().length > 0 &&
    isMobileVerified &&
    Boolean(purchaseToken);

  const handleSendOtp = async () => {
    const cleanPhone = billingForm.phone.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetchSendSignUpOtp(cleanPhone);
      if (res && (res.status === 200 || res.status === '200' || res.status === true)) {
        toast.success(res.message || 'OTP sent successfully!');
        setIsOtpSent(true);
        if (res.data?.otp) {
          setOtpValue(String(res.data.otp));
        }
      } else {
        toast.error(res?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Error sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanPhone = billingForm.phone.trim();
    const cleanOtp = otpValue.trim();
    if (!cleanOtp) {
      toast.error('Please enter the OTP');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await fetchDirectVerifyOtp({ number: cleanPhone, otp: cleanOtp });
      if (res && (res.status === 200 || res.status === '200' || res.status === true)) {
        toast.success(res.message || 'Mobile number verified successfully!');
        setIsMobileVerified(true);
        if (res.data?.purchase_token) {
          setPurchaseToken(res.data.purchase_token);
        }
      } else {
        toast.error(res?.message || 'Invalid OTP');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Error verifying OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 10);
    setBillingForm((prev) => ({ ...prev, phone: numeric }));
    if (isMobileVerified || isOtpSent || purchaseToken) {
      setIsMobileVerified(false);
      setIsOtpSent(false);
      setOtpValue('');
      setPurchaseToken('');
    }
  };

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setBillingForm((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      try {
        const formData = new FormData();
        formData.append('pincode', clean);
        const res = await api.post(endPointApi.CUSTOMER.GET_PINCODE_DETAILS, formData);
        if (res?.data?.data) {
          const pData = res.data.data;
          setBillingForm((prev) => ({
            ...prev,
            pincode: clean,
            city: pData.city || pData.district || prev.city,
            state: pData.state || prev.state,
          }));
        }
      } catch (err) {
        // user can still type city/state manually
      }
    }
  };

  const handlePayNow = async () => {
    if (!isBillingFormValid || !purchaseToken) {
      if (!isMobileVerified || !purchaseToken) {
        toast.error('Please verify your mobile number with OTP first');
      } else {
        toast.error('Please fill all required billing details');
      }
      return;
    }

    setIsProcessingPayment(true);
    try {
      const res = await fetchDirectPlanPurchase({
        purchase_token: purchaseToken,
        full_name: billingForm.fullName.trim(),
        email: billingForm.email.trim(),
        company_name: billingForm.companyName.trim(),
        address: billingForm.companyAddress.trim(),
        gst_number: billingForm.gstNumber.trim(),
        pincode: billingForm.pincode.trim(),
        state: billingForm.state.trim(),
        city: billingForm.city.trim(),
        country: billingForm.country.trim() || 'India',
        policies: quoteData?.policies ?? policiesCount,
        billing_cycle: billingCycle,
        coupon_code: isCouponApplied ? appliedCouponCode : (couponCode.trim() || ''),
      });

      if (res && (res.status === 200 || res.status === '200' || res.status === true)) {
        toast.success(res.message || 'Payment request processed successfully!');
        const redirectUrl = res.data?.redirect_url || res.redirect_url || res.data?.url || res.url;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
        setPaymentSuccess(true);
      } else {
        toast.error(res?.message || 'Failed to complete plan purchase');
      }
    } catch (err: any) {
      console.error('Error during direct_plan_purchase:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Error processing plan purchase');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Fast debounce API quote call for manual numeric input (200ms for instant responsiveness)
  useEffect(() => {
    if (!pricingModalOpen) return;
    const timer = setTimeout(() => {
      if (
        quoteData &&
        (quoteData.policies !== policiesCount || quoteData.billing_cycle !== billingCycle)
      ) {
        loadQuote(policiesCount, billingCycle, isCouponApplied ? appliedCouponCode : '');
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [policiesCount, pricingModalOpen, billingCycle, isCouponApplied, appliedCouponCode, quoteData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleRegisterClick = () => {
    router.push('/auth/register');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-800 font-sans antialiased selection:bg-[#2D3591] selection:text-white">
      <Head>
        <title>Insuraa - All-in-One Insurance Agency Management Software</title>
        <meta
          name="description"
          content="Insuraa is India's modern cloud-based Insurance Management Platform. AI-powered policy extraction, automated renewal reminders, multi-line policy vault, lead pipelines, quotations, and claims."
        />
        <meta
          name="keywords"
          content="Insurance Management Software, Insurance CRM India, Policy Tracking, Renewal Reminder Software, AI Policy Reader, Motor Quotation, Health Insurance CRM, POSP Portal"
        />
        <link rel="icon" href="/favicon_img.png" />
      </Head>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Insuraa Logo"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-[#2D3591] transition-colors">
              About Insuraa
            </a>
            <a href="#with-vs-without" className="hover:text-[#2D3591] transition-colors flex items-center gap-1 font-medium">
              <span className="text-[#2BBF8C] font-medium">With</span> vs Without
            </a>
            <a href="#features" className="hover:text-[#2D3591] transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-[#2D3591] transition-colors">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-[#2D3591] transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-[#2D3591] transition-colors">
              Contact &amp; Map
            </a>
            <a href="#faq" className="hover:text-[#2D3591] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleDashboardClick}
                id="navbar-dashboard-btn"
                className="inline-flex items-center gap-2 bg-[#2D3591] hover:bg-[#222870] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Prominent Login Button */}
                <button
                  onClick={handleLoginClick}
                  id="navbar-login-btn"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#2D3591] bg-indigo-50 hover:bg-[#2D3591] hover:text-white border border-[#2D3591]/25 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#2D3591] group-hover:text-white transition-colors" />
                  <span>Login</span>
                </button>

                {/* Free Demo / Register Button */}
                <button
                  onClick={handleRegisterClick}
                  id="navbar-demo-btn"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2BBF8C] to-[#1EA376] hover:from-[#24aa7c] hover:to-[#1a8e67] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span>Start Free Trial</span>
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              About Insuraa
            </a>
            <a
              href="#with-vs-without"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              With Insuraa vs Without Insuraa
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Insurance Solutions
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Pricing
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Contact &amp; Location Map
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleLoginClick}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-[#2D3591] hover:bg-[#222870] shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </button>
              <button
                onClick={handleRegisterClick}
                className="w-full flex items-center justify-center py-2.5 rounded-xl font-medium text-[#2D3591] bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Register Agency</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION (Strict 2-Line Headline, Medium Weights, Clean Modern Balance) */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-indigo-50/40 to-[#F8FAFD]">

        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#2D3591]/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
        <div className="absolute top-36 right-10 w-96 h-96 bg-[#2BBF8C]/15 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Column (7 cols): Exactly 2-Line Headline, Medium Typography, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              {/* Badge with pulse dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs hover:border-[#2D3591] transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2BBF8C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2BBF8C]"></span>
                </span>
                <span className="text-xs font-medium text-slate-700 tracking-wide">
                  AI-Powered Insurance Operating System
                </span>
              </div>

              {/* Strict 2-Line Headline with Medium/Semibold Weight */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-semibold text-slate-900 tracking-tight leading-[1.25]">
                <span className="block whitespace-normal sm:whitespace-nowrap">Smart Insurance Agency CRM &amp;</span>
                <span className="block whitespace-normal sm:whitespace-nowrap bg-gradient-to-r from-[#2D3591] via-[#3B49B8] to-[#2BBF8C] bg-clip-text text-transparent">
                  AI-Powered Policy Platform
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Upload any policy PDF and let AI auto-extract 35+ fields in <span className="font-medium text-slate-900">5 seconds</span>. Manage Life, Health, Motor &amp; Commercial policies, automated WhatsApp renewals, and visual lead pipelines.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Main Prominent Login Button */}
                <button
                  onClick={handleLoginClick}
                  id="hero-login-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#2D3591] to-[#3B49B8] hover:from-[#242b78] hover:to-[#2D3591] text-white px-8 py-3.5 rounded-xl font-medium text-sm sm:text-base shadow-lg shadow-indigo-950/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-emerald-300" />
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 text-slate-300" />
                </button>

                {/* Free Demo / Register */}
                <button
                  onClick={handleRegisterClick}
                  id="hero-demo-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-[#2BBF8C] px-7 py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#2BBF8C]" />
                  <span>Start Free Trial</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2BBF8C]" /> 5-Second AI Read
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2BBF8C]" /> Instant Mobile OTP Login
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2BBF8C]" /> Life, Health, Motor &amp; Commercial
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Hero Image with 3D Float */}
            <div className="lg:col-span-5 relative flex justify-center items-center">

              {/* Outer Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-emerald-500/15 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Centerpiece 3D Hero Image with Floating Animation */}
              <div className="relative group w-full max-w-lg">
                <img
                  src="/images/hero_image.png"
                  alt="Insuraa AI Policy Extraction and Management Platform"
                  className="w-full h-auto object-contain drop-shadow-2xl animate-hero-float select-none transition-transform duration-500"
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Partners / Insurer Logos Strip */}
      <section className="bg-white border-y border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-400 mb-4">
            Unified Cloud Support For All Leading Indian Insurance Carriers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600">
            {['HDFC ERGO', 'Star Health', 'ICICI Lombard', 'Tata AIG', 'Care Health', 'Bajaj Allianz', 'LIC of India', 'National Insurance'].map((brand, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-[#2D3591] rounded-lg border border-slate-200/80 shadow-2xs transition-all cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WITH INSURAA VS WITHOUT INSURAA (Balanced Height & Premium Spacing) */}
      <section id="with-vs-without" className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">

        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-88 bg-gradient-to-r from-rose-100/25 via-transparent to-emerald-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50 border border-indigo-200 px-3.5 py-1 rounded-full">
              Why Switch to Insuraa
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
              Traditional Agency vs Powered by Insuraa
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-normal">
              The side-by-side reality of managing insurance on spreadsheets versus an automated AI agency operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

            {/* WITHOUT INSURAA CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/90 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold text-lg shadow-2xs">
                      ✕
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Without Insuraa</h3>
                      <p className="text-xs text-rose-600 font-normal">Slow, manual, and prone to costly errors</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    High Friction
                  </span>
                </div>

                {/* Pain Points with Moderate Spacing */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-normal">
                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">15–20 Mins Manual Entry:</span> Staff re-types 30+ fields per PDF schedule; high typo dispute risk.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Lost &amp; Lapsed Renewals:</span> No automatic reminder radar; 30%+ clients slip away to competitors.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Scattered Files:</span> Records split across separate Excel sheets, paper diaries &amp; WhatsApp.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Chaotic Claims:</span> Hospital discharge summaries, queries &amp; surveyor numbers lost in inbox.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Zero Data Protection:</span> Staff can export full client lists and sensitive commission payouts.
                    </div>
                  </div>
                </div>

              </div>

              {/* Footnote inside Card */}
              <div className="pt-4 border-t border-rose-100 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50/40 py-3 px-4 rounded-xl">
                <span>⚠️ Causes 30–40% loss in annual agency revenue</span>
              </div>

            </div>

            {/* WITH INSURAA CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-md space-y-5 flex flex-col justify-between relative ring-4 ring-emerald-500/10 hover:shadow-xl transition-all">

              <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold text-lg shadow-2xs">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">With Insuraa</h3>
                      <p className="text-xs text-emerald-600 font-normal">Fast, automated, unified, and error-free</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    98% Retention
                  </span>
                </div>

                {/* Benefits with Moderate Spacing */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-normal">
                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">5-Sec AI Policy Read:</span> Upload any PDF schedule; auto-extracts 35+ fields in 5 seconds.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Automated Renewal Radar:</span> WhatsApp &amp; SMS sent at 30, 15, and 3 days before expiry.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Unified 360° Vault:</span> Life, Health, Motor &amp; Commercial grouped by household family.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Live Claim Timeline:</span> End-to-end status from intimation to surveyor &amp; bank credit.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Role-Based Security:</span> Admin locks commission reports while staff safely manage leads.
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button inside Card */}
              <div className="pt-4 border-t border-emerald-100">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#2D3591] to-[#3B49B8] hover:from-[#242b78] hover:to-[#2D3591] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-300" />
                  <span>Login to Your Agency Account</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ABOUT INSURAA SECTION (Truly Unique, Modern Bento Architecture with Interactive Process Bar & Glowing Accents) */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">

        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#2D3591_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto space-y-3.5 mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50/90 border border-indigo-200/80 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#2BBF8C]" />
              <span>About Insuraa • Shopno Ecommerce Pvt Ltd</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Architected for India&apos;s Fastest Growing Insurance Agencies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Crafted in Surat, Gujarat to eliminate repetitive paperwork and unlock exponential growth for insurance advisors, broking networks, and POSPs.
            </p>
          </div>

          {/* Top Bento Row: Story Card (7 Cols) + High-Tech Stats Card (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">

            {/* Left Story Card */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#F9FBFF] via-white to-indigo-50/30 rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden">

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2D3591] bg-white border border-indigo-100 px-3 py-1 rounded-lg">
                  <Compass className="w-3.5 h-3.5 text-[#2BBF8C]" />
                  <span>Our Mission &amp; Purpose</span>
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 leading-snug">
                  Built to empower advisors to spend less time typing schedules and more time closing policies.
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Insuraa was founded by <span className="font-medium text-slate-900">Shopno Ecommerce Pvt Ltd</span> in Surat, Gujarat. Indian insurance agents routinely lose 40% of their business day manually entering PDF schedules, tracking renewal dates on paper diaries, and juggling scattered WhatsApp chats.
                </p>

                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  By uniting computer-vision AI extraction with a multi-line customer registry (Life, Health, Motor, Commercial), Insuraa transforms chaotic manual paperwork into an automated, error-free operation.
                </p>
              </div>

              {/* Interactive Process Flow Capsule */}
              <div className="p-3.5 bg-white/90 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>How Insuraa Operates In Practice</span>
                  <span className="text-[#2BBF8C]">● Instant Workflow</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-slate-700">
                  <div className="p-2 bg-indigo-50/60 rounded-xl border border-indigo-100/60">
                    <span className="block text-[10px] text-[#2D3591]">Step 1</span>
                    <span className="text-slate-800">📄 Upload PDF</span>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
                    <span className="block text-[10px] text-[#2BBF8C]">Step 2 (5s)</span>
                    <span className="text-slate-800">⚡ AI Auto-Fill</span>
                  </div>
                  <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100/60">
                    <span className="block text-[10px] text-blue-600">Step 3</span>
                    <span className="text-slate-800">💬 Auto-Renewal</span>
                  </div>
                </div>
              </div>

              {/* Value Pills */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2.5 text-xs text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                  <Zap className="w-3.5 h-3.5 text-[#2BBF8C]" /> 5-Sec AI OCR Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D3591]" /> 100% Data Sovereignty
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Gujarati &amp; Hindi Desk
                </span>
              </div>

              {/* Surat Headquarters Status Bar */}
              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-slate-800">
                    Surat Operations Center: Mota Varachha, Surat, Gujarat
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium hidden sm:inline">Active &amp; Live</span>
              </div>

            </div>

            {/* Right Tech Metrics Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#12163A] via-[#1E2568] to-[#121840] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">

              {/* Background ambient ring */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Platform Scale
                  </span>
                  <span className="text-xs text-slate-300 font-normal">Across 18+ States</span>
                </div>

                <h4 className="text-xl font-semibold text-white">
                  Trusted Agency Infrastructure
                </h4>

                {/* 2x2 Clean Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl sm:text-3xl font-semibold text-emerald-400">100K+</div>
                    <div className="text-xs text-slate-300 font-normal mt-1">Policies Digitized</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl sm:text-3xl font-semibold text-amber-300">₹85Cr+</div>
                    <div className="text-xs text-slate-300 font-normal mt-1">Gross Premium Tracked</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl sm:text-3xl font-semibold text-indigo-300">1,200+</div>
                    <div className="text-xs text-slate-300 font-normal mt-1">Active Advisors &amp; POSPs</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl sm:text-3xl font-semibold text-cyan-300">99.4%</div>
                    <div className="text-xs text-slate-300 font-normal mt-1">AI Extraction Precision</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Login CTA inside dark card */}
              <div className="pt-2 relative z-10">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 px-4 rounded-xl text-xs font-medium text-[#161B46] bg-white hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#2D3591]" />
                  <span>Access Agency Cloud Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2D3591]" />
                </button>
              </div>

            </div>

          </div>

          {/* Lower Bento Row: 4 Specialized Architectural Pillars with Sleek Top Colored Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Pillar 1: AI Innovation */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border-t-2 border-t-[#2D3591] border-x border-b border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#2D3591] flex items-center justify-center font-medium group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-medium text-slate-900">Next-Gen Policy OCR</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Continuous AI computer-vision trained on schedules from all 30+ Indian carriers for 5-second automatic data entry.
              </p>
            </div>

            {/* Pillar 2: 360° Household Vault */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border-t-2 border-t-[#2BBF8C] border-x border-b border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#2BBF8C] flex items-center justify-center font-medium group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-medium text-slate-900">Household Family Vault</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Group Life, Health, Motor, and Fire policies under a single family graph to effortlessly identify cross-selling opportunities.
              </p>
            </div>

            {/* Pillar 3: Bank-Grade Privacy */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border-t-2 border-t-blue-500 border-x border-b border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-medium group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-medium text-slate-900">Zero-Trust Privacy</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                256-bit SSL encryption. Zero selling or cross-marketing of your client records. Your customer data remains 100% private.
              </p>
            </div>

            {/* Pillar 4: Dedicated Surat Support */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border-t-2 border-t-amber-500 border-x border-b border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-medium group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="text-base font-medium text-slate-900">Dedicated Regional Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Dedicated telephone &amp; WhatsApp onboarding in Gujarati, Hindi, and English straight from our Surat headquarters.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CORE PLATFORM FEATURES (Using Genuine Images from /images) */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2BBF8C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Built For Indian Agencies
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Powerful Features That Power Your Agency
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Every tool you need to run, scale, and automate your insurance operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Feature 1: AI Policy Extraction */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/policy_pdf_illustration.jpg" alt="AI Policy Extraction" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">AI-Powered Policy Extraction</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Upload policy schedule PDFs from any insurer. Our AI model reads unstructured text and tables, auto-filling 35+ fields in 5 seconds.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>99.4% Extraction Accuracy</span> &rarr;
              </div>
            </div>

            {/* Feature 2: Multi-Line Policy Management */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/insurance-policy.png" alt="Multi-Line Policies" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Multi-Line Policy Vault</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Life, Health, Motor, and Commercial policies in one unified system. Filter by insurer, renewal date, agency code, or policy status.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>Centralized Cloud Storage</span> &rarr;
              </div>
            </div>

            {/* Feature 3: Smart Renewal Radar */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/Renewal.png" alt="Smart Renewals" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Smart Renewal Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Track upcoming and expired policies. Automatically notify clients on WhatsApp with renewal quotes 30, 15, and 3 days prior.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>45% Higher Retention</span> &rarr;
              </div>
            </div>

            {/* Feature 4: Visual Lead Kanban */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/lead.png" alt="Lead Kanban Pipeline" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Visual Lead Pipeline (Kanban)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Track inquiries across customized stages (New, In Progress, Quoted, Won). Switch seamlessly between Kanban cards and AG-Grid data tables.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>Interactive Stage Dragging</span> &rarr;
              </div>
            </div>

            {/* Feature 5: Instant Quotations */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/Quotation.png" alt="Instant Quotation Engine" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Instant Quotation Engine</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Generate Motor and Health comparison quotes. Compare IDV, NCB, and add-on covers side-by-side, and send branded PDF sheets to clients.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>Branded Agency Quotes</span> &rarr;
              </div>
            </div>

            {/* Feature 6: End-to-End Claim Management */}
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#2D3591] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 p-3 shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/images/claim.png" alt="Claim Management" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Complete Claim Tracker</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Never lose track of a client’s claim. Live timeline from intimation, surveyor coordination, query resolution, to final bank credit.
              </p>
              <div className="text-xs font-medium text-[#2D3591] flex items-center gap-1 pt-1">
                <span>Faster Claim Settlements</span> &rarr;
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INSURANCE SOLUTIONS GRID */}
      <section id="solutions" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Full Spectrum Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              One Single Platform For All Insurance Categories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Customized fields, validation, and calculations tailored for every major line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Life Insurance */}
            <div className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-rose-400 transition-all duration-300 hover:-translate-y-1 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6 animate-icon-heartbeat" />
              </div>
              <h4 className="text-lg font-medium text-slate-900">Life Insurance</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Term Insurance, ULIPs, Endowment, and Money-back plans. Track PPT, maturity schedules, surrender values, and nominee registry.
              </p>
            </div>

            {/* Health Insurance */}
            <div className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6 animate-icon-stethoscope" />
              </div>
              <h4 className="text-lg font-medium text-slate-900">Health Insurance</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Individual &amp; Family Floater plans. Member age matrices, pre-existing condition logs, cumulative bonus, and cashless hospital networks.
              </p>
            </div>

            {/* Motor Insurance */}
            <div className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6 animate-icon-car" />
              </div>
              <h4 className="text-lg font-medium text-slate-900">Motor Insurance</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Private Cars, 2-Wheelers, and Commercial Fleets (GCW/PCCV). Instant IDV valuation, NCB bonus protection, and Zero-Dep add-ons.
              </p>
            </div>

            {/* General & Commercial */}
            <div className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Umbrella className="w-6 h-6 animate-icon-umbrella" />
              </div>
              <h4 className="text-lg font-medium text-slate-900">General &amp; Commercial</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Fire &amp; Special Perils, Shopkeeper packages, Marine Cargo, Contractor All Risk, and Workmen Compensation for business clients.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SUBSCRIPTION & PRICING PLANS (Direct Plan Info API with Dynamic Tiers & Features) */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header with Wavy Curve */}
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-14">
            <div className="inline-block">
              <span className="text-sm font-semibold text-slate-800 tracking-wide block">
                Simple, Transparent Pricing
              </span>
              <svg className="w-16 h-2 text-[#2D3591] mx-auto mt-0.5" viewBox="0 0 64 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5C18 1 46 8 62 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight pt-1">
              Choose The Best Plan, <span className="text-[#2D3591]">For Your Agency</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm font-normal pt-1">
              Start your{' '}
              <span className="inline-block px-3 py-0.5 bg-indigo-50 border border-indigo-200/90 text-[#2D3591] rounded-lg font-medium text-xs sm:text-sm mx-1">
                {planData?.free_trial_days || 7}-day free trial
              </span>{' '}
              and experience all the features risk-free.
            </p>

            {planData?.first_purchase_free_ai_credits === 'equal_to_policies' && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  First purchase bonus: Free AI Credits equal to your policy count
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Cards Responsive Grid */}
          {isLoadingPlans || !planData?.tiers ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D3591]" />
              <span className="text-sm font-medium">Loading pricing plans...</span>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${planData.tiers.length === 3 ? 'md:grid-cols-3 max-w-6xl' : 'md:grid-cols-2 xl:grid-cols-4 max-w-7xl'} gap-6 mx-auto items-stretch`}>
              {planData.tiers.map((tier) => {
                const isHighlighted = tier.name.toLowerCase() === 'gold';
                const isExpanded = !!expandedCards[tier.name.toLowerCase()];
                const visibleFeatures = isExpanded ? tier.features : tier.features.slice(0, 7);
                const remainingCount = tier.features.length - 7;
                const policyRangeText = tier.to
                  ? `${tier.from.toLocaleString()} - ${tier.to.toLocaleString()} policies`
                  : `${tier.from.toLocaleString()}+ policies`;

                return (
                  <div
                    key={tier.name}
                    className={
                      isHighlighted
                        ? 'bg-gradient-to-b from-[#1C2366] via-[#1E2568] to-[#141A4C] text-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative ring-4 ring-indigo-500/20 hover:scale-[1.02] transition-all duration-300'
                        : 'bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group'
                    }
                  >
                    {/* Floating BEST MATCH Badge for Gold */}
                    {isHighlighted && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#1E2568] text-[11px] font-semibold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-indigo-100">
                        <span className="w-2 h-2 rounded-full bg-[#2BBF8C] animate-ping" />
                        <span>BEST MATCH</span>
                      </span>
                    )}

                    <div>
                      {/* Top Row: Plan Name & Policy Range */}
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xl font-semibold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                          {tier.name}
                        </h3>
                        <span
                          className={
                            isHighlighted
                              ? 'text-xs text-white/90 bg-white/15 px-3 py-1 rounded-full font-normal border border-white/10'
                              : 'text-xs text-slate-500 font-normal bg-slate-100 px-2.5 py-0.5 rounded-full'
                          }
                        >
                          {policyRangeText}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-3xl sm:text-4xl font-semibold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                          ₹{tier.rate}
                        </span>
                        <span className={`text-xs ${isHighlighted ? 'text-white/70' : 'text-slate-400'} font-normal`}>
                          /policy/mo
                        </span>
                      </div>

                      <div className={`text-[11px] mt-1 ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {tier.to
                          ? `₹${Math.round(tier.from * tier.rate)} - ₹${Math.round(tier.to * tier.rate)}/mo based on policies`
                          : `Starts at ₹${Math.round(tier.from * tier.rate)}/mo for ${tier.from}+ policies`}
                      </div>

                      <div className={`my-5 border-t ${isHighlighted ? 'border-white/15' : 'border-slate-100'}`} />

                      {/* Features List */}
                      <ul className={`space-y-3 text-xs sm:text-[13px] ${isHighlighted ? 'text-white/90' : 'text-slate-600'} font-normal`}>
                        {visibleFeatures.map((feat, featIdx) => (
                          <li key={featIdx} className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${isHighlighted ? 'bg-white/20 text-white' : 'bg-indigo-50 text-[#2D3591]'
                                }`}
                            >
                              ✓
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* + More / Show Less Button */}
                      {tier.features.length > 7 && (
                        <div className="text-right pt-3">
                          <button
                            onClick={() => toggleCardExpand(tier.name)}
                            className={`text-xs font-medium cursor-pointer ${isHighlighted ? 'text-emerald-300 hover:text-white hover:underline' : 'text-[#2D3591] hover:underline'
                              }`}
                          >
                            {isExpanded ? '- Show Less' : `+ ${remainingCount} More`}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Get Started Button */}
                    <button
                      id={`get-started-${tier.name.toLowerCase()}-btn`}
                      onClick={() => handleOpenPlanModal(tier.name)}
                      className={`mt-6 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer ${isHighlighted
                        ? 'text-[#1E2568] bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl'
                        : 'text-[#2D3591] bg-indigo-50/70 hover:bg-[#2D3591] hover:text-white border border-indigo-200/80'
                        }`}
                    >
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* CONTACT US & INTERACTIVE GOOGLE MAP LOCATION (Embedded SHOPNO ECOMMERCE PVT LTD) */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2D3591]" /> Our Location &amp; Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Visit Insuraa Headquarters or Get in Touch
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Have questions about agency onboarding or need a custom demonstration? We are right here in Surat to help you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Contact Information Card */}
            <div className="lg:col-span-5 bg-slate-50/90 rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Shopno Ecommerce Pvt Ltd</h3>
                  <p className="text-xs font-medium text-[#2D3591] mt-0.5">Creators &amp; Operators of Insuraa OS</p>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-700">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#2D3591] flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-medium">Office Address:</span>
                      <span className="text-slate-600 leading-relaxed block mt-0.5 font-normal">
                        2nd Floor, Shreenathji Bungalow, 6, Peddar Rd, near Raghuvir Shoppers, Mota Varachha, Surat, Gujarat 394101
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2BBF8C] flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-medium">Call &amp; WhatsApp Support:</span>
                      <a href="tel:+918866779008" className="text-[#2D3591] font-medium text-sm hover:underline block mt-0.5">
                        +91 8866779008
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-medium">Official Email:</span>
                      <a href="mailto:contact@insuraa.in" className="text-[#2D3591] font-medium hover:underline block mt-0.5">
                        contact@insuraa.in
                      </a>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-medium">Operating Hours:</span>
                      <span className="text-slate-600 block mt-0.5 font-normal">
                        Monday – Saturday: 9:30 AM – 7:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLoginClick}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#2D3591] hover:bg-[#222870] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Portal</span>
                </button>
                <a
                  href="https://maps.app.goo.gl/35b3J6ZzG4i9Qh2L9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-[#2BBF8C]" />
                  <span>Get Directions</span>
                </a>
              </div>

            </div>

            {/* Right Embedded Google Map */}
            <div className="lg:col-span-7 relative flex flex-col justify-center">
              <div className="relative w-full h-[450px] lg:h-full min-h-[420px] rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-xl group">

                {/* Floating Top Label */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>SHOPNO ECOMMERCE PVT LTD • Insuraa HQ</span>
                </div>

                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4614.528907291065!2d72.888763!3d21.242198700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f632203420b%3A0xbcc07ea91cb79d08!2sSHOPNO%20ECOMMERCE%20PVT%20LTD!5e1!3m2!1sen!2sin!4v1791951989388!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Insuraa Office Location - SHOPNO ECOMMERCE PVT LTD Surat"
                  className="w-full h-full min-h-[420px] rounded-3xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How do I log in to my existing Insuraa agency portal?',
                a: 'Click on the "Login" button on the top right header. Enter your registered 10-digit mobile number, choose your account role (Admin or Staff), and verify with the instant OTP sent to your phone. No passwords required.'
              },
              {
                q: 'How does the AI Policy PDF Reader extract data in 5 seconds?',
                a: 'Insuraa uses a specialized computer vision and OCR model trained on all major Indian insurance schedules. Simply upload the issued PDF, and it automatically reads the policy number, customer name, vehicle registration, IDV, premium, and expiry date.'
              },
              {
                q: 'Does Insuraa support Life, Health, Motor, and Commercial policies?',
                a: 'Yes. Insuraa supports Life Insurance as well as multiple General Insurance lines such as Health, Motor (Cars, 2-Wheelers & Fleets), Fire, Marine, Shopkeeper, and Travel.'
              },
              {
                q: 'Can Insuraa track policy renewals and send automated reminders?',
                a: 'Yes. Insuraa features a renewal radar that alerts you to policies expiring in 30, 15, and 3 days, with automated WhatsApp and SMS follow-ups for high client retention.'
              },
              {
                q: 'Can I separate what my staff members can access?',
                a: 'Yes. Role-based permissions allow agency administrators to let staff manage policies, leads, and quotes without seeing master financial commission reports or sensitive agency data.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between text-sm font-medium text-slate-800 hover:text-[#2D3591] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${openFaq === idx ? 'rotate-180 text-[#2D3591]' : ''
                      }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM HIGH-IMPACT CTA BANNER */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[#171E57] via-[#2D3591] to-[#1A775C] text-white">

        {/* Glow elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#2BBF8C]/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-emerald-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Transform Your Insurance Business
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
            Ready to Manage Your Insurance Agency Digitally?
          </h2>

          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Eliminate manual paperwork, retain more renewals, and automate your entire policy workflow with Insuraa today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            {/* Primary Login Button */}
            <button
              onClick={handleLoginClick}
              id="footer-cta-login-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#2D3591] hover:bg-slate-100 px-8 py-4 rounded-xl font-medium text-base shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-5 h-5 text-[#2D3591]" />
              <span>Login to Agency Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Free Trial Button */}
            <button
              onClick={handleRegisterClick}
              id="footer-cta-demo-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2BBF8C] hover:bg-[#239f74] text-white px-8 py-4 rounded-xl font-medium text-base shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Start 14-Day Free Trial</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 pt-1 font-normal">
            Instant Mobile OTP verification • No credit card required • Full cloud security
          </p>
        </div>
      </section>

      {/* SUPER UNIQUE & ATTRACTIVE FOOTER */}
      <footer className="bg-gradient-to-b from-[#0F172A] via-[#0D1326] to-[#080C1B] text-slate-400 text-xs relative overflow-hidden">

        {/* Top Glowing Beam */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2BBF8C] to-[#2D3591]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">

            {/* Col 1: Brand & Identity (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              <Link href="/" className="inline-block">
                <img src="/white_logo.png" alt="Insuraa" className="h-10 w-auto object-contain" />
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
                Insuraa is India’s next-generation Insurance Agency Management System &amp; CRM. Engineered by Shopno Ecommerce Pvt Ltd to empower advisors, broking networks, and POSP teams with AI-driven automation.
              </p>

              {/* Security Credential Badges */}
              <div className="pt-1 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit Bank-Grade SSL Data Encryption</span>
                </div>
                <div className="block text-[11px] text-slate-400 font-normal">
                  <span>✓ 100% IRDAI Standard Compliant Workflows</span>
                </div>
              </div>
            </div>

            {/* Col 2: Solutions (2.5 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-medium text-white uppercase tracking-wider border-l-2 border-[#2BBF8C] pl-2.5">
                Insurance Solutions
              </h4>
              <ul className="space-y-2.5 text-xs font-normal">
                <li><Link href="/insurance/life" className="hover:text-white transition-colors flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Life Insurance Management</Link></li>
                <li><Link href="/insurance/health" className="hover:text-white transition-colors flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> Health &amp; Family Floaters</Link></li>
                <li><Link href="/insurance/motor" className="hover:text-white transition-colors flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-blue-400" /> Motor &amp; Commercial Fleets</Link></li>
                <li><Link href="/insurance/other" className="hover:text-white transition-colors flex items-center gap-1.5"><Umbrella className="w-3.5 h-3.5 text-amber-400" /> Commercial, Marine &amp; Fire</Link></li>
                <li><Link href="/claim" className="hover:text-white transition-colors flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5 text-indigo-400" /> Complete Claim Tracker</Link></li>
              </ul>
            </div>

            {/* Col 3: Key Features (2.5 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-medium text-white uppercase tracking-wider border-l-2 border-[#2D3591] pl-2.5">
                Key Features
              </h4>
              <ul className="space-y-2.5 text-xs font-normal">
                <li><a href="#features" className="hover:text-white transition-colors">AI Policy OCR Reader</a></li>
                <li><Link href="/manage-leads" className="hover:text-white transition-colors">Visual Lead Kanban</Link></li>
                <li><Link href="/quotation/health" className="hover:text-white transition-colors">Instant Health Quotes</Link></li>
                <li><Link href="/quotation/motor" className="hover:text-white transition-colors">Instant Motor Quotes</Link></li>
                <li><Link href="/customers" className="hover:text-white transition-colors">Customer 360° Directory</Link></li>
                <li><Link href="/staff" className="hover:text-white transition-colors">Staff Roles &amp; Permissions</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Portal Login (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-medium text-white uppercase tracking-wider border-l-2 border-[#2BBF8C] pl-2.5">
                Surat Headquarters
              </h4>

              <div className="space-y-2 text-xs text-slate-400 font-normal">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>2nd Floor, Shreenathji Bungalow, Peddar Rd, Mota Varachha, Surat, Gujarat 394101</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="tel:+918866779008" className="hover:text-white font-medium text-slate-300">+91 8866779008</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="mailto:contact@insuraa.in" className="hover:text-white text-slate-300">contact@insuraa.in</a>
                </p>
              </div>

              {/* Login CTA Button in Footer */}
              <div className="pt-2">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-[#2D3591] to-[#3B49B8] hover:from-[#242b78] hover:to-[#2D3591] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-300" />
                  <span>Login to Agency Portal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Strip */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-normal">
            <p>© {new Date().getFullYear()} Insuraa. Powered by Shopno Ecommerce Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-5 text-slate-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
              <a href="#hero" className="hover:text-white transition-colors">Back to top ↑</a>
            </div>
          </div>

        </div>
      </footer>

      {/* PAYMENT & CHECKOUT MODAL (Matching User Uploaded Image with Insuraa Brand Colors) */}
      {pricingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="bg-[#F8FAFC] rounded-3xl max-w-5xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative border border-slate-200/90 my-auto text-slate-800 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="pricing-modal-close-btn"
              onClick={() => {
                setPricingModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {paymentSuccess ? (
              /* Success State */
              <div className="text-center py-10 px-4 space-y-5 animate-in zoom-in-95 duration-200 max-w-lg mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold shadow-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Payment Successful!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                    Your subscription for <strong className="text-[#2D3591]">{currentTier?.name || ''} Plan</strong> ({currentCycle?.label?.toUpperCase() || ''}) has been activated.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Plan Selected:</span>
                    <span className="font-semibold text-slate-900">{currentTier?.name || ''} Plan ({currentTier?.to ? `${currentTier.from.toLocaleString()}-${currentTier.to.toLocaleString()}` : `${currentTier?.from ? currentTier.from.toLocaleString() + '+' : ''}`} Policies)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Policies Limit:</span>
                    <span className="font-semibold text-slate-900">{policiesCount.toLocaleString()} Policies</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Amount Paid:</span>
                    <span className="font-semibold text-[#2D3591]">Rs.{(quoteData ? quoteData.final_amount : totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Transaction ID:</span>
                    <span className="font-mono text-slate-700">TXN_INS_{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Status:</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Verified
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleLoginClick}
                    className="py-3 px-6 rounded-xl font-medium text-sm text-white bg-[#2D3591] hover:bg-[#222870] shadow-md transition-all cursor-pointer"
                  >
                    Go to Portal Login
                  </button>
                  <button
                    onClick={() => {
                      setPricingModalOpen(false);
                      setPaymentSuccess(false);
                    }}
                    className="py-3 px-6 rounded-xl font-medium text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Two-Column Checkout View */
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                  {/* LEFT COLUMN: Step 1 & Step 2 (7 Cols) */}
                  <div className="lg:col-span-7 space-y-6">

                    {/* STEP 1: Select Your Plan */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                      <div className="flex items-center gap-2.5 pb-1">
                        <span className="w-6 h-6 rounded-md bg-[#2D3591] text-white flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <h3 className="text-base font-semibold text-slate-900">
                          Select Your Plan
                        </h3>
                      </div>

                      {/* Selectable Plan Cards Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {planData?.tiers
                          ?.filter((p) => !p.name.toLowerCase().includes('free'))
                          ?.map((plan) => {
                            const activeTierName = quoteData?.tier || selectedPlanTier;
                            const isSelected = activeTierName.toLowerCase() === plan.name.toLowerCase();
                            const rangeLabel = plan.to
                              ? `${plan.from.toLocaleString()} - ${plan.to.toLocaleString()}`
                              : `${plan.from.toLocaleString()}+`;
                            return (
                              <div
                                key={plan.name}
                                onClick={() => handleSelectTier(plan.name)}
                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                                  ? 'border-2 border-[#2D3591] bg-indigo-50/50 shadow-xs ring-1 ring-[#2D3591]/20'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-100 text-[#2D3591]' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    <Shield className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900">{plan.name}</div>
                                    <div className="text-xs text-slate-500 font-normal">{rangeLabel} policies</div>
                                  </div>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected
                                    ? 'bg-[#2D3591] text-white'
                                    : 'border-2 border-slate-300'
                                    }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Number of Policies & Billing Cycle */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {/* Number of Policies */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-slate-700">
                              Number of Policies
                            </label>
                            <span className="text-[11px] text-slate-500 font-medium">
                              ₹{quoteData?.rate_per_policy ?? currentRate}/policy/mo
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
                                min={planData?.min_policies || 100}
                                max={planData?.max_policies || 1000000}
                                value={policiesCount}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) {
                                    setPoliciesCount(val);
                                    const matchedTier = planData?.tiers?.find((t) => {
                                      if (t.to !== null && t.to !== undefined) {
                                        return val >= t.from && val <= t.to;
                                      }
                                      return val >= t.from;
                                    });
                                    if (matchedTier) {
                                      setSelectedPlanTier(matchedTier.name.toLowerCase());
                                    }
                                  }
                                }}
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
                          {planData?.first_purchase_free_ai_credits === 'equal_to_policies' && (
                            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" /> Includes {(quoteData ? quoteData.free_ai_credits : policiesCount).toLocaleString()} free AI OCR credits
                            </div>
                          )}
                        </div>

                        {/* Billing Cycle */}
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Billing Cycle
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                            {planData?.cycles?.map((cycle) => {
                              const isCycleActive = billingCycle === cycle.billing_cycle;
                              return (
                                <button
                                  key={cycle.billing_cycle}
                                  type="button"
                                  onClick={() => handleSelectCycle(cycle.billing_cycle)}
                                  className={`py-2 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${isCycleActive
                                    ? 'bg-[#2D3591] text-white shadow-xs font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                              
                                  <span>{cycle.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP 2: Billing Details */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex items-center gap-2.5 pb-1">
                        <span className="w-6 h-6 rounded-md bg-[#2D3591] text-white flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <h3 className="text-base font-semibold text-slate-900">
                          Billing Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        {/* Full Name */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Enter Full Name"
                              value={billingForm.fullName}
                              onChange={(e) => setBillingForm({ ...billingForm, fullName: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Email <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              placeholder="Enter Email"
                              value={billingForm.email}
                              onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Company Name */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Company Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Enter Company Name"
                              value={billingForm.companyName}
                              onChange={(e) => setBillingForm({ ...billingForm, companyName: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* GST Number */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="e.g. 29AAACK7411M1Z3"
                              value={billingForm.gstNumber}
                              onChange={(e) => setBillingForm({ ...billingForm, gstNumber: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Phone Number with SMS OTP Verification */}
                        <div className="sm:col-span-2 space-y-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-700 font-medium">
                              Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[11px] text-[#2D3591] font-medium">
                              {isMobileVerified
                                ? 'Mobile Number Verified'
                                : 'Verify Your Mobile Number Through SMS'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs sm:text-sm flex items-center shrink-0">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="9876543210"
                              value={billingForm.phone}
                              disabled={isMobileVerified}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all disabled:bg-slate-50 disabled:text-slate-500"
                            />
                            {isMobileVerified ? (
                              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shrink-0">
                                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                                <span>Verified</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsMobileVerified(false);
                                    setIsOtpSent(false);
                                    setOtpValue('');
                                    setPurchaseToken('');
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-1 cursor-pointer"
                                >
                                  Change
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || billingForm.phone.length !== 10}
                                className="px-4 py-2.5 rounded-xl font-medium text-xs transition-colors shrink-0 cursor-pointer bg-indigo-50 text-[#2D3591] hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                              >
                                {isSendingOtp ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : isOtpSent ? (
                                  'Resend OTP'
                                ) : (
                                  'Verify'
                                )}
                              </button>
                            )}
                          </div>

                          {/* OTP Input Row when OTP has been sent */}
                          {isOtpSent && !isMobileVerified && (
                            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-700 font-medium flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-[#2D3591]" />
                                  Enter OTP sent to +91 {billingForm.phone}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  maxLength={6}
                                  placeholder="Enter 4-6 digit OTP"
                                  value={otpValue}
                                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleVerifyOtp();
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium tracking-widest text-center focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100"
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyOtp}
                                  disabled={isVerifyingOtp || !otpValue.trim()}
                                  className="px-4 py-2 rounded-lg bg-[#2D3591] hover:bg-[#222870] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                                >
                                  {isVerifyingOtp ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    'Submit OTP'
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Company Address */}
                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-medium mb-1">
                            Company Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              placeholder="Enter Company Address"
                              value={billingForm.companyAddress}
                              onChange={(e) => setBillingForm({ ...billingForm, companyAddress: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Pincode */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Pincode <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 395006"
                              value={billingForm.pincode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="e.g. Surat"
                              value={billingForm.city}
                              onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            State <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="e.g. Gujarat"
                              value={billingForm.state}
                              onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Country <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="India"
                              value={billingForm.country}
                              onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Price Details (5 Cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#2D3591] flex items-center justify-center">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-semibold text-slate-900">
                            Price Details
                          </h3>
                          {isFetchingQuote && (
                            <Loader2 className="w-4 h-4 text-[#2D3591] animate-spin ml-auto" />
                          )}
                        </div>

                        {/* Selected Plan Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#2D3591] text-xs font-semibold">
                          <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>
                            {quoteData?.plan_name
                              ? quoteData.plan_name
                              : `${currentTier?.name || ''} Plan • ${currentTier?.to ? `${currentTier.from.toLocaleString()}-${currentTier.to.toLocaleString()}` : `${currentTier?.from ? currentTier.from.toLocaleString() + '+' : ''}`} Policies`}
                          </span>
                        </div>

                        {/* Calculation Breakdown Lines */}
                        <div className="space-y-2.5 text-xs text-slate-600 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-normal">
                              {quoteData
                                ? `${quoteData.policies.toLocaleString()} policies × ₹${quoteData.rate_per_policy} × ${quoteData.months} mo`
                                : `${policiesCount.toLocaleString()} policies × ₹${currentRate} × ${monthsMultiplier} mo`}
                            </span>
                            <span className="font-semibold text-slate-900">
                              Rs.{(quoteData ? quoteData.total_price : baseSubtotal).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {quoteData && quoteData.coupon_amount > 0 ? (
                            <div className="flex items-center justify-between text-emerald-600 font-medium">
                              <span className="flex items-center gap-1">
                                <Percent className="w-3 h-3" /> Coupon ({quoteData.coupon_code} {quoteData.coupon_per}%)
                              </span>
                              <span>-Rs.{quoteData.coupon_amount.toLocaleString('en-IN')}</span>
                            </div>
                          ) : isCouponApplied && discountAmount > 0 ? (
                            <div className="flex items-center justify-between text-emerald-600 font-medium">
                              <span className="flex items-center gap-1">
                                <Percent className="w-3 h-3" /> Coupon ({couponCode})
                              </span>
                              <span>-Rs.{discountAmount.toLocaleString('en-IN')}</span>
                            </div>
                          ) : null}

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-normal">
                              GST ({quoteData ? quoteData.gst_percentage : (planData?.gst_percentage ?? 18)}%)
                            </span>
                            <span className="font-semibold text-slate-900">
                              Rs.{(quoteData ? quoteData.gst_amount : gstAmount).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-slate-500 font-normal">Subtotal</span>
                            <span className="font-semibold text-slate-900">
                              Rs.{(quoteData ? quoteData.price_after_discount : discountedSubtotal).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                            <span className="text-sm font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-bold text-[#2D3591]">
                              Rs.{(quoteData ? quoteData.final_amount : totalAmount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Coupon Code Box */}
                        <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100/80 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                            <Percent className="w-3.5 h-3.5 text-[#2D3591]" />
                            <span>Have a coupon code?</span>
                          </div>

                          <div className="flex gap-2">
                            <input
                              id="coupon-code-input"
                              type="text"
                              placeholder="Enter coupon code (e.g. WELCOME10)"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleApplyCoupon();
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-[#2D3591]"
                            />
                            <button
                              id="apply-coupon-btn"
                              type="button"
                              disabled={isApplyingCoupon || isFetchingQuote}
                              onClick={() => {
                                if (isCouponApplied && couponCode.trim().toUpperCase() === appliedCouponCode.toUpperCase()) {
                                  handleRemoveCoupon();
                                } else {
                                  handleApplyCoupon();
                                }
                              }}
                              className="px-3.5 py-2 bg-[#2D3591] hover:bg-[#222870] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                            >
                              {isApplyingCoupon ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isCouponApplied && couponCode.trim().toUpperCase() === appliedCouponCode.toUpperCase() ? (
                                'Applied'
                              ) : (
                                'Apply'
                              )}
                            </button>
                          </div>

                          {/* Applied Coupon Info Badge */}
                          {isCouponApplied && appliedCouponCode && (
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                              <span className="font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Coupon <strong>{appliedCouponCode}</strong> applied ({quoteData?.coupon_per ?? 0}% off)
                              </span>
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                className="text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          {/* Preset Welcome Coupon Banner */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 text-[#2D3591]" />
                              <div>
                                <div className="font-bold text-[#2D3591]">WELCOME10</div>
                                <div className="text-[11px] text-slate-500">10% off on your plan quote.</div>
                              </div>
                            </div>
                            <button
                              id="preset-coupon-btn"
                              type="button"
                              disabled={isApplyingCoupon || isFetchingQuote}
                              onClick={() => {
                                if (isCouponApplied && appliedCouponCode.toUpperCase() === 'WELCOME10') {
                                  handleRemoveCoupon();
                                } else {
                                  handleApplyCoupon('WELCOME10');
                                }
                              }}
                              className="text-xs font-bold text-[#2D3591] hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {isCouponApplied && appliedCouponCode.toUpperCase() === 'WELCOME10' ? 'Remove' : 'Apply'}
                            </button>
                          </div>
                        </div>

                        {/* 100% Secure Payment Guarantee */}
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2.5 text-xs">
                          <ShieldCheck className="w-4 h-4 text-[#2BBF8C] shrink-0" />
                          <div>
                            <div className="font-semibold text-emerald-900">100% Secure Payment</div>
                            <div className="text-[11px] text-emerald-700">Your payment details are encrypted and safe.</div>
                          </div>
                        </div>
                      </div>

                      {/* Pay Now Button */}
                      <div className="pt-2 space-y-2">
                        <button
                          id="pay-now-btn"
                          type="button"
                          onClick={handlePayNow}
                          disabled={!isBillingFormValid || isProcessingPayment || isFetchingQuote}
                          className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            !isBillingFormValid || isProcessingPayment || isFetchingQuote
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60'
                              : 'text-white bg-[#2D3591] hover:bg-[#222870] shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]'
                          }`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Processing Purchase...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>
                                Pay Now — Rs.{(quoteData ? quoteData.final_amount : totalAmount).toLocaleString('en-IN')}
                              </span>
                            </>
                          )}
                        </button>
                        {!isBillingFormValid && (
                          <p className="text-center text-[11px] text-amber-600 font-medium animate-in fade-in duration-200">
                            {!isMobileVerified
                              ? '⚠️ Please verify your phone number with SMS OTP to enable payment'
                              : '⚠️ Please fill all required billing details (*) to enable payment'}
                          </p>
                        )}
                        <p className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#2BBF8C]" /> Secured by SSL • Razorpay
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Trust Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#2D3591] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Secure &amp; Encrypted</div>
                      <div className="text-[11px] text-slate-500">Your data is 100% secure</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2BBF8C] flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Instant Activation</div>
                      <div className="text-[11px] text-slate-500">Get started immediately</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">24/7 Support</div>
                      <div className="text-[11px] text-slate-500">We&apos;re here to help</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Money Back Guarantee</div>
                      <div className="text-[11px] text-slate-500">{planData?.free_trial_days || 7}-day money back guarantee</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
