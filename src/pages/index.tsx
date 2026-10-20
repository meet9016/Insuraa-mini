import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  Send,
  ChevronUp,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import {
  useDirectPlanInfo,
  fetchDirectPlanQuote,
  DirectPlanQuoteData,
  fetchSendSignUpOtp,
  fetchDirectVerifyOtp,
  fetchDirectPlanPurchase,
  fetchGstVerify,
} from '@/hooks/usePricingApi';
import { useFetchAppSettings } from '@/hooks/useSettingsApi';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';
import OtpBoxInput from '@/components/OtpBoxInput';

const SOFTWARE_FEATURES = [
  {
    title: 'Smart Dashboard',
    desc: 'Get a complete view of your business with real-time insights and key metrics.',
    icon: LayoutDashboard,
    iconBg: 'bg-blue-50 text-[#2D3591] border-blue-200/60 group-hover:bg-[#2D3591] group-hover:text-white',
  },
  {
    title: 'CRM & Leads',
    desc: 'Capture, track and manage prospective leads from multiple channels.',
    icon: Users,
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/60 group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    title: 'AI Policy Upload',
    desc: 'Upload policy PDFs to auto-extract customer, policy and vehicle details in seconds.',
    icon: Sparkles,
    iconBg: 'bg-emerald-50 text-[#2BBF8C] border-emerald-200/60 group-hover:bg-[#2BBF8C] group-hover:text-white',
  },

  {
    title: 'Renewal Reminders',
    desc: 'Never miss a renewal with automated alerts and notifications.',
    icon: Calendar,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200/60 group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    title: 'Claims Tracking',
    desc: 'Track claim status, documents, surveyor notes and updates in real time.',
    icon: ShieldCheck,
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200/60 group-hover:bg-rose-600 group-hover:text-white',
  },
  {
    title: 'Commission & Reports',
    desc: 'Monitor commissions, generate reports and make better decisions.',
    icon: TrendingUp,
    iconBg: 'bg-violet-50 text-violet-600 border-violet-200/60 group-hover:bg-violet-600 group-hover:text-white',
  },
  {
    title: 'Instant Quotations',
    desc: 'Compare Health and Motor quotes side-by-side with customized IDV and add-ons.',
    icon: Calculator,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200/60 group-hover:bg-purple-600 group-hover:text-white',
  },
  {
    title: 'Policy Management',
    desc: 'Issue, manage and track all insurance policies in one secure place.',
    icon: FileText,
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200/60 group-hover:bg-sky-600 group-hover:text-white',
  },
];

const showcaseImages = [
  { src: '/landing/img1.png', alt: 'Insuraa Showcase 1' },
  { src: '/landing/img2.png', alt: 'Insuraa Showcase 2' },
  { src: '/landing/img3.png', alt: 'Insuraa Showcase 3' },
  { src: '/landing/img4.png', alt: 'Insuraa Showcase 4' },
  { src: '/landing/img5.png', alt: 'Insuraa Showcase 5' },
  { src: '/landing/img6.png', alt: 'Insuraa Showcase 6' },
  { src: '/landing/img7.png', alt: 'Insuraa Showcase 7' },
];

export default function LandingPage() {
  const router = useRouter();
  const showcaseSectionRef = useRef<HTMLDivElement>(null);
  const [showcaseActiveIndex, setShowcaseActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseSectionRef.current) return;
      const rect = showcaseSectionRef.current.getBoundingClientRect();
      const scrollableHeight = showcaseSectionRef.current.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
      const nextIdx = Math.min(
        showcaseImages.length - 1,
        Math.floor(progress * showcaseImages.length)
      );
      setShowcaseActiveIndex(nextIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShowcaseStep = (targetIndex: number) => {
    const nextIdx = Math.max(0, Math.min(showcaseImages.length - 1, targetIndex));
    setShowcaseActiveIndex(nextIdx);
    if (!showcaseSectionRef.current) return;
    const rect = showcaseSectionRef.current.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const sectionTop = currentScrollY + rect.top;
    const scrollableHeight = showcaseSectionRef.current.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;
    const targetScrollY = sectionTop + (nextIdx / (showcaseImages.length - 1)) * scrollableHeight;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // App settings for dynamic contact/whatsapp information
  const { data: appSettings } = useFetchAppSettings();

  // Contact Form state (redirects to WhatsApp with pre-filled details)
  const [contactForm, setContactForm] = useState({
    fullName: '',
    mobileNumber: '',
    message: '',
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Enquiry Modal state (Opened via "ENQUIRY NOW" side button)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    mobileNumber: '',
    message: '',
  });


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
  const [otpLength, setOtpLength] = useState<number>(4);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isVerifyingGst, setIsVerifyingGst] = useState<boolean>(false);
  const [isGstVerified, setIsGstVerified] = useState<boolean>(false);
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

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          const u = JSON.parse(stored);
          setBillingForm((prev) => ({
            ...prev,
            fullName: prev.fullName || u.full_name || u.name || '',
            email: prev.email || u.email || '',
            companyName: prev.companyName || u.company_name || '',
            phone: prev.phone || (u.number ? String(u.number).replace(/\D/g, '').slice(-10) : ''),
          }));
        }
      } catch (e) {
        // ignore
      }
    }

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
        setOtpValue(''); // Keep empty - user types manually into OTP boxes
        if (res.data?.otp) {
          setOtpLength(String(res.data.otp).length || 4);
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
    const cleanOtp = otpValue.replace(/\s+/g, '').trim();
    if (!cleanOtp) {
      toast.error('Please enter the OTP');
      return;
    }
    if (cleanOtp.length < otpLength) {
      toast.error(`Please enter the complete ${otpLength}-digit OTP`);
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

  const handleVerifyGst = async (gstToVerify?: string) => {
    const rawGst = (gstToVerify || billingForm.gstNumber).trim().toUpperCase();
    if (!rawGst) return;
    if (rawGst.length !== 15) {
      toast.error('GST Number must be 15 characters');
      return;
    }
    setIsVerifyingGst(true);
    try {
      const res = await fetchGstVerify(rawGst);
      const isSuccess =
        res &&
        (res.status === 200 || res.status === '200' || res.status === true) &&
        !res.data?.error;

      if (isSuccess) {
        toast.success(res.message || 'GST verified successfully!');
        setIsGstVerified(true);
        const info = (res.data?.taxpayerInfo || (res as any)?.taxpayerInfo || (res.data as any)?.data?.taxpayerInfo || res.data) as any;
        if (info) {
          // Trade name (business/company name, e.g. "SHOPNO")
          const tradeName = (
            info.tradeNam ||
            info.tradeName ||
            info.trade_name ||
            info.company_name ||
            info.companyName ||
            ''
          )?.trim();

          // Legal name (taxpayer individual or entity legal name, e.g. "VALA BHAVIK ISHVARBHAI")
          const legalName = (
            info.lgnm ||
            info.legalName ||
            info.legal_name ||
            info.name ||
            ''
          )?.trim();

          // Company Name prefers tradeName, fallback to legalName
          const compName = tradeName || legalName;
          // Full Name prefers legalName, fallback to tradeName
          const personName = legalName || tradeName;

          // Email from GST response or auth_user / localStorage fallback
          let emailFromGst = (
            info.email ||
            info.emailId ||
            info.email_id ||
            info.contact_email ||
            info.pradr?.addr?.email ||
            (res.data as any)?.email ||
            (res as any)?.email ||
            ''
          )?.trim();

          if (!emailFromGst && typeof window !== 'undefined') {
            try {
              const stored = localStorage.getItem('auth_user');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.email) {
                  emailFromGst = parsed.email.trim();
                }
              }
              if (!emailFromGst) {
                const directEmail = localStorage.getItem('user_email') || localStorage.getItem('email');
                if (directEmail) {
                  emailFromGst = directEmail.trim();
                }
              }
            } catch (e) {
              // ignore
            }
          }

          const addr = info.pradr?.addr || info.addr;
          let addressString = '';
          let city = '';
          let state = '';
          let pincode = '';

          if (addr) {
            const parts = [
              addr.flno,
              addr.bno,
              addr.bnm,
              addr.st,
              addr.loc,
              addr.locality,
              addr.landMark,
            ]
              .map((p: any) => (typeof p === 'string' ? p.trim() : ''))
              .filter(Boolean);
            addressString = parts.join(', ');
            city = addr.dst?.trim() || addr.loc?.trim() || '';
            state = addr.stcd?.trim() || '';
            pincode = addr.pncd?.trim() || '';
          }

          setBillingForm((prev) => ({
            ...prev,
            gstNumber: rawGst,
            companyName: compName || prev.companyName,
            fullName: personName || prev.fullName,
            email: emailFromGst || prev.email,
            companyAddress: addressString || prev.companyAddress,
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode,
          }));
        }
      } else {
        setIsGstVerified(false);
        toast.error(res?.data?.message || res?.message || 'Invalid GST number');
      }
    } catch (err: any) {
      setIsGstVerified(false);
      toast.error(err?.response?.data?.message || err?.message || 'Error verifying GST number');
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const handleGstChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    setBillingForm((prev) => ({ ...prev, gstNumber: clean }));
    setIsGstVerified(false);
    if (clean.length === 15) {
      handleVerifyGst(clean);
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = contactForm.fullName.trim();
    const phone = contactForm.mobileNumber.trim();
    const msg = contactForm.message.trim();

    if (!name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!phone) {
      toast.error('Please enter your mobile number');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!msg) {
      toast.error('Please enter your message');
      return;
    }

    const rawTargetPhone = (appSettings?.whatsapp_number || appSettings?.mobile_number || '8866779008').toString().trim();
    const targetDigits = rawTargetPhone.replace(/\D/g, '');
    const targetWhatsApp = targetDigits.length === 10 ? `91${targetDigits}` : targetDigits;

    const waText = `*New Inquiry via Website*\n\n*Full Name:* ${name}\n*Mobile Number:* ${phone}\n*Message:* ${msg}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsApp}&text=${encodeURIComponent(waText)}`;

    toast.success('Redirecting to WhatsApp...');
    window.open(whatsappUrl, '_blank');
    setContactForm({ fullName: '', mobileNumber: '', message: '' });
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = enquiryForm.fullName.trim();
    const phone = enquiryForm.mobileNumber.trim();
    const msg = enquiryForm.message.trim();

    if (!name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!phone) {
      toast.error('Please enter your mobile number');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!msg) {
      toast.error('Please enter your message');
      return;
    }

    const rawTargetPhone = (appSettings?.whatsapp_number || appSettings?.mobile_number || '8866779008').toString().trim();
    const targetDigits = rawTargetPhone.replace(/\D/g, '');
    const targetWhatsApp = targetDigits.length === 10 ? `91${targetDigits}` : targetDigits;

    const waText = `*New Inquiry via Website*\n\n*Full Name:* ${name}\n*Mobile Number:* ${phone}\n*Message:* ${msg}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsApp}&text=${encodeURIComponent(waText)}`;

    toast.success('Redirecting to WhatsApp...');
    window.open(whatsappUrl, '_blank');
    setEnquiryForm({ fullName: '', mobileNumber: '', message: '' });
    setEnquiryModalOpen(false);
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
            <a href="#software-features" className="hover:text-[#2D3591] transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-[#2D3591] transition-colors">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-[#2D3591] transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-[#2D3591] transition-colors">
              Contact Us
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
              href="#software-features"
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
              Contact Us
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

      {/* HERO SECTION (Exact Match to User Reference Screenshot with Website Brand Colors) */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-12 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-[#F8FAFD]">

        {/* Ambient Subtle Background Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#2D3591]/8 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#2BBF8C]/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left Column (6 cols): Exact Headline, Subtext, CTAs, Trust Strip */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">

              {/* Top Badge: "Insurance Management Software" */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-2xs">
                <span className="text-xs font-medium text-[#2D3591] tracking-wide">
                  Insurance Management Software
                </span>
              </div>

              {/* Exact Headline: "Your Entire Insurance Business. One Smart Platform." */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-slate-900 tracking-tight leading-[1.2]">
                <span>Your Entire Insurance Business.</span> <br />
                <span className="text-[#2D3591]">
                  One Smart Platform.
                </span>
              </h1>

              {/* Exact Subheadline */}
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                Manage your customers, policies, renewals, claims and commissions — all from a single, powerful dashboard.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                {/* Book a Free Demo */}
                <button
                  onClick={handleRegisterClick}
                  id="hero-demo-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2D3591] hover:bg-[#222870] text-white px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Free Demo</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                {/* Explore Features */}
                <a
                  href="#software-features"
                  id="hero-explore-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#2D3591] px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore Features</span>
                </a>
              </div>

            </div>

            {/* Right Column (6 cols): Insuraa Hero Illustration with Proper Border */}
            <div className="lg:col-span-6 relative flex justify-center items-center">

              {/* Outer Ambient Glow with Brand Colors */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2D3591]/15 via-[#2BBF8C]/15 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Hero Image Container with Proper Border */}
              <div className="w-full max-w-lg lg:max-w-[530px] relative rounded-2xl sm:rounded-3xl shadow-xl border-2 border-slate-200/90 overflow-hidden bg-white/95 p-3 sm:p-4 backdrop-blur-xs group hover:border-[#2D3591]/40 hover:shadow-2xl transition-all duration-300">
                <img
                  src="/images/landing/insuraa_hero_illustrator.png"
                  alt="Insuraa Insurance Management Platform"
                  className="w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

            </div>

          </div>

          {/* Trust Indicators Strip Across Bottom (Exact Match: Secure & Reliable | Easy to Use | Trusted by 1000+ Businesses | Dedicated Support) */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#2D3591]" /> Secure &amp; Reliable
            </span>
            <span className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-[#2D3591]" /> Easy to Use
            </span>
            <span className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#2D3591]" /> Trusted by 1000+ Businesses
            </span>
            <span className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-[#2D3591]" /> Dedicated Support
            </span>
          </div>

        </div>
      </section>


      {/* ABOUT / WHY CHOOSE INSURAA SECTION (Left: Device Mockup, Right: Clean Content) */}
      <section id="about" className="py-16 sm:py-12 bg-white relative overflow-hidden">

        {/* Subtle Ambient Background Orbs */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#2D3591]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#2BBF8C]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column (6 cols): Advisor Image with Unique Frame */}
            <div className="lg:col-span-6 relative flex justify-center items-center order-2 lg:order-1 py-4">

              {/* Ambient Dynamic Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] bg-gradient-to-tr from-[#2D3591]/15 via-indigo-100/30 to-[#2BBF8C]/15 rounded-[40px] blur-2xl -z-10" />

              {/* Decorative Offset Frame Wrapper */}
              <div className="relative w-full max-w-lg group">

                {/* 1. Subtle Gradient Border Halo */}
                <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-[#2D3591] via-indigo-500/20 to-[#2BBF8C] opacity-30 blur-xs group-hover:opacity-55 transition-opacity duration-500" />

                {/* 2. Top-Left & Bottom-Right Corner Decorative Accents */}
                <div className="absolute -top-3 -left-3 w-20 h-20 rounded-tl-[32px] border-t-2 border-l-2 border-[#2D3591] pointer-events-none z-10 opacity-70 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-br-[32px] border-b-2 border-r-2 border-[#2BBF8C] pointer-events-none z-10 opacity-70 group-hover:scale-105 transition-transform duration-300" />

                {/* 3. Main Layered Card Container */}
                <div className="relative rounded-[28px] overflow-hidden bg-white p-2 shadow-2xl ring-1 ring-slate-200/90">
                  <div className="rounded-[22px] overflow-hidden relative">
                    <img
                      src="/images/landing/advisor.jpg"
                      alt="Insuraa Insurance Advisor"
                      className="w-full h-auto object-cover rounded-[22px] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    {/* Subtle Inner Glass Vignette Ring */}
                    <div className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-black/10 pointer-events-none" />
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column (6 cols): Badge, Title, Subtitle, 4 Key Benefits */}
            <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-2 pl-0 lg:pl-4">

              {/* Badge: "Why Choose Insuraa" */}
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-2xs">
                <span className="text-xs font-medium text-[#2D3591] tracking-wide">
                  Why Choose Insuraa
                </span>
              </div>

              {/* Heading: "Built for Growth. Designed for You." */}
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-slate-900 tracking-tight leading-snug">
                <span>Built for Growth.</span> <br />
                <span className="text-[#2D3591]">Designed for You.</span>
              </h2>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
                Insuraa helps insurance professionals, agents and brokers work smarter, serve better and grow faster.
              </p>

              {/* 4 Feature Items */}
              <div className="space-y-3.5 pt-1">
                {/* 1. All-in-One Platform */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-[#2D3591] shrink-0 group-hover:bg-[#2D3591] group-hover:text-white transition-all duration-200 shadow-2xs">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">All-in-One Platform</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">Manage everything from one dashboard.</p>
                  </div>
                </div>

                {/* 2. Save Time */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-[#2D3591] shrink-0 group-hover:bg-[#2D3591] group-hover:text-white transition-all duration-200 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">Save Time</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">Automate routine tasks and focus on what matters.</p>
                  </div>
                </div>

                {/* 3. Increase Productivity */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-[#2D3591] shrink-0 group-hover:bg-[#2D3591] group-hover:text-white transition-all duration-200 shadow-2xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">Increase Productivity</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">Stay organized with smart tools and reminders.</p>
                  </div>
                </div>

                {/* 4. Secure & Compliant */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-[#2D3591] shrink-0 group-hover:bg-[#2D3591] group-hover:text-white transition-all duration-200 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">Secure &amp; Compliant</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">Your data is always safe with us.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      <section id="with-vs-without" className="py-10 sm:py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">

        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header (Matches image size & styling, names preserved) */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-medium text-[#2D3591] bg-blue-50/80 border border-blue-200/80 px-4 py-1.5 rounded-full inline-block shadow-2xs">
              Why Choose Insuraa
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-semibold text-slate-900 tracking-tight leading-[1.15]">
              Traditional Agency vs
              <br />
              <span className="text-[#2D3591]">Powered by Insuraa.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
              Insuraa helps insurance professionals, agents and brokers work smarter, serve better and grow faster.
            </p>
          </div>

          {/* Comparison Cards Grid with Central Animated VS badge */}
          <div className="relative max-w-5xl mx-auto">

            {/* Desktop Center Floating Animated VS Badge (Zero Yellow, Royal Blue & Mint) */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
              {/* Continuous Pulsing Ambient Rings (Royal Blue & Mint) */}
              <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#2D3591]/20 animate-ping opacity-75" />
              <span className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#2BBF8C]/20 blur-md animate-pulse" />

              {/* Main VS Circle with Crisp Gradient Border (Zero Yellow) */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-br from-[#2D3591] via-[#3B49B8] to-[#2BBF8C] shadow-2xl animate-pulse">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                  <span className="text-base sm:text-xl font-black tracking-widest text-[#2D3591] drop-shadow-2xs">
                    VS
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-stretch">

              {/* WITHOUT INSURAA CARD (The Problem - Compact) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-rose-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-3">

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-rose-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold text-sm shadow-2xs border border-rose-100">
                        ✕
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900">Without Insuraa</h3>
                        <p className="text-[11px] sm:text-xs text-rose-600 font-normal">Slow, manual &amp; vulnerable to churn</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      Problem
                    </span>
                  </div>

                  {/* Dedicated Image Box (Fit Full Box with Proper Height & 16:9 Aspect Ratio) */}
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-rose-200/80 bg-white flex items-center justify-center shadow-2xs">
                    <img
                      src="/images/landing/without_insuraa.png?v=2"
                      alt="Without Insuraa - Problem"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Pain Points (Crisp, 1-line content) */}
                  <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-600 font-normal">
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Manual Entry:</span> 15–20 min wasted typing 30+ fields per policy.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Lapsed Renewals:</span> No reminder system; 30%+ clients lost.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Scattered Files:</span> Records split across Excel, diaries &amp; WhatsApp.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Chaotic Claims:</span> Discharge summaries &amp; surveyor numbers lost in inboxes.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Data Leak Risk:</span> Staff can copy private client databases without control.
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footnote inside Card */}
                <div className="mt-3 pt-2.5 border-t border-rose-100 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-rose-600 bg-rose-50/40 py-1.5 px-3 rounded-lg">
                  <span>⚠️ Leads to 30–40% loss in annual agency revenue</span>
                </div>

              </div>

              {/* Mobile Animated VS Badge (Zero Yellow) */}
              <div className="flex lg:hidden justify-center -my-3 z-10 relative">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-[#2D3591]/20 animate-ping opacity-75" />
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-r from-[#2D3591] via-[#3B49B8] to-[#2BBF8C] shadow-lg animate-pulse">
                    <span className="px-4 py-1 rounded-full bg-white text-xs font-black tracking-widest text-[#2D3591] flex items-center justify-center">
                      VS
                    </span>
                  </div>
                </div>
              </div>

              {/* WITH INSURAA CARD (The Solution - Compact) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-emerald-400 shadow-md space-y-3 flex flex-col justify-between relative ring-4 ring-emerald-500/10 hover:shadow-xl transition-all group">

                <div className="space-y-3">

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold text-sm shadow-2xs border border-emerald-200/70">
                        ✓
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900">With Insuraa</h3>
                        <p className="text-[11px] sm:text-xs text-emerald-600 font-normal">Fast, automated, unified, and error-free</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Solution
                    </span>
                  </div>

                  {/* Dedicated Image Box (Fit Full Box with Proper Height & 16:9 Aspect Ratio) */}
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-emerald-200/80 bg-white flex items-center justify-center shadow-2xs">
                    <img
                      src="/images/landing/with_insuraa.png?v=2"
                      alt="With Insuraa - Solution"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Benefits (Crisp, 1-line content) */}
                  <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 font-normal">
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">5-Sec AI Policy Read:</span> Upload any PDF; auto-extracts 35+ fields in 5s.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Renewal Radar:</span> WhatsApp alerts sent at 30, 15, and 3 days before expiry.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Unified 360° Vault:</span> Life, Health &amp; Motor organized by family tree.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Live Claim Timeline:</span> Real-time status from intimation to bank credit.
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2BBF8C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Role-Based Security:</span> Admin locks commission reports; staff manage leads.
                      </div>
                    </div>
                  </div>

                </div>

                {/* Action Buttons inside Card */}
                <div className="mt-3 pt-2.5 border-t border-emerald-100 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleLoginClick}
                    className="flex-1 py-2 sm:py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#2D3591] to-[#3B49B8] hover:from-[#242b78] hover:to-[#2D3591] shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Login to Your Agency</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="sm:w-auto py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium text-[#2D3591] bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200/70 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#2BBF8C]" />
                    <span>Free Trial</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* SOFTWARE CORE FEATURES SECTION (Above About Insuraa)                       */}
      {/* Clean 4-column card grid with concise content and beautiful icon badges    */}
      {/* ========================================================================= */}
      <section id="software-features" className="scroll-mt-28 pt-12 sm:pt-12 pb-12 sm:pb-12 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
        {/* Subtle decorative glow elements */}
        <div className="absolute top-1/4 left-5 w-72 h-72 bg-[#2D3591]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-5 w-80 h-80 bg-[#2BBF8C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2BBF8C]" />
              <span className="text-xs font-semibold text-[#2D3591] tracking-wide uppercase">
                Insuraa Core Features
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-slate-900 tracking-tight leading-tight">
              Everything You Need to{' '}
              <span className="text-[#2D3591]">
                Run Your Agency
              </span>
            </h2>

          </div>

          {/* 4-Column Features Grid (Compact, Proper Proportions, Clean & Attractive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SOFTWARE_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="group relative bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200/85 hover:border-[#2D3591]/40 shadow-2xs hover:shadow-lg hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle Top Glow Accent Line on Hover */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#2D3591] via-indigo-500 to-[#2BBF8C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-100/35 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon Box (Light pastel rounded square with micro-hover scale and solid color fill) */}
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mb-3.5 transition-all duration-300 group-hover:scale-105 shadow-2xs ${feat.iconBg}`}>
                  <feat.icon className="w-5 h-5 transition-colors duration-200" />
                </div>

                {/* Title */}
                <h3 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-[#2D3591] transition-colors tracking-tight leading-snug">
                  {feat.title}
                </h3>

                {/* Short 2-Line Description */}
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-1.5">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* FULL-WIDTH SCROLL-DRIVEN SHOWCASE (5 Landing Images, Full Width, Native Sticky Scroll) */}
      <section
        id="solutions"
        ref={showcaseSectionRef}
        className="relative bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-200/80"
        style={{ height: '320vh' }}
      >
        <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden">

          {/* Ambient Brand Color Glows behind the showcase frame */}
          <div className="absolute w-[92%] max-w-7xl h-80 bg-gradient-to-tr from-[#2D3591]/15 via-[#2BBF8C]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Main Full-Width Image Stage */}
          <div className="w-full max-w-[1380px] xl:max-w-[1440px] mx-auto relative flex flex-col items-center">

            {/* The Glassmorphic / Premium Image Frame */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-slate-900/5 relative aspect-[1.95/1] sm:aspect-[2.02/1] max-h-[72vh] sm:max-h-[75vh]">

              {/* Subtle Window Bar */}
              <div className="h-8 sm:h-9 bg-slate-50/90 border-b border-slate-100 px-3 sm:px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500 tracking-wider">
                  {showcaseActiveIndex + 1} / {showcaseImages.length}
                </div>
                <div className="w-10 sm:w-12 flex justify-end">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* Stacked Images with Smooth Slide & Opacity Transitions */}
              <div className="relative w-full h-[calc(100%-2rem)] sm:h-[calc(100%-2.25rem)] bg-white flex items-center justify-center overflow-hidden">
                {showcaseImages.map((img, idx) => {
                  const isActive = idx === showcaseActiveIndex;
                  const isPast = idx < showcaseActiveIndex;
                  return (
                    <div
                      key={img.src}
                      className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${isActive
                        ? 'opacity-100 translate-y-0 scale-100 z-10'
                        : isPast
                          ? 'opacity-0 -translate-y-8 scale-95 z-0 pointer-events-none'
                          : 'opacity-0 translate-y-8 scale-100 z-0 pointer-events-none'
                        }`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-fill select-none"
                      />
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Progress Navigation Dots & Controls */}
            <div className="mt-4 sm:mt-5 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/80 ring-1 ring-slate-100 z-20">
              <button
                type="button"
                onClick={() => handleShowcaseStep(showcaseActiveIndex - 1)}
                disabled={showcaseActiveIndex === 0}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                aria-label="Previous image"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 px-1">
                {showcaseImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleShowcaseStep(idx)}
                    className={`transition-all duration-300 rounded-full ${idx === showcaseActiveIndex
                      ? 'w-7 sm:w-8 h-2 bg-gradient-to-r from-[#2D3591] to-[#2BBF8C]'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleShowcaseStep(showcaseActiveIndex + 1)}
                disabled={showcaseActiveIndex === showcaseImages.length - 1}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                aria-label="Next image"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* SUBSCRIPTION & PRICING PLANS (Direct Plan Info API with Dynamic Tiers & Features) */}
      <section id="pricing" className="py-12 bg-slate-50 border-t border-slate-200/80 relative">
        <div className="w-full max-w-[1480px] xl:max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header with Wavy Curve */}
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-2xs">

              <span className="text-xs font-semibold text-[#2D3591] tracking-wide uppercase">
                Insuraa Core Features
              </span>
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
            <div className={`grid grid-cols-1 ${planData.tiers.length === 3 ? 'md:grid-cols-3 max-w-6xl' : 'md:grid-cols-2 xl:grid-cols-4 w-full'} gap-6 mx-auto items-stretch`}>
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


      {/* CONTACT US & GET IN TOUCH */}
      <section id="contact" className="pt-12 pb-8 sm:pb-10 bg-white border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-medium uppercase tracking-wider text-[#2D3591] bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2D3591]" /> Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Get in Touch with Our Team
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Have questions about agency onboarding or need a custom demonstration? We are right here in Surat to help you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Contact Information Card with Support Illustration */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">

              {/* Dedicated Visual Support Team Illustration */}
              <div className="w-full rounded-2xl overflow-hidden aspect-[16/9.5] shadow-xs border border-slate-200/70 relative group bg-gradient-to-tr from-indigo-50/50 to-emerald-50/50">
                <img
                  src="/images/landing/get_in_touch.png"
                  alt="Insuraa Dedicated Support Team"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-5">


                <div className="space-y-3.5 text-xs sm:text-[13px] text-slate-700">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#2D3591] flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-semibold text-xs">Office Address:</span>
                      <span className="text-slate-600 leading-relaxed block mt-0.5 font-normal text-xs">
                        2nd floor, C1, above Adarsh Farsan Mart, Baroda Prestige, Ganesh Colony, Varachha, Surat, Gujarat 395010
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2BBF8C] flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-semibold text-xs">Call &amp; WhatsApp Support:</span>
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${(appSettings?.whatsapp_number || appSettings?.mobile_number || '8866779008').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2D3591] font-semibold text-xs hover:underline block mt-0.5"
                      >
                        +91 {appSettings?.whatsapp_number || appSettings?.mobile_number || '8866779008'}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-semibold text-xs">Official Email:</span>
                      <a href={`mailto:${appSettings?.email || 'contact@insuraa.in'}`} className="text-[#2D3591] font-semibold text-xs hover:underline block mt-0.5">
                        {appSettings?.email || 'contact@insuraa.in'}
                      </a>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs font-medium">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-900 block font-semibold text-xs">Operating Hours:</span>
                      <span className="text-slate-600 block mt-0.5 font-normal text-xs">
                        Monday – Saturday: 9:30 AM – 7:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Contact Form (Replaces Google Map) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#2BBF8C] uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp Connect
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2.5">Send Us a Message</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Fill in your details below and we will connect with you directly on WhatsApp.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-fullname" className="block text-sm font-bold text-slate-700  tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="contact-fullname"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="contact-mobile" className="block text-sm font-bold text-slate-700  tracking-wider mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="contact-mobile"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={contactForm.mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setContactForm((prev) => ({ ...prev, mobileNumber: val }));
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-bold text-slate-700  tracking-wider mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Write your message or inquiry here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2BBF8C] to-[#1EA376] hover:from-[#24aa7c] hover:to-[#1a8e67] shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>


      {/* "INSURANCE" BALLOONS BANNER IN CONTAINER TOUCHING THE FOOTER (NO BG COLOR, BIG & PROPER) */}
      <div className="w-full relative z-10 -mb-[2px] flex justify-center pointer-events-none select-none overflow-hidden !bg-[#ffffff]">
        <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 flex justify-center items-end">
          <img
            src="/images/landing/footer_imgs.png"
            alt="Insuraa Insurance"
            className="w-full h-auto object-contain block align-bottom"
          />
        </div>
      </div>

      {/* SUPER UNIQUE & ATTRACTIVE FOOTER */}
      <footer className="relative bg-[#070B18] text-slate-300 overflow-hidden pt-14 sm:pt-16 pb-8 border-t border-slate-800">

        {/* Ambient Top Light Beam in Brand #27439C */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#27439C] to-transparent" />

        {/* Clean Luxury Dark Footer Background with Ambient Color Glows */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#27439C]/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#2BBF8C]/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* 3 Balanced Main Columns: Brand (Left), Quick Links (Center), Contact (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Column 1: Brand & Authority (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-block">
                <img src="/white_logo.png" alt="Insuraa" className="h-10 sm:h-11 w-auto object-contain" />
              </Link>

              <p className="text-sm sm:text-[14.5px] text-slate-300 leading-relaxed font-normal max-w-sm">
                DIGITALKS, Located In Surat, Gujarat, Specializes In Top-Tier Insurance Agency Management Software &amp; CRM, Ensuring A Seamless Online Shopping &amp; Agency Experience For Your Customers.
              </p>

              {/* 4 Circular Social Icon Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://api.whatsapp.com/send?phone=918866779008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Header Navigation Links (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-6 tracking-wide">
                Quick Links
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm sm:text-[15px]">
                <a href="#about" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  About Insuraa
                </a>
                <a href="#solutions" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Solutions
                </a>
                <a href="#with-vs-without" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  With vs Without
                </a>
                <a href="#pricing" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Pricing
                </a>
                <a href="#software-features" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Features
                </a>
                <a href="#contact" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Contact Us
                </a>
              </div>

              {/* Portal Login Button in Brand #27439C */}
              <div className="pt-2">
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 bg-[#27439C] hover:bg-[#1e347b] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-indigo-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Login to Agency Portal</span>
                  <LogIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Column 3: Contact Details in Brand #27439C (4 cols) */}
            <div className="lg:col-span-4">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-6 tracking-wide">
                Contact
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Phone className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="tel:+918866779008" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] tracking-wide transition-colors">
                    +91 88667 79008
                  </a>
                </div>

                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Phone className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="tel:+917016268071" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] tracking-wide transition-colors">
                    +91 70162 68071
                  </a>
                </div>

                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Mail className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="mailto:Contact@Shopno.In" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] transition-colors">
                    Contact@Shopno.In
                  </a>
                </div>

                <a
                  href="https://maps.app.goo.gl/KYFUtLChkxdEScUq7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group cursor-pointer"
                  title="Open location in Google Maps"
                >
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <MapPin className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <span className="text-slate-300 group-hover:text-white text-xs sm:text-[13.5px] leading-relaxed transition-colors">
                    2nd Floor, C1, Above Adarsh Farsan Mart, Baroda Prestige, Ganesh Colony, Varachha, Surat, Gujarat 395010
                  </span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Strip */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
            <p className="text-center md:text-left">
              Copyright © 2026 <span className="font-semibold text-white">SHOPNO ECOMMERCE PVT.LTD.</span> Designed By{' '}
              <span className="text-[#5275e6] font-semibold">All Rights Reserved</span>
            </p>
            <div className="flex items-center gap-6 text-slate-300 text-xs sm:text-sm flex-wrap justify-center">
              <Link href="/help-support" className="hover:text-white transition-colors">
                Help &amp; Support
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

        </div>

        {/* Vertical Inquiry Now Tab on Left Screen Edge */}
        <button
          type="button"
          onClick={() => setEnquiryModalOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-[#2D3591] via-[#24357D] to-[#1E2568] hover:from-[#353ea8] hover:to-[#242c78] text-white font-semibold text-[13px] tracking-wide px-2.5 py-4 rounded-r-xl shadow-[3px_6px_20px_rgba(45,53,145,0.4)] hover:shadow-[4px_8px_26px_rgba(45,53,145,0.55)] border-y border-r border-white/20 transition-all hover:translate-x-0.5 cursor-pointer flex flex-col items-center gap-2.5 group"
          aria-label="Inquiry Now"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-[#2BBF8C] group-hover:bg-[#2BBF8C] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
            <MessageCircle className="w-3 h-3" />
          </div>
          <span className="[writing-mode:vertical-lr] rotate-180 select-none">
            Inquiry Now
          </span>
        </button>

        {/* Floating WhatsApp Quick Connect Button - Direct Chat with Bhavik Vala (+91 88667 79008) */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center group/whatsapp">
          {/* Continuous Ripple Animation Rings */}
          <span className="absolute -inset-2.5 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />

          {/* Hover Tooltip */}
          <div className="absolute right-full mr-3.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold rounded-xl shadow-lg opacity-0 group-hover/whatsapp:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp (+91 88667 79008)</span>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=918866779008&text=${encodeURIComponent('Hi Bhavik, I have an inquiry regarding Insuraa.')}`}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-whatsapp-pulse animate-whatsapp-float"
            title="Chat with Bhavik Vala on WhatsApp (+91 88667 79008)"
            aria-label="Chat with Bhavik Vala on WhatsApp"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>


      </footer>

      {/* ENQUIRY MODAL (Matching User Uploaded WhatsApp Connect Card Image) */}
      {enquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setEnquiryModalOpen(false)}
        >
          <div
            className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200/90 my-auto text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="mb-6">
              <span className="text-xs font-bold text-[#2BBF8C] uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp Connect
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2.5">Send Us a Message</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Fill in your details below and we will connect with you directly on WhatsApp.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="modal-enquiry-fullname" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-enquiry-fullname"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={enquiryForm.fullName}
                    onChange={(e) => setEnquiryForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="modal-enquiry-mobile" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-enquiry-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={enquiryForm.mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setEnquiryForm((prev) => ({ ...prev, mobileNumber: val }));
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="modal-enquiry-message" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="modal-enquiry-message"
                  required
                  rows={4}
                  placeholder="Write your message or inquiry here..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="modal-enquiry-submit-btn"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2BBF8C] to-[#1EA376] hover:from-[#24aa7c] hover:to-[#1a8e67] shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Message via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT & CHECKOUT MODAL (Matching User Uploaded Image with Insuraa Brand Colors) */}
      {pricingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="bg-[#F8FAFC] rounded-3xl max-w-5xl w-full p-4 sm:p-5 md:p-6 shadow-2xl relative border border-slate-200/90 my-auto text-slate-800 max-h-[96vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="pricing-modal-close-btn"
              onClick={() => {
                setPricingModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer z-10"
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                  {/* LEFT COLUMN: Step 1 & Step 2 (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3.5">

                    {/* STEP 1: Select Your Plan */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 pb-0.5">
                        <span className="w-5 h-5 rounded-md bg-[#2D3591] text-white flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          Select Your Plan
                        </h3>
                      </div>

                      {/* Selectable Plan Cards Row (No Icons, Compact Size) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                                className={`px-3 py-2 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isSelected
                                  ? 'border-[#2D3591] bg-indigo-50/50 shadow-xs ring-1 ring-[#2D3591]/20'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{plan.name}</div>
                                  <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{rangeLabel} policies</div>
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
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-2.5">
                      <div className="flex items-center gap-2 pb-0.5">
                        <span className="w-5 h-5 rounded-md bg-[#2D3591] text-white flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          Billing Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                        {/* Full Name */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Enter Full Name"
                              value={billingForm.fullName}
                              onChange={(e) => setBillingForm({ ...billingForm, fullName: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Email <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              placeholder="Enter Email"
                              value={billingForm.email}
                              onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Company Name */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Company Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Enter Company Name"
                              value={billingForm.companyName}
                              onChange={(e) => setBillingForm({ ...billingForm, companyName: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* GST Number */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-slate-700 font-medium">
                              GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            {isGstVerified && (
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                <BadgeCheck className="w-3 h-3 text-emerald-600" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              maxLength={15}
                              placeholder="e.g. 24BAGPV9685P2ZG"
                              value={billingForm.gstNumber}
                              onChange={(e) => handleGstChange(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleVerifyGst();
                                }
                              }}
                              className={`w-full pl-8 pr-16 py-2 rounded-lg border text-xs sm:text-sm uppercase transition-all focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 ${isGstVerified
                                ? 'border-emerald-300 bg-emerald-50/20'
                                : 'border-slate-200'
                                }`}
                            />
                            {billingForm.gstNumber.trim().length === 15 && !isGstVerified && (
                              <button
                                type="button"
                                onClick={() => handleVerifyGst()}
                                disabled={isVerifyingGst}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-semibold text-[#2D3591] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              >
                                {isVerifyingGst ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                              </button>
                            )}
                            {isVerifyingGst && billingForm.gstNumber.trim().length !== 15 && (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D3591] absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                        </div>

                        {/* Phone Number with SMS OTP Verification */}
                        <div className="sm:col-span-2 space-y-1.5">
                          <div className="flex items-center justify-between mb-0.5">
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
                            <span className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium text-xs sm:text-sm flex items-center shrink-0">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="9876543210"
                              value={billingForm.phone}
                              disabled={isMobileVerified}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all disabled:bg-slate-50 disabled:text-slate-500"
                            />
                            {isMobileVerified ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shrink-0">
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
                                className="px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shrink-0 cursor-pointer bg-indigo-50 text-[#2D3591] hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
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

                          {/* OTP Input Row when OTP has been sent (Compact & No Extra Text) */}
                          {isOtpSent && !isMobileVerified && (
                            <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                              <div className="flex items-center gap-2 min-w-0">
                                <OtpBoxInput
                                  length={otpLength}
                                  value={otpValue}
                                  onChange={(val) => setOtpValue(val)}
                                  onEnter={handleVerifyOtp}
                                  boxClassName="w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base font-bold rounded-lg"
                                  className="my-0 gap-1.5"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isVerifyingOtp || otpValue.trim().length !== otpLength}
                                className="px-3.5 py-2 rounded-lg bg-[#2D3591] hover:bg-[#222870] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                              >
                                {isVerifyingOtp ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  'Submit OTP'
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Company Address */}
                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-medium mb-1">
                            Company Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              placeholder="Enter Company Address"
                              value={billingForm.companyAddress}
                              onChange={(e) => setBillingForm({ ...billingForm, companyAddress: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Pincode */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Pincode <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Compass className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 395006"
                              value={billingForm.pincode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="e.g. Surat"
                              value={billingForm.city}
                              onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            State <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Globe2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="e.g. Gujarat"
                              value={billingForm.state}
                              onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-slate-700 font-medium mb-1">
                            Country <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Globe2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="India"
                              value={billingForm.country}
                              onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2D3591] focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Price Details (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#2D3591] flex items-center justify-center">
                            <Wallet className="w-3.5 h-3.5" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                            Price Details
                          </h3>
                          {isFetchingQuote && (
                            <Loader2 className="w-3.5 h-3.5 text-[#2D3591] animate-spin ml-auto" />
                          )}
                        </div>

                        {/* Selected Plan Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#2D3591] text-xs font-semibold">
                          <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>
                            {quoteData?.plan_name
                              ? quoteData.plan_name
                              : `${currentTier?.name || ''} Plan • ${currentTier?.to ? `${currentTier.from.toLocaleString()}-${currentTier.to.toLocaleString()}` : `${currentTier?.from ? currentTier.from.toLocaleString() + '+' : ''}`} Policies`}
                          </span>
                        </div>

                        {/* Calculation Breakdown Lines */}
                        <div className="space-y-1.5 text-xs text-slate-600 pt-0.5">
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

                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-slate-500 font-normal">Subtotal</span>
                            <span className="font-semibold text-slate-900">
                              Rs.{(quoteData ? quoteData.price_after_discount : discountedSubtotal).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="border-t border-slate-100 pt-2 flex items-baseline justify-between">
                            <span className="text-sm font-bold text-slate-900">Total</span>
                            <span className="text-xl sm:text-2xl font-bold text-[#2D3591]">
                              Rs.{(quoteData ? quoteData.final_amount : totalAmount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Coupon Code Box */}
                        <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/80 space-y-2">
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
                              className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-[#2D3591]"
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
                              className="px-3.5 py-1.5 bg-[#2D3591] hover:bg-[#222870] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
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

                          {/* Applied Coupon Info Badge OR Preset Welcome Coupon Banner */}
                          {isCouponApplied && appliedCouponCode ? (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs animate-in fade-in duration-200">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-emerald-900 truncate">
                                    Coupon <span className="text-[#2D3591]">{appliedCouponCode}</span> applied!
                                  </div>
                                  <div className="text-[11px] text-emerald-700">
                                    {quoteData?.coupon_per ?? 10}% discount applied to your quote
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-0.5 shrink-0 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-dashed border-indigo-200 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-5 h-5 rounded-md bg-indigo-50 text-[#2D3591] flex items-center justify-center shrink-0">
                                  <Tag className="w-3 h-3" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#2D3591]">WELCOME10</div>
                                  <div className="text-[11px] text-slate-500">10% off on your plan quote</div>
                                </div>
                              </div>
                              <button
                                id="preset-coupon-btn"
                                type="button"
                                disabled={isApplyingCoupon || isFetchingQuote}
                                onClick={() => handleApplyCoupon('WELCOME10')}
                                className="text-xs font-bold text-[#2D3591] hover:underline cursor-pointer disabled:opacity-50 px-2 py-0.5 shrink-0"
                              >
                                Apply
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 100% Secure Payment Guarantee */}
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-xs">
                          <ShieldCheck className="w-4 h-4 text-[#2BBF8C] shrink-0" />
                          <div>
                            <div className="font-semibold text-emerald-900">100% Secure Payment</div>
                            <div className="text-[11px] text-emerald-700">Your payment details are encrypted and safe.</div>
                          </div>
                        </div>
                      </div>

                      {/* Pay Now Button */}
                      <div className="pt-1.5 space-y-1.5">
                        <button
                          id="pay-now-btn"
                          type="button"
                          onClick={handlePayNow}
                          disabled={!isBillingFormValid || isProcessingPayment || isFetchingQuote}
                          className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${!isBillingFormValid || isProcessingPayment || isFetchingQuote
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
