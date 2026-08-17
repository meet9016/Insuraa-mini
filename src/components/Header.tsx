import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  FileText,
  Users,
  Calculator,
  BarChart2,
  PhoneCall,
  CheckSquare,
  User,
  UserCog,
  Briefcase,
  Settings,
  Database,
  Globe,
  IndianRupee,
  MessageCircle,
  Mail,
  Search,
  Monitor,
  ChevronDown,
  Menu,
  X,
  Puzzle,
  Bell,
  FileSpreadsheet,
  UserPlus,
  LogOut,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    name: 'Insurance', path: '#', icon: Shield, items: [
      { name: 'Life Insurance', path: '/insurance/life', icon: Shield },
      { name: 'Health Insurance', path: '/insurance/health', icon: Shield },
      { name: 'Motor Insurance', path: '/insurance/motor', icon: Shield },
      { name: 'Other Insurance', path: '/insurance/other', icon: Shield },
    ]
  },
  { name: 'Claim', path: '/claim', icon: FileText },
  { name: 'Customers', path: '/customers', icon: Users },
  {
    name: 'Quotation', path: '#', icon: Calculator, items: [
      { name: 'Health Quotation', path: '/quotation/health', icon: Calculator },
      { name: 'Motor Quotation', path: '/quotation/motor', icon: Calculator },
    ]
  },
  // {
  //   name: 'Reports', path: '#', icon: BarChart2, items: [
  //     { name: 'Business Summary Register', path: '/reports/business-summary', icon: BarChart2 },
  //     { name: 'Policy Register', path: '/reports/policy-register', icon: BarChart2 },
  //     { name: 'Policy History', path: '/reports/policy-history', icon: BarChart2 },
  //     { name: 'Premium Calendar', path: '/reports/premium-calendar', icon: BarChart2 },
  //     { name: 'Client Portfolio', path: '/reports/client-portfolio', icon: BarChart2 },
  //     { name: 'New & Renew Business', path: '/reports/new-renew-business', icon: BarChart2 },
  //     { name: 'Upcoming Renewal Policy', path: '/reports/upcoming-renewal', icon: BarChart2 },
  //     { name: 'Upcoming Installment Policy', path: '/reports/upcoming-installment', icon: BarChart2 },
  //     { name: 'Life Insurance Report', path: '/reports/life-insurance', icon: BarChart2 },
  //     { name: 'Vehicle Doc Validity Report', path: '/reports/vehicle-doc-validity', icon: BarChart2 },
  //     { name: 'Commission Report', path: '/reports/commission', icon: BarChart2 },
  //     { name: 'Agent Commission Report', path: '/reports/agent-commission', icon: BarChart2 },
  //   ]
  // },
  { name: 'Manage Leads', path: '/leads', icon: PhoneCall },
  { name: 'Masters', path: '/masters', icon: Database },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownRect, setDropdownRect] = useState({ left: 0, top: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          <Link href="/" className="flex items-center">
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
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200/60 shadow-sm relative group hover:shadow-md transition-all cursor-pointer">
            <Monitor className="h-4 w-4 text-[#2F439D]" />
            <span className="text-xs font-bold text-gray-700">641 left</span>
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md animate-pulse group-hover:animate-none">59</span>
          </div>

          {/* Profile Dropdown Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-4 sm:pl-5 border-l border-gray-200/80 cursor-pointer group focus:outline-none py-1"
            >
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#2F439D] transition-colors flex items-center gap-1">
                  INSURAA
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-[#2F439D]' : 'group-hover:text-[#2F439D]'}`} />
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ADMIN</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-[0_0_0_2px_#2F439D20] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 bg-[#2F439D]/10">
                  <img src="https://ui-avatars.com/api/?name=INSURAA+ADMIN&background=2F439D&color=fff&bold=true" alt="Admin" className="w-full h-full object-cover" />
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
                        <img src="https://ui-avatars.com/api/?name=INSURAA+ADMIN&background=2F439D&color=fff&bold=true" alt="Admin" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                      <ShieldCheck size={12} />
                    </span>
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-900 text-base truncate tracking-tight">Insuraa Admin</h4>
                    <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">+91-01234567890</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#2E3192]/10 text-[#2E3192] text-[10px] font-bold uppercase tracking-wider">
                      Admin Account
                    </span>
                  </div>
                </div>

                {/* Action Items List */}
                <div className="p-2 space-y-1">
                  {/* Profile Item */}
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

                  {/* Website Item */}
                  <a
                    href="https://insuraa.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-emerald-50/70 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-[#00A389] flex items-center justify-center shrink-0 group-hover/item:bg-[#00A389] group-hover/item:text-white transition-colors shadow-sm">
                      <Globe size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 group-hover/item:text-[#00A389] transition-colors flex items-center justify-between">
                        Website
                        <ExternalLink size={13} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400" />
                      </p>
                      <p className="text-xs text-gray-400 font-medium truncate">Visit & Explore Our Website</p>
                    </div>
                  </a>

                  {/* Divider */}
                  <div className="my-1 border-t border-gray-100"></div>

                  {/* Log Out Item */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (typeof window !== 'undefined') {
                        localStorage.clear();
                        window.location.href = '/login';
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
          className="flex items-center justify-start w-full px-4 gap-1.5 overflow-hidden"
          onScroll={() => setActiveDropdown(null)}
        >
          {NAV_LINKS.map((link, idx) => {
            const isActive = pathname === link.path || link.items?.some(sub => pathname === sub.path);
            const Icon = link.icon;
            return (
              <div
                key={idx}
                className="relative group h-full flex items-center shrink-0"
                onMouseEnter={(e) => {
                  if (link.items) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDropdownRect({ left: rect.left, top: rect.bottom });
                    setActiveDropdown(idx);
                  }
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.items ? '#' : link.path}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 ${isActive
                    ? 'text-[#2F439D] bg-blue-50/80 shadow-sm border border-[#2F439D]/10'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-[#00A389] border border-transparent'
                    }`}
                >
                  <Icon size={16} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#2F439D]' : 'text-gray-500 group-hover:text-[#00A389]'}`} />
                  {link.name}
                  {link.badge && (
                    <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-md z-20">
                      {link.badge}
                    </span>
                  )}
                  {link.items && <ChevronDown size={14} className={`ml-0.5 opacity-60 group-hover:opacity-100 transition-transform ${activeDropdown === idx ? 'rotate-180 text-[#2F439D]' : 'group-hover:rotate-180 group-hover:text-[#00A389]'}`} />}
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
        {activeDropdown !== null && NAV_LINKS[activeDropdown]?.items && (
          <div
            className="fixed min-w-[220px] bg-white border border-gray-200/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ left: dropdownRect.left, top: dropdownRect.top + 4 }}
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="p-2 space-y-1">
              {NAV_LINKS[activeDropdown].items.map((subLink, subIdx) => {
                const SubIcon = subLink.icon;
                const isSubActive = pathname === subLink.path;
                return (
                  <Link
                    key={subIdx}
                    href={subLink.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-colors ${isSubActive
                      ? 'bg-blue-50/80 text-[#2F439D]'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-[#00A389]'
                      }`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <SubIcon size={16} className={isSubActive ? 'text-[#2F439D]' : 'text-gray-400'} />
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
            {NAV_LINKS.map((link, idx) => {
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
                      {link.badge && (
                        <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {link.badge}
                        </span>
                      )}
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
