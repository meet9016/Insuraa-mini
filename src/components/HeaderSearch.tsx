import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import {
  Search,
  X,
  Loader2,
  Users,
  HeartPulse,
  Stethoscope,
  Car,
  Umbrella,
  FileText,
  PhoneCall,
  Calculator,
  Eye,
  AlertCircle,
  Calendar
} from 'lucide-react';
import {
  useGlobalSearch,
  GlobalSearchCustomer,
  GlobalSearchInsurancePolicy,
  GlobalSearchClaim,
  GlobalSearchLead,
  GlobalSearchQuotation,
  GlobalSearchResults
} from '@/hooks/useGlobalSearchApi';

// Table view modals
import LifeInsuranceViewModal from '@/components/insurance/LifeInsuranceViewModal';
import HealthInsuranceViewModal from '@/components/insurance/HealthInsuranceViewModal';
import MotorInsuranceViewModal from '@/components/insurance/MotorInsuranceViewModal';
import ViewOtherInsuranceModal from '@/pages/insurance/other/components/ViewOtherInsuranceModal';
import CustomerViewModal from '@/components/customers/CustomerViewModal';

interface HeaderSearchProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

type CategoryKey =
  | 'all'
  | 'customers'
  | 'life_insurance'
  | 'health_insurance'
  | 'motor_insurance'
  | 'other_insurance'
  | 'claims'
  | 'leads'
  | 'health_quotations'
  | 'motor_quotations';

export default function HeaderSearch({ isMobile = false, onCloseMobile }: HeaderSearchProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [mounted, setMounted] = useState(false);

  // Modal view states
  const [viewCustomer, setViewCustomer] = useState<GlobalSearchCustomer | null>(null);
  const [viewLifeId, setViewLifeId] = useState<string | number | null>(null);
  const [viewHealthId, setViewHealthId] = useState<string | number | null>(null);
  const [viewMotorId, setViewMotorId] = useState<string | number | null>(null);
  const [viewOtherId, setViewOtherId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Global search API query
  const { data: searchData, isLoading, isFetching } = useGlobalSearch({
    query: debouncedQuery,
    enabled: isOpen && debouncedQuery.length >= 2,
  });

  // Global shortcut: Ctrl+K or Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results: GlobalSearchResults = useMemo(() => {
    return searchData?.results || {};
  }, [searchData]);

  const totalResults = searchData?.total_results ?? 0;

  // Extract category counts
  const categoriesList = useMemo(() => {
    const list: Array<{ key: CategoryKey; label: string; count: number; icon: React.ElementType }> = [
      { key: 'all', label: 'All', count: totalResults, icon: Search },
    ];

    if (results.customers?.total) {
      list.push({ key: 'customers', label: 'Customers', count: results.customers.total, icon: Users });
    }
    if (results.life_insurance?.total) {
      list.push({ key: 'life_insurance', label: 'Life', count: results.life_insurance.total, icon: HeartPulse });
    }
    if (results.health_insurance?.total) {
      list.push({ key: 'health_insurance', label: 'Health', count: results.health_insurance.total, icon: Stethoscope });
    }
    if (results.motor_insurance?.total) {
      list.push({ key: 'motor_insurance', label: 'Motor', count: results.motor_insurance.total, icon: Car });
    }
    if (results.other_insurance?.total) {
      list.push({ key: 'other_insurance', label: 'Other', count: results.other_insurance.total, icon: Umbrella });
    }
    if (results.claims?.total) {
      list.push({ key: 'claims', label: 'Claims', count: results.claims.total, icon: FileText });
    }
    if (results.leads?.total) {
      list.push({ key: 'leads', label: 'Leads', count: results.leads.total, icon: PhoneCall });
    }
    if (results.health_quotations?.total) {
      list.push({ key: 'health_quotations', label: 'Health Quotes', count: results.health_quotations.total, icon: Calculator });
    }
    if (results.motor_quotations?.total) {
      list.push({ key: 'motor_quotations', label: 'Motor Quotes', count: results.motor_quotations.total, icon: Calculator });
    }

    return list;
  }, [results, totalResults]);

  useEffect(() => {
    if (selectedCategory !== 'all' && !categoriesList.some((c) => c.key === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categoriesList, selectedCategory]);

  const handleClear = () => {
    setSearchInput('');
    setDebouncedQuery('');
    inputRef.current?.focus();
  };

  // Open respective VIEW modals exactly matching the table's view icon
  const handleOpenCustomer = (cust: GlobalSearchCustomer) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    setViewCustomer(cust);
  };

  const handleOpenLifeInsurance = (policy: GlobalSearchInsurancePolicy) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    setViewLifeId(policy.policy_id);
  };

  const handleOpenHealthInsurance = (policy: GlobalSearchInsurancePolicy) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    setViewHealthId(policy.policy_id);
  };

  const handleOpenMotorInsurance = (policy: GlobalSearchInsurancePolicy) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    setViewMotorId(policy.policy_id);
  };

  const handleOpenOtherInsurance = (policy: GlobalSearchInsurancePolicy) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    setViewOtherId(String(policy.policy_id));
  };

  const handleOpenClaim = (claim: GlobalSearchClaim) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    router.push(`/claim/add?id=${claim.claim_id}`);
  };

  const handleOpenLead = () => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    router.push('/manage-leads');
  };

  const handleOpenQuotation = (path: string) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    router.push(path);
  };

  const formatCurrency = (val: string | number) => {
    const num = Number(val);
    if (isNaN(num)) return val ? `₹${val}` : '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const hasSearchText = searchInput.trim().length > 0;
  const isTypingShort = hasSearchText && debouncedQuery.length < 2;
  const isSearching = isLoading || isFetching;

  return (
    <>
      <div ref={containerRef} className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-[560px]'}`}>
        {/* Search Bar Input */}
        <div className="relative group flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => {
              if (searchInput.trim().length >= 1) setIsOpen(true);
            }}
            placeholder="Search customer, policy, claim, loan, SIP..."
            className="w-full pl-9 pr-20 py-2 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/15 focus:border-[#2F439D] shadow-xs"
          />

          {/* Left Search Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#2F439D] transition-colors">
            <Search size={15} />
          </div>

          {/* Right Action Icons */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isSearching && (
              <Loader2 size={14} className="text-[#2F439D] animate-spin" />
            )}

            {hasSearchText && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}

            {!isMobile && !hasSearchText && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Search Results Popover Dropdown (Sleek SaaS Command Palette Design) */}
        {isOpen && hasSearchText && (
          <div
            className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] border border-slate-200/90 z-[70] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ maxHeight: '72vh' }}
          >
            {/* Minimal Header Bar with Total Count and Category Filter Chips */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100 px-3.5 py-2.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700">Search Results</span>
                  {debouncedQuery && (
                    <span className="text-[11px] text-slate-400 font-normal truncate">
                      for <span className="font-bold text-[#2F439D]">&ldquo;{debouncedQuery}&rdquo;</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isSearching && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2F439D]/10 text-[#2F439D]">
                      {totalResults} {totalResults === 1 ? 'result' : 'results'}
                    </span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              {categoriesList.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.key;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${isSelected
                            ? 'bg-[#2F439D] text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                          }`}
                      >
                        <Icon size={12} className={isSelected ? 'text-white' : 'text-slate-400'} />
                        <span>{cat.label}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scrollable Results List Body */}
            <div className="overflow-y-auto px-2 py-2 space-y-3 max-h-[56vh] custom-scroll">
              {/* Short query prompt */}
              {isTypingShort && (
                <div className="py-7 px-4 text-center">
                  <Search size={20} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Type at least 2 characters to search</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Search across customers, policies, claims, quotations, leads</p>
                </div>
              )}

              {/* Loading state */}
              {isSearching && (
                <div className="py-5 px-3 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-[#2F439D] font-semibold py-1">
                    <Loader2 size={15} className="animate-spin" />
                    <span>Searching database...</span>
                  </div>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="p-2.5 rounded-xl bg-slate-50 animate-pulse flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isSearching && !isTypingShort && totalResults === 0 && (
                <div className="py-9 px-4 text-center">
                  <AlertCircle size={22} className="mx-auto text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-slate-800">No matching records found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No results for &ldquo;{debouncedQuery}&rdquo;. Try searching by name, policy number, or phone.
                  </p>
                </div>
              )}

              {/* Results Grouped View */}
              {!isSearching && !isTypingShort && totalResults > 0 && (
                <div className="space-y-3">
                  {/* 1. CUSTOMERS SECTION: ONLY NAME AND MOBILE NUMBER */}
                  {(selectedCategory === 'all' || selectedCategory === 'customers') &&
                    results.customers &&
                    results.customers.list.length > 0 && (
                      <div>
                        {/* Section Header */}
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Users size={13} className="text-[#2F439D]" />
                            Customers
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.customers.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.customers.list.map((cust: GlobalSearchCustomer) => {
                            const firstChar = (cust.full_name || 'C').trim().charAt(0).toUpperCase();

                            return (
                              <div
                                key={cust.customer_id}
                                onClick={() => handleOpenCustomer(cust)}
                                className="group px-3 py-2 rounded-xl hover:bg-blue-50/60 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-blue-100/80"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {/* Circular Avatar with First Character (NO image) */}
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2F439D] to-[#4A64D4] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                    {firstChar}
                                  </div>

                                  {/* ONLY Customer Full Name and Mobile Number */}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#2F439D] transition-colors truncate leading-snug">
                                      {cust.full_name}
                                    </p>
                                    <p className="text-[11px] font-semibold text-slate-500 leading-snug mt-0.5">
                                      {cust.number || '-'}
                                    </p>
                                  </div>
                                </div>

                                {/* View Action Indicator */}
                                <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-[#2F439D] group-hover:bg-blue-100/50 transition-all shrink-0">
                                  <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                  <Eye size={13} strokeWidth={2.2} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* 2. LIFE INSURANCE SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'life_insurance') &&
                    results.life_insurance &&
                    results.life_insurance.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <HeartPulse size={13} className="text-rose-500" />
                            Life Insurance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.life_insurance.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.life_insurance.list.map((policy: GlobalSearchInsurancePolicy) => (
                            <div
                              key={`life-${policy.policy_id}`}
                              onClick={() => handleOpenLifeInsurance(policy)}
                              className="group px-3 py-2 rounded-xl hover:bg-rose-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-rose-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                                  <HeartPulse size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  {/* Line 1: Policy #, Company Name, Status */}
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                      #{policy.policy_number}
                                    </span>
                                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[220px]">
                                      {policy.company_name}
                                    </span>
                                    {policy.expired === 1 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                        Expired
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">
                                        Active
                                      </span>
                                    )}
                                  </div>

                                  {/* Line 2: Customer Name, Mobile, Premium, Dates */}
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap leading-tight">
                                    <span className="font-semibold text-slate-800">{policy.customer_name}</span>
                                    {policy.customer_number && <span className="font-medium text-slate-500">• {policy.customer_number}</span>}
                                    {policy.total_premium && (
                                      <span className="font-bold text-[#2F439D] bg-blue-50/80 px-1.5 py-0.2 rounded">
                                        Prem: {formatCurrency(policy.total_premium)}
                                      </span>
                                    )}
                                    {policy.policy_start_date && (
                                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                                        <Calendar size={10} />
                                        {policy.policy_start_date} → {policy.policy_end_date || 'N/A'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 3. HEALTH INSURANCE SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'health_insurance') &&
                    results.health_insurance &&
                    results.health_insurance.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Stethoscope size={13} className="text-emerald-600" />
                            Health Insurance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.health_insurance.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.health_insurance.list.map((policy: GlobalSearchInsurancePolicy) => (
                            <div
                              key={`health-${policy.policy_id}`}
                              onClick={() => handleOpenHealthInsurance(policy)}
                              className="group px-3 py-2 rounded-xl hover:bg-emerald-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-emerald-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                  <Stethoscope size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                      #{policy.policy_number}
                                    </span>
                                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[220px]">
                                      {policy.company_name}
                                    </span>
                                    {policy.expired === 1 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                        Expired
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">
                                        Active
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap leading-tight">
                                    <span className="font-semibold text-slate-800">{policy.customer_name}</span>
                                    {policy.customer_number && <span className="font-medium text-slate-500">• {policy.customer_number}</span>}
                                    {policy.total_premium && (
                                      <span className="font-bold text-emerald-700 bg-emerald-50/80 px-1.5 py-0.2 rounded">
                                        Prem: {formatCurrency(policy.total_premium)}
                                      </span>
                                    )}
                                    {policy.policy_start_date && (
                                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                                        <Calendar size={10} />
                                        {policy.policy_start_date} → {policy.policy_end_date || 'N/A'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 4. MOTOR INSURANCE SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'motor_insurance') &&
                    results.motor_insurance &&
                    results.motor_insurance.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Car size={13} className="text-blue-600" />
                            Motor Insurance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.motor_insurance.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.motor_insurance.list.map((policy: GlobalSearchInsurancePolicy) => (
                            <div
                              key={`motor-${policy.policy_id}`}
                              onClick={() => handleOpenMotorInsurance(policy)}
                              className="group px-3 py-2 rounded-xl hover:bg-blue-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-blue-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                                  <Car size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                      #{policy.policy_number}
                                    </span>
                                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[220px]">
                                      {policy.company_name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap leading-tight">
                                    <span className="font-semibold text-slate-800">{policy.customer_name}</span>
                                    {policy.customer_number && <span className="font-medium text-slate-500">• {policy.customer_number}</span>}
                                    {policy.total_premium && (
                                      <span className="font-bold text-blue-700 bg-blue-50/80 px-1.5 py-0.2 rounded">
                                        Prem: {formatCurrency(policy.total_premium)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 5. OTHER INSURANCE SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'other_insurance') &&
                    results.other_insurance &&
                    results.other_insurance.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Umbrella size={13} className="text-amber-600" />
                            Other Insurance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.other_insurance.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.other_insurance.list.map((policy: GlobalSearchInsurancePolicy) => (
                            <div
                              key={`other-${policy.policy_id}`}
                              onClick={() => handleOpenOtherInsurance(policy)}
                              className="group px-3 py-2 rounded-xl hover:bg-amber-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-amber-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                                  <Umbrella size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                      #{policy.policy_number}
                                    </span>
                                    {policy.insurance_type_name && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100/70 text-amber-800 border border-amber-200/50">
                                        {policy.insurance_type_name}
                                      </span>
                                    )}
                                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[200px]">
                                      {policy.company_name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap leading-tight">
                                    <span className="font-semibold text-slate-800">{policy.customer_name}</span>
                                    {policy.customer_number && <span className="font-medium text-slate-500">• {policy.customer_number}</span>}
                                    {policy.total_premium && (
                                      <span className="font-bold text-amber-700 bg-amber-50/80 px-1.5 py-0.2 rounded">
                                        Prem: {formatCurrency(policy.total_premium)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 6. CLAIMS SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'claims') &&
                    results.claims &&
                    results.claims.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <FileText size={13} className="text-purple-600" />
                            Claims
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.claims.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.claims.list.map((claim: GlobalSearchClaim) => (
                            <div
                              key={`claim-${claim.claim_id}`}
                              onClick={() => handleOpenClaim(claim)}
                              className="group px-3 py-2 rounded-xl hover:bg-purple-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-purple-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                                  <FileText size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                                    <span className="font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60">
                                      #{claim.claim_number}
                                    </span>
                                    <span className="text-[12px] font-semibold text-slate-800 truncate">
                                      {claim.customer_name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap leading-tight">
                                    {claim.customer_number && <span className="font-medium text-slate-500">{claim.customer_number}</span>}
                                    {claim.claim_amount && (
                                      <span className="font-bold text-purple-700 bg-purple-50/80 px-1.5 py-0.2 rounded">
                                        Claim Amt: {formatCurrency(claim.claim_amount)}
                                      </span>
                                    )}
                                    {claim.created_at && (
                                      <span className="text-slate-400 text-[10px]">Date: {claim.created_at}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 7. LEADS SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'leads') &&
                    results.leads &&
                    results.leads.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <PhoneCall size={13} className="text-teal-600" />
                            Leads
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.leads.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.leads.list.map((lead: GlobalSearchLead, idx: number) => (
                            <div
                              key={`lead-${lead.lead_id || lead.id || idx}`}
                              onClick={handleOpenLead}
                              className="group px-3 py-2 rounded-xl hover:bg-teal-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-teal-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                                  <PhoneCall size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <span className="text-[13px] font-bold text-slate-900 group-hover:text-teal-700 block truncate leading-snug">
                                    {lead.name || lead.customer_name || 'Lead Record'}
                                  </span>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 leading-tight">
                                    {(lead.number || lead.phone) && <span>{lead.number || lead.phone}</span>}
                                    {lead.product_name && (
                                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1 rounded">• {lead.product_name}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 8. HEALTH QUOTATIONS SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'health_quotations') &&
                    results.health_quotations &&
                    results.health_quotations.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Calculator size={13} className="text-indigo-600" />
                            Health Quotations
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.health_quotations.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.health_quotations.list.map((quote: GlobalSearchQuotation, idx: number) => (
                            <div
                              key={`hq-${quote.quotation_id || quote.id || idx}`}
                              onClick={() => handleOpenQuotation('/quotation/health')}
                              className="group px-3 py-2 rounded-xl hover:bg-indigo-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-indigo-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                                  <Calculator size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <span className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-700 block truncate leading-snug">
                                    {quote.quote_number ? `Quote #${quote.quote_number}` : (quote.customer_name || 'Quotation')}
                                  </span>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 leading-tight">
                                    {quote.customer_name && <span>{quote.customer_name}</span>}
                                    {quote.company_name && <span>• {quote.company_name}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 9. MOTOR QUOTATIONS SECTION */}
                  {(selectedCategory === 'all' || selectedCategory === 'motor_quotations') &&
                    results.motor_quotations &&
                    results.motor_quotations.list.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Calculator size={13} className="text-sky-600" />
                            Motor Quotations
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            {results.motor_quotations.total}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {results.motor_quotations.list.map((quote: GlobalSearchQuotation, idx: number) => (
                            <div
                              key={`mq-${quote.quotation_id || quote.id || idx}`}
                              onClick={() => handleOpenQuotation('/quotation/motor')}
                              className="group px-3 py-2 rounded-xl hover:bg-sky-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-sky-100/80"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                                  <Calculator size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <span className="text-[13px] font-bold text-slate-900 group-hover:text-sky-700 block truncate leading-snug">
                                    {quote.quote_number ? `Quote #${quote.quote_number}` : (quote.customer_name || 'Quotation')}
                                  </span>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 leading-tight">
                                    {quote.customer_name && <span>{quote.customer_name}</span>}
                                    {quote.company_name && <span>• {quote.company_name}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 group-hover:text-sky-600 group-hover:bg-sky-100/50 transition-all shrink-0">
                                <span className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                                <Eye size={13} strokeWidth={2.2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="bg-slate-50/90 border-t border-slate-100 px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono font-semibold">Esc</kbd> to close
              </span>
              <span>Click record to view details</span>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODALS: Rendered directly to document.body via Portal so they are never clipped or trapped */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <>
          <CustomerViewModal
            isOpen={Boolean(viewCustomer)}
            customer={viewCustomer}
            onClose={() => setViewCustomer(null)}
          />

          <LifeInsuranceViewModal
            isOpen={Boolean(viewLifeId)}
            lifeInsuranceId={viewLifeId}
            onClose={() => setViewLifeId(null)}
          />

          <HealthInsuranceViewModal
            isOpen={Boolean(viewHealthId)}
            healthInsuranceId={viewHealthId}
            onClose={() => setViewHealthId(null)}
          />

          <MotorInsuranceViewModal
            isOpen={Boolean(viewMotorId)}
            motorInsuranceId={viewMotorId}
            onClose={() => setViewMotorId(null)}
          />

          <ViewOtherInsuranceModal
            isOpen={Boolean(viewOtherId)}
            id={viewOtherId}
            onClose={() => setViewOtherId(null)}
          />
        </>,
        document.body
      )}
    </>
  );
}
