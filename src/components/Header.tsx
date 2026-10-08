import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  FileText,
  Users,
  Calculator,
  PhoneCall,
  User,
  Database,
  Globe,
  Search,
  Monitor,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ExternalLink,
  HeartPulse,
  Stethoscope,
  Car,
  Umbrella,
  Crown,
  Sparkles,
  Receipt,
  UserCheck
} from 'lucide-react';

import { useAppSelector } from '@/redux/hooks';
import { useFetchAiCredits, useGetAiCreditQuote, usePurchaseAiCredit } from '@/hooks/useAiCreditApi';
import { toast } from 'react-toastify';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, animClass: 'animate-icon-dashboard' },
  {
    name: 'Insurance', path: '#', icon: Shield, animClass: 'animate-icon-shield', items: [
      { name: 'Life Insurance', path: '/insurance/life', icon: HeartPulse, animClass: 'animate-icon-heartbeat' },
      { name: 'Health Insurance', path: '/insurance/health', icon: Stethoscope, animClass: 'animate-icon-stethoscope' },
      { name: 'Motor Insurance', path: '/insurance/motor', icon: Car, animClass: 'animate-icon-car' },
      { name: 'Other Insurance', path: '/insurance/other', icon: Umbrella, animClass: 'animate-icon-umbrella' },
    ]
  },
  { name: 'Claim', path: '/claim', icon: FileText, animClass: 'animate-icon-file' },
  { name: 'Customers', path: '/customers', icon: Users, animClass: 'animate-icon-users' },
  {
    name: 'Quotation', path: '#', icon: Calculator, animClass: 'animate-icon-calc', items: [
      { name: 'Health Quotation', path: '/quotation/health', icon: Stethoscope, animClass: 'animate-icon-stethoscope' },
      { name: 'Motor Quotation', path: '/quotation/motor', icon: Car, animClass: 'animate-icon-car' },
    ]
  },
  { name: 'Manage Leads', path: '/manage-leads', icon: PhoneCall, animClass: 'animate-icon-phone' },
  { name: 'Masters', path: '/masters', icon: Database, animClass: 'animate-icon-database' },
  { name: 'Staff', path: '/staff', icon: UserCheck, animClass: 'animate-icon-users' },
];

interface HeaderProps {
  onOpenSubscription?: () => void;
  onOpenSubscriptionHistory?: () => void;
}

export default function Header({ onOpenSubscription, onOpenSubscriptionHistory }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [storedLoginType, setStoredLoginType] = useState<string | null>(null);

  const { data: aiCreditsData } = useFetchAiCredits();
  const { mutate: getCreditQuote, isPending: isGettingQuote } = useGetAiCreditQuote();
  const { mutate: purchaseCredit, isPending: isPurchasing } = usePurchaseAiCredit();
  
  const [isCreditQuoteOpen, setIsCreditQuoteOpen] = useState(false);
  const [creditInput, setCreditInput] = useState<number | ''>('');
  const [quoteResult, setQuoteResult] = useState<any>(null);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('login_type') || localStorage.getItem('auth_login_type');
      setStoredLoginType(stored);
    }
  }, []);

  const currentUser = mounted ? user : null;
  const displayName = currentUser?.full_name || currentUser?.name || 'Insuraa Admin';
  const displaySubText = currentUser?.email || (currentUser?.number ? `+91-${currentUser.number}` : '+91-01234567890');

  // Determine effective login_type:
  // - from Redux user.login_type
  // - or from localStorage ('login_type' / 'auth_login_type')
  const effectiveLoginType = (
    currentUser?.login_type ||
    storedLoginType ||
    (typeof window !== 'undefined' ? localStorage.getItem('login_type') || localStorage.getItem('auth_login_type') : null)
  )?.toLowerCase().trim();

  // If login_type is 'staff', do NOT show Staff in the header.
  // If login_type is 'admin' (or default), show Staff in the header.
  const isStaff = effectiveLoginType === 'staff';

  const displayTag = currentUser?.company_name || (isStaff ? 'Staff Account' : 'Admin Account');
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2F439D&color=fff&bold=true`;

  const navLinks = useMemo(() => {
    if (mounted && isStaff) {
      return NAV_LINKS.filter((link) => link.name !== 'Staff');
    }
    return NAV_LINKS;
  }, [mounted, isStaff]);

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownRect, setDropdownRect] = useState({ left: 0, top: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const creditQuoteRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (creditQuoteRef.current && !creditQuoteRef.current.contains(target)) {
        setIsCreditQuoteOpen(false);
      }
      if (
        navRef.current && !navRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (idx: number, element: HTMLElement) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const rect = element.getBoundingClientRect();
    setDropdownRect({ left: rect.left, top: rect.bottom });
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link: typeof NAV_LINKS[0], idx: number, element: HTMLElement) => {
    if (link.items) {
      e.preventDefault();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (activeDropdown === idx) {
        setActiveDropdown(null);
      } else {
        const rect = element.getBoundingClientRect();
        setDropdownRect({ left: rect.left, top: rect.bottom });
        setActiveDropdown(idx);
      }
    }
  };

  const handleGetQuote = () => {
    if (!creditInput) return;
    setQuoteResult(null); // Clear previous result
    getCreditQuote({ credits: Number(creditInput) }, {
      onSuccess: (res) => {
        // Handle custom application errors returned with 200 HTTP status (e.g. status: 400 in response body)
        if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
           toast.error(res?.message || 'Failed to fetch quote');
           return;
        }

        // If the API wraps data in `data.data`, extract it. Some APIs might just return it in `data`.
        if (res && res.data && Object.keys(res.data).length > 0) {
          setQuoteResult(res.data);
        } else if (res && res.credits) {
          setQuoteResult(res);
        } else {
           // If it returns an error or just a message
           toast.error(res?.message || 'Invalid quote response');
        }
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch quote');
      }
    });
  };

  const handlePay = () => {
    if (!quoteResult?.credits) return;
    purchaseCredit({ credits: quoteResult.credits }, {
      onSuccess: (res) => {
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
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

      {/* Top Bar: Brand, Search, Profile */}
      <div className="h-[72px] px-4 md:px-6 flex items-center justify-between gap-4 w-full">

        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            className="xl:hidden p-2 text-gray-600 hover:text-[#2F439D] transition-colors rounded-md hover:bg-blue-50/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <Link href="/dashboard" className="flex items-center">
            {/* Make the logo explicitly large here */}
            <img src="/logo.png" alt="Insuraa Logo" className="h-10 md:h-12 lg:h-14 object-contain transition-all duration-300" />
          </Link>
        </div>

        {/* Actions & Search */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-start ml-8">
          <div className="relative w-full max-w-[500px] group">
            <input
              type="text"
              placeholder="Search customer, policy, loan, SIP..."
              className="w-full pl-3 pr-9 py-2 bg-white border border-gray-200 rounded-md text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] shadow-inner"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-5">
          <div className="relative" ref={creditQuoteRef}>
            <Link 
              href="/subscription?tab=ai"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200/60 shadow-sm relative group hover:shadow-md transition-all cursor-pointer"
            >
              <Monitor className="h-4 w-4 text-[#2F439D]" />
              <span className="text-xs font-bold text-gray-700">
                {aiCreditsData?.balance ?? '...'} left
              </span>
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md animate-pulse group-hover:animate-none">  {aiCreditsData?.total_used ?? '...'}</span>
            </Link>

            {/* Quote Popover */}
            {isCreditQuoteOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(45,53,145,0.3)] border border-white/60 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2F439D] to-[#2BBF8C] p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-2 text-white">
                    <Sparkles size={18} className="animate-pulse" />
                    <h4 className="font-bold text-lg tracking-tight">Buy AI Credits</h4>
                  </div>
                  <p className="relative z-10 text-white/80 text-xs mt-1 font-medium">Power up your workflow with AI</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Input Section */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calculator size={16} className="text-[#2F439D]/50 group-focus-within:text-[#2F439D] transition-colors" />
                    </div>
                    <input 
                      type="number" 
                      value={creditInput} 
                      onChange={(e) => {
                        setCreditInput(e.target.value ? Number(e.target.value) : '');
                        setQuoteResult(null); // Reset quote when input changes
                      }} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] focus:bg-white transition-all shadow-inner"
                      placeholder="Enter credits (e.g. 500)"
                    />
                  </div>

                  {/* Get Quote Button */}
                  <button 
                    onClick={handleGetQuote}
                    disabled={isGettingQuote || !creditInput}
                    className="w-full py-2.5 bg-[#2F439D]/5 text-[#2F439D] font-bold rounded-xl text-sm border border-[#2F439D]/10 hover:bg-[#2F439D]/10 hover:border-[#2F439D]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isGettingQuote ? (
                      <><span className="w-4 h-4 border-2 border-[#2F439D]/30 border-t-[#2F439D] rounded-full animate-spin"></span> Fetching...</>
                    ) : (
                      'Calculate Quote'
                    )}
                  </button>

                  {/* Quote Result Summary */}
                  {quoteResult && quoteResult.final_amount !== undefined && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#2F439D]/5 rounded-full blur-xl pointer-events-none"></div>
                        
                        <div className="space-y-2 relative z-10">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Credits Requested</span>
                            <span className="font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm">{quoteResult.credits}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Price per credit</span>
                            <span className="font-bold text-gray-700">₹{quoteResult.price_per_credit}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Subtotal</span>
                            <span className="font-bold text-gray-700">₹{quoteResult.total_price}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">GST ({quoteResult.gst_percentage}%)</span>
                            <span className="font-bold text-gray-700">₹{quoteResult.gst_amount}</span>
                          </div>
                          
                          <div className="h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-3"></div>
                          
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Final Amount</span>
                            <span className="text-xl font-black text-[#2F439D] leading-none">₹{quoteResult.final_amount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button 
                        onClick={handlePay}
                        disabled={isPurchasing}
                        className="relative w-full py-3.5 mt-3 group overflow-hidden rounded-xl text-white font-bold text-sm shadow-[0_8px_20px_-6px_rgba(46,49,146,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(46,49,146,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2F439D] via-[#3B54C4] to-[#2BBF8C] transition-transform duration-500 group-hover:scale-105"></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          {isPurchasing ? (
                            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Processing...</>
                          ) : (
                            <>Proceed to Pay <ExternalLink size={14} className="opacity-70" /></>
                          )}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Plan Button */}
          {/* {onOpenSubscription && (
            <button
              type="button"
              onClick={onOpenSubscription}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
              title="View Membership Plans"
            >
              <Crown size={14} className="fill-current text-white" />
              <span>Upgrade Plan</span>
            </button>
          )} */}

          {/* Profile Dropdown Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-4 sm:pl-5 border-l border-gray-200/80 cursor-pointer group focus:outline-none py-1"
            >
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#2F439D] transition-colors flex items-center gap-1">
                  {displayName}
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-[#2F439D]' : 'group-hover:text-[#2F439D]'}`} />
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{displayTag}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-[0_0_0_2px_#2F439D20] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 bg-[#2F439D]/10">
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </button>

            {/* Unique & Attractive Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(46,49,146,0.18)] border border-gray-100/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">

                {/* Profile Header Card */}
                <div className="p-5 bg-gradient-to-br from-[#2E3192]/10 via-blue-50/60 to-emerald-50/40 border-b border-gray-100 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#2E3192]/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2E3192] to-[#2BBF8C] p-0.5 shadow-md">
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                      <ShieldCheck size={12} />
                    </span>
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-900 text-base truncate tracking-tight">{displayName}</h4>
                    <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">{displaySubText}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#2E3192]/10 text-[#2E3192] text-[10px] font-bold uppercase tracking-wider">
                      {displayTag}
                    </span>
                  </div>
                </div>

                {/* Action Items List */}
                <div className="p-2 space-y-1">


                  {/* My Subscription / History */}
                  <Link
                    href="/subscription"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-indigo-50/70 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100/60 text-[#2E3192] flex items-center justify-center shrink-0 group-hover/item:bg-[#2E3192] group-hover/item:text-white transition-colors shadow-sm">
                      <Receipt size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 group-hover/item:text-[#2E3192] transition-colors">My Subscription</p>
                      <p className="text-xs text-gray-400 font-medium truncate">View Invoices & Billing History</p>
                    </div>
                  </Link>

                  {/* AI Credit History removed */}

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-blue-50/70 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#2E3192] flex items-center justify-center shrink-0 group-hover/item:bg-[#2E3192] group-hover/item:text-white transition-colors shadow-sm">
                      <User size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 group-hover/item:text-[#2E3192] transition-colors">Profile</p>
                      <p className="text-xs text-gray-400 font-medium truncate">Edit Details & Settings</p>
                    </div>
                  </Link>


                  {/* Divider */}
                  <div className="my-1 border-t border-gray-100"></div>

                  {/* Log Out Item */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (typeof window !== 'undefined') {
                        localStorage.clear();
                        window.location.href = '/auth/login';
                      }
                    }}
                    className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-rose-50/80 text-left transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-100/60 text-rose-600 flex items-center justify-center shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors shadow-sm">
                      <LogOut size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-rose-600 group-hover/item:text-rose-700 transition-colors">Log Out</p>
                      <p className="text-xs text-rose-400 font-medium truncate">Sign Out Of Your Account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Horizontal Navigation */}
      <div className="hidden xl:flex bg-white/95 border-t border-gray-200/80 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.03)] h-14 w-full relative z-40">
        <nav
          ref={navRef}
          className="flex items-center justify-start w-full px-4 gap-1.5 overflow-hidden"
          onScroll={() => setActiveDropdown(null)}
        >
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.path || link.items?.some(sub => pathname === sub.path);
            const Icon = link.icon;
            const hasItems = !!link.items;

            return (
              <div
                key={idx}
                className="relative group h-full flex items-center shrink-0"
                onMouseEnter={(e) => {
                  if (hasItems) {
                    handleMouseEnter(idx, e.currentTarget);
                  }
                }}
                onMouseLeave={() => {
                  if (hasItems) {
                    handleMouseLeave();
                  }
                }}
              >
                <Link
                  href={hasItems ? '#' : link.path}
                  onClick={(e) => {
                    handleLinkClick(e, link, idx, e.currentTarget);
                  }}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 ${isActive
                    ? 'text-[#2F439D] bg-blue-50/80 shadow-sm border border-[#2F439D]/10'
                    : 'text-gray-700 hover:bg-blue-50/80 hover:text-[#2F439D] border border-transparent'
                    }`}
                >
                  <Icon size={16} className={`transition-colors duration-300 ${link.animClass || ''} ${isActive ? 'text-[#2F439D]' : 'text-gray-500 group-hover:text-[#2F439D]'}`} />
                  {link.name}
                  {hasItems && <ChevronDown size={14} className={`ml-0.5 opacity-60 group-hover:opacity-100 transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180 text-[#2F439D]' : 'group-hover:rotate-180 group-hover:text-[#2F439D]'}`} />}
                </Link>

                {/* Active Underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-[#2F439D] rounded-t-full"></span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Portaled Dropdown Menu outside scroll container */}
        {activeDropdown !== null && navLinks[activeDropdown]?.items && (
          <div
            ref={dropdownRef}
            className="fixed min-w-[220px] bg-white border border-gray-200/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
            style={{ left: dropdownRect.left, top: dropdownRect.top + 4 }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-2 space-y-1">
              {navLinks[activeDropdown].items.map((subLink, subIdx) => {
                const SubIcon = subLink.icon;
                const isSubActive = pathname === subLink.path;
                return (
                  <Link
                    key={subIdx}
                    href={subLink.path}
                    className={`group/sub flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${isSubActive
                      ? 'bg-blue-50/80 text-[#2F439D]'
                      : 'text-gray-600 hover:bg-blue-50/80 hover:text-[#2F439D]'
                      }`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <SubIcon size={17} className={`transition-colors duration-300 ${subLink.animClass || ''} ${isSubActive ? 'text-[#2F439D]' : 'text-gray-400 group-hover/sub:text-[#2F439D]'}`} />
                    {subLink.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200 max-h-[calc(100vh-72px)] overflow-y-auto z-40">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              const hasItems = !!link.items;
              const isExpanded = mobileExpandedMenu === idx;

              return (
                <div key={idx} className="flex flex-col">
                  {hasItems ? (
                    <button
                      onClick={() => setMobileExpandedMenu(isExpanded ? null : idx)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-[#2F439D] bg-blue-50 border border-blue-100 shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                          <Icon size={20} className={isActive ? 'text-[#2F439D]' : 'text-gray-500'} />
                        </div>
                        {link.name}
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.path}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileExpandedMenu(null);
                      }}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-[#2F439D] bg-blue-50 border border-blue-100 shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                          <Icon size={20} className={isActive ? 'text-[#2F439D]' : 'text-gray-500'} />
                        </div>
                        {link.name}
                      </div>
                      {/* {link.badge && (
                        <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {link.badge}
                        </span>
                      )} */}
                    </Link>
                  )}

                  {hasItems && isExpanded && (
                    <div className="pl-14 pr-4 py-2 flex flex-col gap-3 border-l-2 border-gray-100 ml-8 mt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                      {link.items.map((subLink: any, subIdx: number) => {
                        const SubIcon = subLink.icon;
                        const isSubActive = pathname === subLink.path;
                        return (
                          <Link
                            key={subIdx}
                            href={subLink.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileExpandedMenu(null);
                            }}
                            className={`flex items-center gap-3 py-1.5 text-sm font-semibold transition-colors ${isSubActive ? 'text-[#2F439D]' : 'text-gray-500 hover:text-[#00A389]'}`}
                          >
                            <SubIcon size={16} />
                            {subLink.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
