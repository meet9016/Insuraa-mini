import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, Settings, Users, Building2, BookOpen, Search, ChevronDown, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { validateLifeInsurance } from '@/utils/validation';
import { useCustomerList } from '@/hooks/useCustomerApi';
import {
  useLifeInsuranceActions,
  useLifeInsuranceMasterData,
  useLifeInsuranceCompanyPlansAndAgency,
  LifeInsurancePayload
} from '@/hooks/useLifeInsuranceApi';
import { useLifeCompanyActions } from '@/hooks/useLifeCompanyApi';

const parseDateStr = (str: string): Date | null => {
  if (!str) return null;
  const cleanStr = String(str).trim().split(' ')[0].split('T')[0];
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[-/]/).map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanStr)) {
    const parts = cleanStr.split(/[-/]/).map(Number);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  const d = new Date(cleanStr);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function CompanySelectWithAdd({
  companyList,
  selectedId,
  onChange,
  onAddCompany,
  error,
}: {
  companyList: Array<{ id: string | number; name: string }>;
  selectedId: string | number;
  onChange: (id: string) => void;
  onAddCompany: (comp: { id: string | number; name: string }) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { insertLifeCompany } = useLifeCompanyActions();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCompany = companyList.find((c: any) => String(c.id) === String(selectedId));

  const filteredCompanies = companyList.filter((c: any) =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newCompanyInput.trim() || isAdding) return;
    setIsAdding(true);
    const newName = newCompanyInput.trim();
    try {
      const success = await insertLifeCompany(newName);
      if (success) {
        const newId = `custom_${Date.now()}`;
        const newComp = { id: newId, name: newName };
        onAddCompany(newComp);
        setNewCompanyInput('');
        setSearchQuery('');
      }
    } catch (err: any) {
      // handled inside hook
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full min-h-[42px] bg-white border ${error ? '!border-red-500 ring-2 ring-red-500/20' : isOpen ? 'border-[#2B4399] ring-2 ring-[#2B4399]/15' : 'border-gray-200 hover:border-gray-300'
          } rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer transition-all shadow-2xs`}
      >
        <span className={`text-sm ${selectedCompany ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {selectedCompany ? selectedCompany.name : 'Select Insurance Company Name'}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2B4399]' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 ">
          {/* Search Bar using common Input component */}
          <div>
            <Input
              name="company_search_query"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              placeholder="Search company..."
              icon={<Search size={16} className="text-gray-400" />}
              className="!h-[38px] text-xs sm:text-sm border-gray-200 focus:border-[#2B4399]"
            />
          </div>

          {/* Options List */}
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((c: any) => {
                const isSelected = String(c.id) === String(selectedId);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onChange(String(c.id));
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between cursor-pointer ${isSelected
                      ? 'bg-[#EEF2FF] text-[#2B4399] font-bold'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                      }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {isSelected && <Check size={16} className="text-[#2B4399] shrink-0 ml-2" />}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 py-3 text-center">No company found</div>
            )}
          </div>

          {/* Add New Company Container */}
          <div className="bg-[#F3F4FF] border border-[#E0E7FF] p-2 rounded-2xl flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#2B4399] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Plus size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <Input
                name="new_company_name"
                value={newCompanyInput}
                onChange={(e: any) => setNewCompanyInput(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="Enter new company name..."
                disabled={isAdding}
                className="!h-[36px] text-xs sm:text-sm border-[#C7D2FE] focus:border-[#2B4399]"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className="h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white px-4 rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0 disabled:opacity-50 flex items-center justify-center"
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanSelectWithAdd({
  planList,
  selectedId,
  companyId,
  onChange,
  onAddPlan,
  error,
}: {
  planList: Array<{ id: string | number; name: string }>;
  selectedId: string | number;
  companyId: string | number;
  onChange: (id: string) => void;
  onAddPlan: (plan: { id: string | number; name: string }) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlanInput, setNewPlanInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { insertLifeCompanyPlan } = useLifeCompanyActions();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPlan = planList.find((c: any) => String(c.id) === String(selectedId));

  const filteredPlans = planList.filter((c: any) =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newPlanInput.trim() || isAdding || !companyId) return;
    setIsAdding(true);
    const newName = newPlanInput.trim();
    try {
      const success = await insertLifeCompanyPlan(String(companyId), newName);
      if (success) {
        const newId = `custom_plan_${Date.now()}`;
        const newPlan = { id: newId, name: newName };
        onAddPlan(newPlan);
        setNewPlanInput('');
        setSearchQuery('');
      }
    } catch (err: any) {
      // handled inside hook
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full min-h-[42px] bg-white border ${error ? '!border-red-500 ring-2 ring-red-500/20' : isOpen ? 'border-[#2B4399] ring-2 ring-[#2B4399]/15' : 'border-gray-200 hover:border-gray-300'
          } rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer transition-all shadow-2xs`}
      >
        <span className={`text-sm ${selectedPlan ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {selectedPlan ? selectedPlan.name : 'Select Company Plan Name'}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2B4399]' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div>
            <Input
              name="plan_search_query"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              placeholder="Search plan..."
              icon={<Search size={16} className="text-gray-400" />}
              className="!h-[38px] text-xs sm:text-sm border-gray-200 focus:border-[#2B4399]"
            />
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((c: any) => {
                const isSelected = String(c.id) === String(selectedId);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onChange(String(c.id));
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between cursor-pointer ${isSelected
                      ? 'bg-[#EEF2FF] text-[#2B4399] font-bold'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                      }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {isSelected && <Check size={16} className="text-[#2B4399] shrink-0 ml-2" />}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 py-3 text-center">No plan found</div>
            )}
          </div>

          <div className="bg-[#F3F4FF] border border-[#E0E7FF] p-2 rounded-2xl flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#2B4399] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Plus size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <Input
                name="new_plan_name"
                value={newPlanInput}
                onChange={(e: any) => setNewPlanInput(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="Enter new plan name..."
                disabled={isAdding || !companyId}
                className="!h-[36px] text-xs sm:text-sm border-[#C7D2FE] focus:border-[#2B4399]"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding || !companyId}
              className="h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white px-4 rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0 disabled:opacity-50 flex items-center justify-center"
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddLifeInsurance() {
  const router = useRouter();
  const { insertLifeInsurance } = useLifeInsuranceActions();
  const { data: masterData } = useLifeInsuranceMasterData();

  // Fetch dropdown data
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });
  const customerList = customerRes?.customerList || [];
  const queryClient = useQueryClient();

  const [customCompanies, setCustomCompanies] = useState<Array<{ id: string | number; name: string }>>([]);

  const companyList = React.useMemo(() => {
    const base = masterData?.companies || [];
    // Avoid showing duplicates by filtering out custom companies that have already been fetched from the API
    const baseNames = new Set(base.map((c: any) => (c.name || '').toLowerCase().trim()));
    const uniqueCustomCompanies = customCompanies.filter((c: any) => !baseNames.has((c.name || '').toLowerCase().trim()));
    return [...base, ...uniqueCustomCompanies];
  }, [masterData?.companies, customCompanies]);

  const handleAddCustomCompany = (newComp: { id: string | number; name: string }) => {
    setCustomCompanies(prev => [...prev, newComp]);
    queryClient.invalidateQueries({ queryKey: ["lifeInsuranceMasterData"] });
    queryClient.invalidateQueries({ queryKey: ["lifeCompanyList"] });
  };

  const paymentModes = masterData?.payment_mode || [];
  const riderListOptions = masterData?.riders || [];
  const documentListOptions = masterData?.document_name || [];
  const relationshipOptions = masterData?.relationship || [];
  const planTypeOptions = masterData?.plan_type || [];
  const policyTermOptions = masterData?.policy_term || [];

  const [formData, setFormData] = useState({
    life_insurance_id: '',
    customer_id: '',
    policy_holder: '',
    agent: '',
    companies_id: '',
    companies_agency_code: '',
    plan_name: '',
    branch: '',
    payment_mode: '',
    policy_number: '',
    policy_premium_term: '',
    policy_term: '',
    policy_login_date: '',
    policy_start_date: '',
    policy_end_date: '',
    policy_maturity_date: '',
    maturity_amount: '',
    plan_type: '',
    sum_assured: '',
    net_premium: '',
    total_net_premium: '',
    fy_gst: '18',
    gst_amount: '',
    total_premium: '',
    customer_payment_mode: '',
    premium_overdue_days: '',
    regenerate_installments: false,
    note: '',
    bank_name: '',
    account_type: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    company_commission: '',
    company_tds: '',
  });

  const { data: plansAndAgencyRes } = useLifeInsuranceCompanyPlansAndAgency(formData.companies_id);
  const companyPlans = plansAndAgencyRes?.plan_list || [];
  const agencyCodeList = plansAndAgencyRes?.agency_code || [];

  const [customPlans, setCustomPlans] = useState<Array<{ id: string | number; name: string }>>([]);

  const planList = React.useMemo(() => {
    const base = companyPlans.map((p: any) => ({
      id: p.id || p.plan_id,
      name: p.plan_name || p.name || `Plan #${p.id || p.plan_id}`
    }));
    const baseNames = new Set(base.map((c: any) => (c.name || '').toLowerCase().trim()));
    const uniqueCustomPlans = customPlans.filter((c: any) => !baseNames.has((c.name || '').toLowerCase().trim()));
    return [...base, ...uniqueCustomPlans];
  }, [companyPlans, customPlans]);

  const handleAddCustomPlan = (newPlan: { id: string | number; name: string }) => {
    setCustomPlans(prev => [...prev, newPlan]);
  };

  // Files & dynamic state arrays
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');

  const [riders, setRiders] = useState<Array<{ id: number; riders_id: string; riders_amount: string; riders_note: string }>>([
    { id: 1, riders_id: '', riders_amount: '', riders_note: '' }
  ]);

  const [nominees, setNominees] = useState<Array<{ id: number; nomainee_name: string; nomainee_relationship: string; nomainee_per: string }>>([
    { id: 1, nomainee_name: '', nomainee_relationship: '', nomainee_per: '' }
  ]);

  const [documents, setDocuments] = useState<Array<{ id: number; other_document_name: string; other_document_image: File | null; existing_image_url?: string | null }>>([
    { id: 1, other_document_name: '', other_document_image: null }
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const queryId = router.query.id ? String(router.query.id) : '';
    if (!queryId) return;

    setFormData(prev => ({ ...prev, life_insurance_id: queryId }));

    const fetchDetail = async () => {
      try {
        const formData = new FormData();
        formData.append('life_insurance_id', queryId);

        let item: any = null;

        try {
          const viewResponse = await api.post(endPointApi.LIFE_INSURANCE.VIEW_LIFE_INSURANCE, formData);
          const viewResData = viewResponse?.data;
          item = viewResData?.data || viewResData?.life_insurance_details || viewResData;
          if (typeof item === 'object' && item?.data) {
            item = item.data;
          }
        } catch (e) {
          console.warn('View endpoint failed, falling back to list endpoint', e);
        }

        if (!item || (!item.customer_id && !item.policy_number && !item.companies_id)) {
          const listFormData = new FormData();
          listFormData.append('life_insurance_id', queryId);
          listFormData.append('id', queryId);
          listFormData.append('search', queryId);
          listFormData.append('limit', '100');
          listFormData.append('page', '1');

          const response = await api.post(endPointApi.LIFE_INSURANCE.LIFE_INSURANCE_LIST, listFormData);
          const resData = response?.data;
          const list = resData?.data?.life_insurance_list || resData?.data?.list || resData?.data || resData?.life_insurance_list || [];
          item = Array.isArray(list)
            ? list.find((c: any) => String(c.id || c.life_insurance_id) === queryId) || list[0]
            : (resData?.data?.life_insurance_details || resData?.data || null);
        }

        if (item) {
          const riderData = item.riders || item.rider || item.life_insurance_riders || item.rider_list || item.riders_list || [];
          const nomineeData = item.nominees || item.nominee || item.life_insurance_nominees || item.nominee_list || item.nominees_list || [];
          const docData = item.other_documents || item.other_document || item.documents || item.document_list || item.other_documents_list || [];

          setFormData(prev => ({
            ...prev,
            life_insurance_id: String(item.id || item.life_insurance_id || queryId),
            customer_id: String(item.customer_id || item.customer?.id || ''),
            companies_id: String(item.companies_id || item.company_id || item.company?.id || ''),
            companies_agency_code: String(item.companies_agency_code || item.agency_code || item.agency_code_id || ''),
            plan_name: String(item.plan_name || item.plan_id || item.company_plan_id || ''),
            payment_mode: String(item.payment_mode || item.payment_mode_id || ''),
            policy_number: item.policy_number || '',
            policy_term: String(item.policy_term || item.policy_term_id || ''),
            policy_premium_term: String(item.policy_premium_term || item.policy_premium_term_id || ''),
            policy_login_date: item.policy_login_date || item.login_date || '',
            policy_start_date: item.policy_start_date || item.start_date || '',
            policy_end_date: item.policy_end_date || item.end_date || '',
            policy_maturity_date: item.policy_maturity_date || item.maturity_date || '',
            maturity_amount: String(item.maturity_amount ?? ''),
            plan_type: String(item.plan_type || item.plan_type_id || ''),
            sum_assured: String(item.sum_assured ?? ''),
            net_premium: String(item.net_premium ?? item.total_premium ?? ''),
            total_net_premium: String(item.total_net_premium ?? item.net_premium ?? ''),
            gst_amount: String(item.gst_amount ?? ''),
            total_premium: String(item.total_premium ?? ''),
            customer_payment_mode: String(item.customer_payment_mode || ''),
            premium_overdue_days: String(item.premium_overdue_days || ''),
            regenerate_installments: Boolean(item.regenerate_installments),
            note: item.note || item.policy_note || item.remarks || item.remark || '',
            bank_name: item.bank_name || '',
            account_type: item.account_type || '',
            account_number: item.account_number || '',
            ifsc_code: item.ifsc_code || '',
            account_holder_name: item.account_holder_name || '',
          }));

          const pdfFile = item.policy_pdf || item.policy_pdf_path || item.policy_file || item.policy_doc || item.policy_pdf_url || item.policy_pdf_image;
          if (pdfFile) {
            setExistingPolicyPdfUrl(String(pdfFile));
          }

          if (Array.isArray(riderData) && riderData.length > 0) {
            setRiders(riderData.map((r: any, index: number) => ({
              id: index + 1,
              riders_id: String(r.riders_id || r.rider_id || r.id || ''),
              riders_amount: String(r.riders_amount || r.rider_amount || r.amount || ''),
              riders_note: r.riders_note || r.rider_note || r.note || r.remarks || ''
            })));
          }

          if (Array.isArray(nomineeData) && nomineeData.length > 0) {
            setNominees(nomineeData.map((n: any, index: number) => ({
              id: index + 1,
              nomainee_name: n.nomainee_name || n.nominee_name || n.name || '',
              nomainee_relationship: String(n.nomainee_relationship || n.nominee_relationship || n.relationship_id || ''),
              nomainee_per: String(n.nomainee_per || n.nominee_per || n.percentage || '100')
            })));
          }

          if (Array.isArray(docData) && docData.length > 0) {
            setDocuments(docData.map((d: any, index: number) => ({
              id: index + 1,
              other_document_name: String(d.other_document_name || d.document_name || d.name || d.other_document_id || d.document_id || ''),
              other_document_image: null,
              existing_image_url: d.other_document_image || d.document_image || d.image || d.file || d.path || d.image_url || d.url || null
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching life insurance details for edit:', err);
      }
    };

    fetchDetail();
  }, [router.isReady, router.query.id]);

  // Auto-calculate Policy End Date & Maturity Date based on Start Date, Premium Term, Policy Term & Payment Mode
  useEffect(() => {
    if (!formData.policy_start_date) return;

    const startDate = parseDateStr(formData.policy_start_date);
    const premiumTerm = parseInt(String(formData.policy_premium_term), 10) || 0;
    const policyTerm = parseInt(String(formData.policy_term), 10) || 0;

    const pmObj = paymentModes.find(
      (pm: any) => String(pm.id) === String(formData.payment_mode) || String(pm.name) === String(formData.payment_mode)
    );
    const paymentModeName = (pmObj?.name || String(formData.payment_mode || '')).toLowerCase().trim();

    let computedEndDate = '';
    let computedMaturityDate = '';

    // ── Premium End Date Calculation ──
    if (startDate && premiumTerm > 0 && paymentModeName) {
      const premiumEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

      if (paymentModeName.includes('yearly') && !paymentModeName.includes('half')) {
        premiumEnd.setFullYear(premiumEnd.getFullYear() + premiumTerm - 1);
      } else if (paymentModeName.includes('half')) {
        premiumEnd.setFullYear(premiumEnd.getFullYear() + premiumTerm);
        premiumEnd.setMonth(premiumEnd.getMonth() - 6);
      } else if (paymentModeName.includes('quarter')) {
        premiumEnd.setFullYear(premiumEnd.getFullYear() + premiumTerm);
        premiumEnd.setMonth(premiumEnd.getMonth() - 3);
      } else if (paymentModeName.includes('month')) {
        premiumEnd.setFullYear(premiumEnd.getFullYear() + premiumTerm);
        premiumEnd.setMonth(premiumEnd.getMonth() - 1);
      } else {
        premiumEnd.setFullYear(premiumEnd.getFullYear() + premiumTerm - 1);
      }

      computedEndDate = formatDateStr(premiumEnd);
    }

    // ── Maturity / Term End Date Calculation ──
    if (startDate && policyTerm > 0) {
      const maturityDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      maturityDate.setFullYear(maturityDate.getFullYear() + policyTerm);
      computedMaturityDate = formatDateStr(maturityDate);
    }

    setFormData(prev => {
      let changed = false;
      const update: any = {};

      if (computedEndDate && computedEndDate !== prev.policy_end_date) {
        update.policy_end_date = computedEndDate;
        changed = true;
      }
      if (computedMaturityDate && computedMaturityDate !== prev.policy_maturity_date) {
        update.policy_maturity_date = computedMaturityDate;
        changed = true;
      }

      return changed ? { ...prev, ...update } : prev;
    });
  }, [
    formData.policy_start_date,
    formData.policy_premium_term,
    formData.policy_term,
    formData.payment_mode,
    paymentModes
  ]);

  // Auto-clear validation errors as soon as data gets filled in formData
  useEffect(() => {
    setErrors(prev => {
      let hasChange = false;
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        const val = formData[key as keyof typeof formData];
        if (newErrors[key] && val !== undefined && val !== null && String(val).trim() !== '') {
          delete newErrors[key];
          hasChange = true;
        }
      });
      return hasChange ? newErrors : prev;
    });
  }, [formData]);

  // ── Auto Calculate Total Net Premium and Total Premium ──
  const calculateTotals = (netPrem: string, gstAmt: string, riderList: typeof riders, totalNetPrem?: string) => {
    const net = parseFloat(String(netPrem || '0')) || 0;
    const gst = parseFloat(String(gstAmt || '0')) || 0;
    const riderTotal = riderList.reduce((sum, r) => sum + (parseFloat(String(r.riders_amount || '0')) || 0), 0);

    const hasNetInput = netPrem !== '' || riderTotal > 0 || riderList.some(r => String(r.riders_amount || '').trim() !== '');

    let netPlusRiders = '';
    if (hasNetInput) {
      netPlusRiders = String(net + riderTotal);
    } else if (totalNetPrem !== undefined && totalNetPrem !== '') {
      netPlusRiders = totalNetPrem;
    }

    const netSumVal = parseFloat(netPlusRiders || '0') || 0;
    const hasGstInput = gstAmt !== '';
    const grandTotal = (netPlusRiders !== '' || hasGstInput) ? String(netSumVal + gst) : '';

    return {
      computedTotalNet: netPlusRiders,
      computedTotal: grandTotal
    };
  };

  useEffect(() => {
    const { computedTotalNet, computedTotal } = calculateTotals(
      formData.net_premium,
      formData.gst_amount,
      riders,
      formData.total_net_premium
    );

    setFormData(prev => {
      if (prev.total_net_premium === computedTotalNet && prev.total_premium === computedTotal) {
        return prev;
      }
      return {
        ...prev,
        total_net_premium: computedTotalNet,
        total_premium: computedTotal
      };
    });
  }, [formData.net_premium, formData.gst_amount, riders]);

  const addRider = () => setRiders(prev => [...prev, { id: Date.now(), riders_id: '', riders_amount: '', riders_note: '' }]);
  const removeRider = (id: number) => setRiders(prev => prev.filter(r => r.id !== id));
  const updateRider = (id: number, field: string, value: string) => {
    setRiders(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addNominee = () => setNominees(prev => [...prev, { id: Date.now(), nomainee_name: '', nomainee_relationship: '', nomainee_per: '' }]);
  const removeNominee = (id: number) => setNominees(prev => prev.filter(n => n.id !== id));
  const updateNominee = (id: number, field: string, value: string) => {
    setNominees(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const maxDocs = masterData?.max_documents_allowed || 5;
  const addDocument = () => {
    if (documents.length < maxDocs) {
      setDocuments(prev => [...prev, { id: Date.now(), other_document_name: '', other_document_image: null }]);
    } else {
      toast.warning(`Maximum ${maxDocs} documents allowed`);
    }
  };
  const removeDocument = (id: number) => setDocuments(prev => prev.filter(d => d.id !== id));
  const updateDocument = (id: number, field: string, value: any) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleChange = (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    if (field === 'net_premium' || field === 'gst_amount' || field === 'total_net_premium') {
      const { computedTotalNet, computedTotal } = calculateTotals(
        field === 'net_premium' ? value : formData.net_premium,
        field === 'gst_amount' ? value : formData.gst_amount,
        riders,
        field === 'total_net_premium' ? value : formData.total_net_premium
      );
      setFormData(prev => ({
        ...prev,
        total_net_premium: computedTotalNet,
        total_premium: computedTotal
      }));
    }

    if (errors[field]) {
      const { errors: newErrors } = validateLifeInsurance(updatedForm, nominees);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const handleBlur = (field: string) => {
    if (errors[field] || formData[field as keyof typeof formData]) {
      const { errors: newErrors } = validateLifeInsurance(formData, nominees);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const validateForm = () => {
    const { isValid, errors: newErrors } = validateLifeInsurance(formData, nominees);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    const payload: LifeInsurancePayload = {
      life_insurance_id: formData.life_insurance_id || undefined,
      customer_id: formData.customer_id,
      companies_id: formData.companies_id,
      companies_agency_code: formData.companies_agency_code,
      plan_name: formData.plan_name,
      payment_mode: formData.payment_mode,
      policy_number: formData.policy_number,
      policy_term: formData.policy_term,
      policy_premium_term: formData.policy_premium_term,
      policy_login_date: formData.policy_login_date,
      policy_start_date: formData.policy_start_date,
      policy_end_date: formData.policy_end_date,
      plan_type: formData.plan_type,
      maturity_amount: formData.maturity_amount,
      sum_assured: formData.sum_assured,
      net_premium: formData.net_premium,
      total_net_premium: formData.total_net_premium,
      fy_gst: formData.fy_gst,
      gst_amount: formData.gst_amount,
      total_premium: formData.total_premium,
      note: formData.note,
      bank_name: formData.bank_name,
      account_type: formData.account_type,
      account_number: formData.account_number,
      ifsc_code: formData.ifsc_code,
      account_holder_name: formData.account_holder_name,
      premium_overdue_days: formData.premium_overdue_days,
      customer_payment_mode: formData.customer_payment_mode,
      regenerate_installments: formData.regenerate_installments ? 1 : 0,
      policy_pdf: policyPdf,
      riders: riders.map(r => ({
        riders_id: r.riders_id,
        riders_amount: r.riders_amount,
        riders_note: r.riders_note
      })),
      nominees: nominees.map(n => ({
        nomainee_name: n.nomainee_name,
        nomainee_relationship: n.nomainee_relationship,
        nomainee_per: n.nomainee_per
      })),
      other_documents: documents.map(d => ({
        other_document_name: d.other_document_name,
        other_document_image: d.other_document_image
      }))
    };

    const res = await insertLifeInsurance(payload);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/insurance/life');
    }
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-xl flex items-center justify-between gap-2 mb-6 border-l-4 border-[#2B4399]";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const selectClass = "w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs";

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-0">
      <Head>
        <title>{formData.life_insurance_id ? 'Edit Life Insurance' : 'Add Life Insurance'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">

        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs" title="Go Back">
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-xl font-bold tracking-tight text-gray-900">{formData.life_insurance_id ? 'Edit Life Insurance' : 'Add Life Insurance'}</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Insurance'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-9 bg-white">

          {/* Customer Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Customer Information</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className={labelClass}>Customer Name <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => router.push('/customers/add')} className="text-xs text-[#2B4399] font-bold hover:underline">Add Customer</button>
                </div>
                <Select
                  className={`${selectClass} ${errors.customer_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.customer_id}
                  onChange={(e: any) => handleChange('customer_id', e.target.value)}
                  error={errors.customer_id}
                >
                  <option value="">Select Customer Name</option>
                  {customerList.map((cust: any) => {
                    const id = cust.customer_id || cust.id;
                    const name = cust.full_name || `Customer #${id}`;
                    const phone = cust.number || '';
                    const label = phone ? `${name} (${phone})` : name;
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
                {errors.customer_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.customer_id}</p>}
              </div>
            </div>
          </div>

          {/* Policy PDF Details */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span>Policy PDF Details</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Upload Policy PDF</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xl">
                    <FileUpload
                      name="policy_pdf"
                      accept=".pdf,.doc,.docx,image/*"
                      file={policyPdf}
                      existingUrl={existingPolicyPdfUrl}
                      onChange={(file) => setPolicyPdf(file)}
                      placeholder="Click or drag Policy PDF file to upload"
                    />
                  </div>
                  <button
                    type="button"
                    className="h-[46px] bg-[#2B4399] text-white px-6 rounded-xl text-sm font-bold hover:bg-[#203378] transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0"
                  >
                    <Sparkles size={16} />
                    <span>AI</span>
                  </button>
                </div>
              </div>

              <div className="bg-red-50/70 text-[#cf3838] p-4 rounded-xl text-xs border border-red-100 font-semibold leading-relaxed">
                Note: After Uploading The Policy PDF And Clicking The AI Button, The Form Will Be Auto-Filled. Please Review And Verify All Details Carefully, As AI-Generated Data May Not Be Fully Accurate, Before Saving Or Submitting.
              </div>
            </div>
          </div>

          {/* Insurance Information (Strict 4 Fields Per Row Grid) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>Insurance Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              {/* Row 1 */}
              <div>
                <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                <CompanySelectWithAdd
                  companyList={companyList}
                  selectedId={formData.companies_id}
                  onChange={(val: string) => handleChange('companies_id', val)}
                  onAddCompany={handleAddCustomCompany}
                  error={errors.companies_id}
                />
                {errors.companies_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companies_id}</p>}
              </div>
              <div>
                <label className={labelClass}>Plan Name</label>
                <PlanSelectWithAdd
                  planList={planList}
                  selectedId={formData.plan_name}
                  companyId={formData.companies_id}
                  onChange={(val: string) => handleChange('plan_name', val)}
                  onAddPlan={handleAddCustomPlan}
                  error={errors.plan_name}
                />
                {errors.plan_name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.plan_name}</p>}
              </div>
              <div>
                <label className={labelClass}>Agency Code</label>
                <Select
                  className={selectClass}
                  value={formData.companies_agency_code}
                  onChange={(e: any) => handleChange('companies_agency_code', e.target.value)}
                >
                  <option value="">Select Agency Code</option>
                  {agencyCodeList.map((ac: any) => {
                    const id = ac.id || ac.agency_code_id || ac.code;
                    const label = ac.code ? (ac.name ? `${ac.code} - ${ac.name}` : ac.code) : (ac.name || ac.agency_code || `Code #${id}`);
                    return (
                      <option key={id} value={ac.id || ac.code || id}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.payment_mode ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.payment_mode}
                  onChange={(e: any) => handleChange('payment_mode', e.target.value)}
                  error={errors.payment_mode}
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((pm: any) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </Select>
                {errors.payment_mode && <p className="text-xs text-red-500 font-semibold mt-1">{errors.payment_mode}</p>}
              </div>

              {/* Row 2 */}
              <div>
                <label className={labelClass}>Policy Number <span className="text-red-500">*</span></label>
                <Input
                  name="policy_number"
                  placeholder="Enter Policy Number"
                  value={formData.policy_number}
                  onChange={(e: any) => handleChange('policy_number', e.target.value)}
                  onBlur={() => handleBlur('policy_number')}
                  error={errors.policy_number}
                />
              </div>
              <div>
                <label className={labelClass}>Policy Premium Term (Y)<span className="text-red-500">*</span></label>
                {policyTermOptions.length > 0 ? (
                  <Select
                    className={`${selectClass} ${errors.policy_premium_term ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                    value={formData.policy_premium_term}
                    onChange={(e: any) => handleChange('policy_premium_term', e.target.value)}
                    error={errors.policy_premium_term}
                  >
                    <option value="">Select Premium Term</option>
                    {policyTermOptions.map((pt: any) => (
                      <option key={pt.id} value={pt.term || pt.id}>
                        {pt.term || pt.id}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    name="policy_premium_term"
                    placeholder="Enter Premium Term"
                    value={formData.policy_premium_term}
                    onChange={(e: any) => handleChange('policy_premium_term', e.target.value)}
                    onBlur={() => handleBlur('policy_premium_term')}
                    error={errors.policy_premium_term}
                  />
                )}
                {policyTermOptions.length > 0 && errors.policy_premium_term && <p className="text-xs text-red-500 font-semibold mt-1">{errors.policy_premium_term}</p>}
              </div>
              <div>
                <label className={labelClass}>Policy Term (Y)<span className="text-red-500">*</span></label>
                {policyTermOptions.length > 0 ? (
                  <Select
                    className={`${selectClass} ${errors.policy_term ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                    value={formData.policy_term}
                    onChange={(e: any) => handleChange('policy_term', e.target.value)}
                    error={errors.policy_term}
                  >
                    <option value="">Select Policy Term</option>
                    {policyTermOptions.map((pt: any) => (
                      <option key={pt.id} value={pt.term || pt.id}>
                        {pt.term || pt.id}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    name="policy_term"
                    placeholder="Enter Policy Term"
                    value={formData.policy_term}
                    onChange={(e: any) => handleChange('policy_term', e.target.value)}
                    onBlur={() => handleBlur('policy_term')}
                    error={errors.policy_term}
                  />
                )}
                {policyTermOptions.length > 0 && errors.policy_term && <p className="text-xs text-red-500 font-semibold mt-1">{errors.policy_term}</p>}
              </div>
              <div>
                <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_login_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  placeholder="Select Login Date"
                  value={formData.policy_login_date}
                  onChange={(dateStr: string) => handleChange('policy_login_date', dateStr)}
                  error={errors.policy_login_date}
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_start_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  placeholder="Select Start Date"
                  value={formData.policy_start_date}
                  onChange={(dateStr: string) => handleChange('policy_start_date', dateStr)}
                  error={errors.policy_start_date}
                />
              </div>
              <div>
                <label className={labelClass}>Policy Premium End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_end_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  placeholder="Select Premium End Date"
                  value={formData.policy_end_date}
                  onChange={(dateStr: string) => handleChange('policy_end_date', dateStr)}
                  error={errors.policy_end_date}
                />
              </div>
              <div>
                <label className={labelClass}>Policy Maturity Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_maturity_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  placeholder="Select Maturity Date"
                  value={formData.policy_maturity_date}
                  onChange={(dateStr: string) => handleChange('policy_maturity_date', dateStr)}
                  error={errors.policy_maturity_date}
                />
              </div>
              <div>
                <label className={labelClass}>Maturity Amount</label>
                <Input
                  name="maturity_amount"
                  placeholder="Enter Maturity Amount"
                  value={formData.maturity_amount}
                  onChange={(e: any) => handleChange('maturity_amount', e.target.value)}
                  onBlur={() => handleBlur('maturity_amount')}
                  error={errors.maturity_amount}
                />
              </div>

              {/* Row 4 */}
              <div>
                <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.plan_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.plan_type}
                  onChange={(e: any) => handleChange('plan_type', e.target.value)}
                  error={errors.plan_type}
                >
                  <option value="">Select Plan Type</option>
                  {planTypeOptions.map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </Select>
                {errors.plan_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.plan_type}</p>}
              </div>
              <div>
                <label className={labelClass}>Sum Assured <span className="text-red-500">*</span></label>
                <Input
                  name="sum_assured"
                  placeholder="Enter Sum Assured"
                  value={formData.sum_assured}
                  onChange={(e: any) => handleChange('sum_assured', e.target.value)}
                  onBlur={() => handleBlur('sum_assured')}
                  error={errors.sum_assured}
                />
              </div>
              <div>
                <label className={labelClass}>Net Premium<span className="text-red-500">*</span></label>
                <Input
                  name="net_premium"
                  placeholder="Enter Net Premium"
                  value={formData.net_premium}
                  onChange={(e: any) => handleChange('net_premium', e.target.value)}
                  onBlur={() => handleBlur('net_premium')}
                  error={errors.net_premium}
                />
              </div>
              <div>
                <label className={labelClass}>GST Amount</label>
                <Input
                  name="gst_amount"
                  placeholder="Enter GST Amount"
                  value={formData.gst_amount}
                  onChange={(e: any) => handleChange('gst_amount', e.target.value)}
                  onBlur={() => handleBlur('gst_amount')}
                  error={errors.gst_amount}
                />
              </div>

              {/* Dynamic Riders Fields */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-5">
                {riders.map((rider, index) => (
                  <div key={rider.id} className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 w-full sm:w-1/3">
                      <label className={labelClass}>Rider Name</label>
                      <Select
                        className={selectClass}
                        value={rider.riders_id}
                        onChange={(e: any) => updateRider(rider.id, 'riders_id', e.target.value)}
                      >
                        <option value="">Select Rider</option>
                        {riderListOptions.map((rd: any) => {
                          const rId = rd.id || rd.rider_id;
                          const rName = rd.name || rd.rider_name || `Rider #${rId}`;
                          return (
                            <option key={rId} value={rId}>
                              {rName}
                            </option>
                          );
                        })}
                      </Select>
                    </div>
                    <div className="flex-1 w-full sm:w-1/3">
                      <label className={labelClass}>Rider Amount</label>
                      <Input
                        name={`riders_amount_${rider.id}`}
                        placeholder="Enter Amount"
                        value={rider.riders_amount}
                        onChange={(e: any) => updateRider(rider.id, 'riders_amount', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 w-full sm:w-1/3">
                      <label className={labelClass}>Note</label>
                      <Input
                        name={`riders_note_${rider.id}`}
                        placeholder="Enter Note"
                        value={rider.riders_note}
                        onChange={(e: any) => updateRider(rider.id, 'riders_note', e.target.value)}
                      />
                    </div>
                    <div className="shrink-0 mt-[25px]">
                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={addRider}
                          className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                          title="Add Rider"
                        >
                          <Plus size={18} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeRider(rider.id)}
                          className="w-[36px] h-[36px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                          title="Remove Rider"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 5 */}
              <div>
                <label className={labelClass}>Total Net Premium</label>
                <Input
                  name="total_net_premium"
                  placeholder="Total Net Premium"
                  value={formData.total_net_premium}
                  onChange={(e: any) => handleChange('total_net_premium', e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <label className={labelClass}>Total Premium</label>
                <Input
                  name="total_premium"
                  placeholder="Total Premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <label className={labelClass}>Customer Payment Mode</label>
                <Select
                  className={selectClass}
                  value={formData.customer_payment_mode}
                  onChange={(e: any) => handleChange('customer_payment_mode', e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="1">Cash / Online</option>
                  <option value="2">Cheque</option>
                  <option value="3">Net Banking</option>
                </Select>
              </div>
              <div>
                <label className={labelClass}>Premium Overdue Days</label>
                <Select
                  className={selectClass}
                  value={formData.premium_overdue_days}
                  onChange={(e: any) => handleChange('premium_overdue_days', e.target.value)}
                >
                  <option value="">Select Overdue Days</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                  <option value="45">45 Days</option>
                  <option value="60">60 Days</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span>Options</span>
              </div>
            </div>
            <Input
              as="checkbox"
              name="regenerate_installments"
              label="Mark All Installments As Paid"
              helperText="Check To Mark All Installments Up To Today's Date As Paid On Save."
              checked={formData.regenerate_installments}
              onChange={(e: any) => handleChange('regenerate_installments', e.target.checked)}
              checkboxColor="#2B4399"
            />
          </div>

          {/* Nominee Details (Exact 4 Columns Row with Square Icon Button) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Nominee Details</span>
                </div>
                <button
                  type="button"
                  onClick={addNominee}
                  className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                  title="Add Nominee"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {nominees.map((nominee, index) => (
                <div key={nominee.id} className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full sm:w-1/3">
                    <label className={labelClass}>Nominee Name <span className="text-red-500">*</span></label>
                    <Input
                      name={`nomainee_name_${nominee.id}`}
                      placeholder="Nominee Name *"
                      value={nominee.nomainee_name}
                      onChange={(e: any) => updateNominee(nominee.id, 'nomainee_name', e.target.value)}
                      error={errors.nomainee_name && !nominee.nomainee_name ? errors.nomainee_name : undefined}
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-1/3">
                    <label className={labelClass}>Relationship</label>
                    <Select
                      className={selectClass}
                      value={nominee.nomainee_relationship}
                      onChange={(e: any) => updateNominee(nominee.id, 'nomainee_relationship', e.target.value)}
                    >
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map((rel: any) => (
                        <option key={rel.id} value={rel.id}>
                          {rel.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 w-full sm:w-1/3">
                    <label className={labelClass}>Percentage (%)</label>
                    <Input
                      name={`nomainee_per_${nominee.id}`}
                      placeholder="Percentage (%)"
                      value={nominee.nomainee_per}
                      onChange={(e: any) => updateNominee(nominee.id, 'nomainee_per', e.target.value)}
                    />
                  </div>
                  {index > 0 && (
                    <div className="shrink-0 mt-[25px]">
                      <button
                        type="button"
                        onClick={() => removeNominee(nominee.id)}
                        className="w-[36px] h-[36px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Remove Nominee"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note Details */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>Note Details</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <Input
                as="textarea"
                name="note"
                placeholder="Enter Note"
                value={formData.note}
                onChange={(e: any) => handleChange('note', e.target.value)}
              />
            </div>
          </div>

          {/* Bank Details IN Policy (Exact 4 Columns Row Grid) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span>Bank Details IN Policy</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              <div>
                <label className={labelClass}>Bank Name</label>
                <Input
                  name="bank_name"
                  placeholder="Enter Bank Name"
                  value={formData.bank_name}
                  onChange={(e: any) => handleChange('bank_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Account Type</label>
                <Input
                  name="account_type"
                  placeholder="Enter Account Type"
                  value={formData.account_type}
                  onChange={(e: any) => handleChange('account_type', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <Input
                  name="account_number"
                  placeholder="Enter Account Number"
                  value={formData.account_number}
                  onChange={(e: any) => handleChange('account_number', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>IFSC CODE</label>
                <Input
                  name="ifsc_code"
                  placeholder="Enter IFSC CODE"
                  value={formData.ifsc_code}
                  onChange={(e: any) => handleChange('ifsc_code', e.target.value)}
                  onBlur={() => handleBlur('ifsc_code')}
                  error={errors.ifsc_code}
                />
              </div>
              <div>
                <label className={labelClass}>Account Holder Name</label>
                <Input
                  name="account_holder_name"
                  placeholder="Enter Account Holder Name"
                  value={formData.account_holder_name}
                  onChange={(e: any) => handleChange('account_holder_name', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Document Information (Exact 4 Columns Row with Square Icon Button) */}


          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>Additional Document Information</span>
                </div>
                <button
                  type="button"
                  onClick={addDocument}
                  className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                  title="Add Document"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {(() => {
                const selectedDocumentIds = documents.map(d => String(d.other_document_name)).filter(id => id !== '' && id !== 'undefined');

                return documents.map((doc, index) => (
                  <div key={doc.id} className="relative bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-md transition-shadow">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 rounded-xl flex items-center justify-center transition-colors z-10"
                        title="Remove Document"
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                    )}

                    <div className="flex items-start gap-3 mb-4 pr-10">
                      <div className="w-10 h-10 bg-[#EEF2FF] text-[#2B4399] rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-0.5">Document Name </h4>
                        <p className="text-[11px] text-gray-500">Select the document you want to upload</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Select
                        className={selectClass}
                        value={doc.other_document_name}
                        onChange={(e: any) => updateDocument(doc.id, 'other_document_name', e.target.value)}
                      >
                        <option value="">Select Document Name</option>
                        {documentListOptions.map((dc: any) => {
                          const dId = String(dc.id || dc.document_id);
                          const dName = dc.name || dc.document_name || `Doc #${dId}`;
                          const isSelectedByOther = selectedDocumentIds.includes(dId) && String(doc.other_document_name) !== dId;

                          return (
                            <option key={dId} value={dId} disabled={isSelectedByOther}>
                              {dName}
                            </option>
                          );
                        })}
                      </Select>

                      <div className="w-full">
                        <FileUpload
                          name={`other_document_image_${doc.id}`}
                          file={doc.other_document_image}
                          existingUrl={(doc as any).existing_image_url}
                          onChange={(file) => updateDocument(doc.id, 'other_document_image', file)}
                          placeholder="Click or drag image to upload"
                        />
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
