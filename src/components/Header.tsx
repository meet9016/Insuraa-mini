import React, { useState } from 'react';
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
  LogOut
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

          <div className="flex items-center gap-3 pl-5 border-l border-gray-200/80 cursor-pointer group">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#2F439D] transition-colors">INSURAA</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ADMIN</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-[0_0_0_2px_#2F439D20] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img src="https://ui-avatars.com/api/?name=INSURAA+ADMIN&background=2F439D&color=fff&bold=true" alt="Admin" className="w-full h-full object-cover" />
            </div>
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
