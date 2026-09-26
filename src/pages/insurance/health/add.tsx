import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, Users, BookOpen, Search, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { validateHealthInsurance } from '@/utils/validation';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { useCompanyActions } from '@/hooks/useCompanyApi';
import {
  useHealthInsuranceMasterData,
  useHealthInsuranceCompanyPlansAndAgency,
  useHealthInsuranceActions,
  HealthInsurancePayload
} from '@/hooks/useHealthInsuranceApi';

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

  const { insertCompany } = useCompanyActions();

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
      const success = await insertCompany(newName);
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
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
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

  const { insertCompanyPlan } = useCompanyActions();

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
      const success = await insertCompanyPlan(String(companyId), newName);
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

export default function AddHealthInsurance() {
  const router = useRouter();
  const { id } = router.query;
  const { insertHealthInsurance } = useHealthInsuranceActions();

  // Fetch API master data & dropdowns
  const { data: masterData } = useHealthInsuranceMasterData();
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });

  const queryClient = useQueryClient();
  const customerList = customerRes?.customerList || [];

  const [customCompanies, setCustomCompanies] = useState<Array<{ id: string | number; name: string }>>([]);
  const companyList = React.useMemo(() => {
    const base = masterData?.companies || [];
    const baseNames = new Set(base.map((c: any) => (c.name || '').toLowerCase().trim()));
    const uniqueCustomCompanies = customCompanies.filter((c: any) => !baseNames.has((c.name || '').toLowerCase().trim()));
    return [...base, ...uniqueCustomCompanies];
  }, [masterData?.companies, customCompanies]);

  const handleAddCustomCompany = (newComp: { id: string | number; name: string }) => {
    setCustomCompanies(prev => [...prev, newComp]);
    queryClient.invalidateQueries({ queryKey: ["healthInsuranceMasterData"] });
    queryClient.invalidateQueries({ queryKey: ["companyList"] });
  };
  const paymentModes = masterData?.payment_mode || [];
  const insuranceTypes = masterData?.insurance_type || [];
  const documentNameOptions = masterData?.document_name || [];
  const relationshipOptions = masterData?.relationship || [];
  const planTypes = masterData?.plan_type || [];
  const healthCheckUpOptions = masterData?.health_check_up || [];
  const maxDocumentsAllowed = masterData?.max_documents_allowed || 5;

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    companies_id: '',
    companies_agency_code: '',
    plan_name: '',
    insurance_type: '',
    payment_mode: '',
    policy_number: '',
    policy_login_date: '',
    policy_start_date: '',
    policy_end_date: '',
    policy_inspection_date: '',
    plan_type: '',
    sum_assured: '',
    bonus: '',
    health_check_up: '',
    health_check_up_amount: '',
    deductable: '',
    claim: '',
    net_premium: '',
    gst_amount: '',
    total_premium: '',
    note: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch company plans and agency code based on selected company_id
  const { data: plansRes } = useHealthInsuranceCompanyPlansAndAgency(formData.companies_id);
  const companyPlans = plansRes?.plan_list || [];
  const agencyCodeList = plansRes?.agency_code || [];

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
    queryClient.invalidateQueries({ queryKey: ["healthInsuranceCompanyPlansAndAgency"] });
  };

  const handleChange = (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);
    if (errors[field]) {
      const { errors: newErrors } = validateHealthInsurance(updatedForm);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const handleBlur = (field: string) => {
    if (errors[field] || formData[field as keyof typeof formData]) {
      const { errors: newErrors } = validateHealthInsurance(formData);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  // Insured Members state
  const [members, setMembers] = useState([
    { id: 1, member_name: '', member_relationship: '', member_dob: '', member_age: '' }
  ]);

  const addMember = () => {
    setMembers(prev => [
      ...prev,
      { id: Date.now(), member_name: '', member_relationship: '', member_dob: '', member_age: '' }
    ]);
  };

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: number, field: string, value: any) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Documents state
  const [documents, setDocuments] = useState([
    { id: 1, document_name: '', document_file: null as File | null, existing_image_url: null as string | null }
  ]);

  const addDocument = () => {
    if (documents.length < maxDocumentsAllowed) {
      setDocuments(prev => [...prev, { id: Date.now(), document_name: '', document_file: null, existing_image_url: null }]);
    } else {
      toast.warning(`Maximum ${maxDocumentsAllowed} documents allowed`);
    }
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDocument = (id: number, field: string, value: any) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Auto-calculate Policy End Date for Yearly Payment Mode
  useEffect(() => {
    if (formData.policy_start_date && formData.payment_mode) {
      const selectedMode = paymentModes.find((m: any) => String(m.id) === formData.payment_mode);
      if (selectedMode && (selectedMode.name?.toLowerCase().includes('year') || selectedMode.name?.toLowerCase().includes('annu'))) {
        const startDate = new Date(formData.policy_start_date);
        if (!isNaN(startDate.getTime())) {
          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);
          endDate.setDate(endDate.getDate() - 1);

          const yyyy = endDate.getFullYear();
          const mm = String(endDate.getMonth() + 1).padStart(2, '0');
          const dd = String(endDate.getDate()).padStart(2, '0');
          const formattedEndDate = `${yyyy}-${mm}-${dd}`;

          setFormData(prev => ({ ...prev, policy_end_date: formattedEndDate }));
        }
      }
    }
  }, [formData.policy_start_date, formData.payment_mode, paymentModes]);

  // Auto-calculate Total Premium
  useEffect(() => {
    const net = parseFloat(formData.net_premium);
    const gst = parseFloat(formData.gst_amount);

    // Only calculate if at least one is a valid number, to avoid overwriting empty fields with NaN
    if (!isNaN(net) || !isNaN(gst)) {
      const total = (isNaN(net) ? 0 : net) + (isNaN(gst) ? 0 : gst);
      setFormData(prev => ({ ...prev, total_premium: String(total) }));
      setErrors(prev => ({ ...prev, total_premium: '' }));
    } else if (formData.net_premium === '' && formData.gst_amount === '') {
      setFormData(prev => ({ ...prev, total_premium: '' }));
    }
  }, [formData.net_premium, formData.gst_amount]);

  // Prefill edit data if editing existing health insurance policy
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const queryId = String(id);
        let item: any = null;

        // 1. Try view_health_insurance API endpoint first
        try {
          const viewFd = new FormData();
          viewFd.append('health_insurance_id', queryId);
          viewFd.append('id', queryId);
          const viewRes = await api.post('view_health_insurance', viewFd);
          const vData = viewRes?.data;
          item = vData?.data?.health_insurance_details || vData?.data?.details || vData?.data || vData?.health_insurance || null;
        } catch (e) {
          // Ignore error and fall back to list endpoint
        }

        // 2. Fallback to health_insurance_list API
        if (!item) {
          const listFd = new FormData();
          listFd.append('health_insurance_id', queryId);
          listFd.append('id', queryId);
          listFd.append('search', queryId);
          listFd.append('limit', '100');
          listFd.append('page', '1');

          const response = await api.post(endPointApi.HEALTH_INSURANCE.HEALTH_INSURANCE_LIST, listFd);
          const resData = response?.data;
          const list = resData?.data?.health_insurance_list || resData?.data?.list || resData?.data || [];
          item = Array.isArray(list)
            ? list.find((c: any) => String(c.id || c.health_insurance_id) === queryId) || list[0]
            : (resData?.data?.health_insurance_details || resData?.data || null);
        }

        if (item) {
          setFormData(prev => ({
            ...prev,
            customer_id: String(item.customer_id || '').trim(),
            companies_id: String(item.companies_id || item.company_id || '').trim(),
            companies_agency_code: String(item.companies_agency_code || item.agency_code || '').trim(),
            plan_name: String(item.plan_name || item.plan_id || '').trim(),
            insurance_type: String(item.insurance_type || '').trim(),
            payment_mode: String(item.payment_mode || '').trim(),
            policy_number: String(item.policy_number || '').trim(),
            policy_login_date: String(item.policy_login_date || item.login_date || '').trim(),
            policy_start_date: String(item.policy_start_date || item.start_date || '').trim(),
            policy_end_date: String(item.policy_end_date || item.end_date || '').trim(),
            policy_inspection_date: String(item.policy_inspection_date || item.inspection_date || '').trim(),
            plan_type: String(item.plan_type || '').trim(),
            sum_assured: String(item.sum_assured ?? '').trim(),
            bonus: String(item.bonus ?? '').trim(),
            health_check_up: String(item.health_check_up || '').trim(),
            health_check_up_amount: String(item.health_check_up_amount ?? '').trim(),
            deductable: String(item.deductable ?? '').trim(),
            claim: String(item.claim ?? '').trim(),
            net_premium: String(item.net_premium ?? '').trim(),
            gst_amount: String(item.gst_amount ?? '0').trim(),
            total_premium: String(item.total_premium ?? '0').trim(),
            note: String(item.note || item.remarks || '').trim(),
          }));

          const pdfFile = item.policy_pdf || item.policy_pdf_path || item.policy_file || item.policy_doc || item.policy_pdf_url;
          if (pdfFile) {
            setExistingPolicyPdfUrl(String(pdfFile));
          }

          // Parse Insured Members
          let rawMembers: any = item.members || item.member_list || item.insured_members || item.member || item.members_list || item.health_insurance_members || item.insured_member || item.member_details || item.insured_member_list;

          if (typeof rawMembers === 'string') {
            try { rawMembers = JSON.parse(rawMembers); } catch (e) { rawMembers = []; }
          }

          let parsedMembers: any[] = [];
          if (Array.isArray(rawMembers) && rawMembers.length > 0) {
            parsedMembers = rawMembers.map((m: any, idx: number) => {
              const dobVal = m.member_dob || m.dob || m.date_of_birth || m.member_date_of_birth || m.birth_date || m.b_date || m.date_birth || m.dob_text || m.member_dob_text || m.bdate || m.member_bdate || '';
              return {
                id: idx + 1,
                member_name: m.member_name || m.name || m.full_name || '',
                member_relationship: String(m.member_relationship || m.relationship || m.relationship_id || ''),
                member_dob: (dobVal && dobVal !== '0000-00-00' && dobVal !== '00-00-0000') ? String(dobVal) : '',
                member_age: String(m.member_age || m.age || ''),
              };
            });
          } else if (Array.isArray(item.member_name)) {
            parsedMembers = item.member_name.map((name: string, idx: number) => {
              const dobVal = item.member_dob?.[idx] || item.dob?.[idx] || item.date_of_birth?.[idx] || item.member_date_of_birth?.[idx] || item.birth_date?.[idx] || '';
              return {
                id: idx + 1,
                member_name: name || '',
                member_relationship: String(item.member_relationship?.[idx] || item.relationship?.[idx] || ''),
                member_dob: (dobVal && dobVal !== '0000-00-00' && dobVal !== '00-00-0000') ? String(dobVal) : '',
                member_age: String(item.member_age?.[idx] || item.age?.[idx] || ''),
              };
            });
          } else if (item.member_name && typeof item.member_name === 'string') {
            const names = item.member_name.split(',').map((s: string) => s.trim());
            const rels = (typeof item.member_relationship === 'string' ? item.member_relationship.split(',') : []).map((s: string) => s.trim());
            const rawDob = item.member_dob || item.dob || item.date_of_birth || item.member_date_of_birth || item.birth_date;
            const dobs = (typeof rawDob === 'string' ? rawDob.split(',') : []).map((s: string) => s.trim());
            const rawAge = item.member_age || item.age;
            const ages = (typeof rawAge === 'string' ? rawAge.split(',') : []).map((s: string) => s.trim());

            parsedMembers = names.map((name: string, idx: number) => {
              const dobVal = dobs[idx] || (typeof rawDob === 'string' ? rawDob : '');
              return {
                id: idx + 1,
                member_name: name,
                member_relationship: String(rels[idx] || item.member_relationship || ''),
                member_dob: (dobVal && dobVal !== '0000-00-00' && dobVal !== '00-00-0000') ? String(dobVal) : '',
                member_age: String(ages[idx] || (typeof rawAge === 'string' ? rawAge : '')),
              };
            });
          }

          if (parsedMembers.length > 0) {
            setMembers(parsedMembers);
          }

          // Parse Other Documents
          let rawDocs: any = item.other_documents || item.documents || item.document_list || item.other_document || item.other_documents_list || item.health_documents || item.document_details;

          if (typeof rawDocs === 'string') {
            try { rawDocs = JSON.parse(rawDocs); } catch (e) { rawDocs = []; }
          }

          let parsedDocs: any[] = [];
          if (Array.isArray(rawDocs) && rawDocs.length > 0) {
            parsedDocs = rawDocs.map((d: any, idx: number) => ({
              id: idx + 1,
              document_name: String(d.other_document_name || d.document_name || d.name || d.document_id || d.id || ''),
              document_file: null,
              existing_image_url: d.other_document_image || d.document_image || d.image || d.file || d.path || d.image_url || d.url || null
            }));
          } else if (Array.isArray(item.other_document_name)) {
            parsedDocs = item.other_document_name.map((docName: string, idx: number) => ({
              id: idx + 1,
              document_name: String(docName || ''),
              document_file: null,
              existing_image_url: item.other_document_image?.[idx] || null
            }));
          } else if (item.other_document_name && typeof item.other_document_name === 'string') {
            const docNames = item.other_document_name.split(',').map((s: string) => s.trim());
            parsedDocs = docNames.map((docName: string, idx: number) => ({
              id: idx + 1,
              document_name: String(docName),
              document_file: null,
              existing_image_url: null
            }));
          }

          if (parsedDocs.length > 0) {
            setDocuments(parsedDocs);
          }
        }
      } catch (err) {
        console.error('Error fetching health insurance details for edit:', err);
      }
    };

    fetchDetail();
  }, [id]);

  const validateForm = () => {
    const { isValid, errors: newErrors } = validateHealthInsurance(formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: HealthInsurancePayload = {
        health_insurance_id: id ? String(id) : null,
        customer_id: formData.customer_id,
        companies_id: formData.companies_id,
        companies_agency_code: formData.companies_agency_code,
        plan_name: formData.plan_name,
        insurance_type: formData.insurance_type,
        payment_mode: formData.payment_mode,
        policy_number: formData.policy_number,
        policy_login_date: formData.policy_login_date,
        policy_start_date: formData.policy_start_date,
        policy_end_date: formData.policy_end_date,
        policy_inspection_date: formData.policy_inspection_date,
        plan_type: formData.plan_type,
        sum_assured: formData.sum_assured,
        bonus: formData.bonus,
        health_check_up: formData.health_check_up,
        health_check_up_amount: formData.health_check_up_amount,
        deductable: formData.deductable,
        claim: formData.claim,
        net_premium: formData.net_premium,
        gst_amount: formData.gst_amount,
        total_premium: formData.total_premium,
        note: formData.note,
        policy_pdf: policyPdf,
        members: members.map(m => ({
          member_name: m.member_name,
          member_relationship: m.member_relationship,
          member_dob: m.member_dob,
          member_age: m.member_age,
        })),
        other_documents: documents.map(d => ({
          other_document_name: d.document_name,
          other_document_image: d.document_file,
        })),
      };

      const success = await insertHealthInsurance(payload);
      if (success) {
        router.back();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error saving health insurance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-xl flex items-center justify-between gap-2 mb-6 border-l-4 border-[#2B4399]";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const selectClass = "w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs";

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-0">
      <Head>
        <title>{id ? 'Edit Health Insurance' : 'Add Health Insurance'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">

        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{id ? 'Edit Health Insurance' : 'Add Health Insurance'}</h1>
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
                    const custId = cust.customer_id || cust.id;
                    const custName = cust.full_name || `Customer #${custId}`;
                    const phone = cust.number || '';
                    const optionLabel = phone ? `${custName} (${phone})` : custName;
                    return (
                      <option key={custId} value={String(custId)}>
                        {optionLabel}
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
                  onChange={(val: string) => {
                    setFormData(prev => ({
                      ...prev,
                      companies_id: val,
                      plan_name: '',
                      companies_agency_code: '',
                    }));
                    if (errors.companies_id) {
                      const { errors: newErrors } = validateHealthInsurance({ ...formData, companies_id: val });
                      setErrors(prev => ({ ...prev, companies_id: newErrors.companies_id || '' }));
                    }
                  }}
                  onAddCompany={handleAddCustomCompany}
                  error={errors.companies_id}
                />
                {errors.companies_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companies_id}</p>}
              </div>

              <div>
                <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
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
                <label className={labelClass}>Company Agency Code</label>
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
                <label className={labelClass}>Insurance Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.insurance_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.insurance_type}
                  onChange={(e: any) => handleChange('insurance_type', e.target.value)}
                  error={errors.insurance_type}
                >
                  <option value="">Select Insurance Type</option>
                  {insuranceTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.insurance_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.insurance_type}</p>}
              </div>

              {/* Row 2 */}
              <div>
                <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.payment_mode ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.payment_mode}
                  onChange={(e: any) => handleChange('payment_mode', e.target.value)}
                  error={errors.payment_mode}
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.payment_mode && <p className="text-xs text-red-500 font-semibold mt-1">{errors.payment_mode}</p>}
              </div>

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
                <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_login_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.policy_login_date}
                  onChange={(date) => handleChange('policy_login_date', date)}
                  placeholder="Select Policy Login Date"
                  error={errors.policy_login_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_start_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.policy_start_date}
                  onChange={(date) => handleChange('policy_start_date', date)}
                  placeholder="Select Policy Start Date"
                  error={errors.policy_start_date}
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_end_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.policy_end_date}
                  onChange={(date) => handleChange('policy_end_date', date)}
                  placeholder="Select Policy End Date"
                  error={errors.policy_end_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy Inspection Date</label>
                <DatePicker
                  className={selectClass}
                  value={formData.policy_inspection_date}
                  onChange={(date) => handleChange('policy_inspection_date', date)}
                  placeholder="Select Policy Inspection Date"
                />
              </div>

              <div>
                <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.plan_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.plan_type}
                  onChange={(e: any) => handleChange('plan_type', e.target.value)}
                  error={errors.plan_type}
                >
                  <option value="">Select Plan Type</option>
                  {planTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
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

              {/* Row 4 */}
              <div>
                <label className={labelClass}>Bonus</label>
                <Input
                  name="bonus"
                  placeholder="Enter Bonus"
                  value={formData.bonus}
                  onChange={(e: any) => handleChange('bonus', e.target.value)}
                  onBlur={() => handleBlur('bonus')}
                  error={errors.bonus}
                />
              </div>

              <div>
                <label className={labelClass}>Health Check Up</label>
                <Select
                  className={selectClass}
                  value={formData.health_check_up}
                  onChange={(e: any) => handleChange('health_check_up', e.target.value)}
                >
                  <option value="">Select Health Check Up</option>
                  {healthCheckUpOptions.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={labelClass}>Health Check Up Amount</label>
                <Input
                  name="health_check_up_amount"
                  placeholder="Enter Health Check Up Amount"
                  value={formData.health_check_up_amount}
                  onChange={(e: any) => handleChange('health_check_up_amount', e.target.value)}
                  onBlur={() => handleBlur('health_check_up_amount')}
                  error={errors.health_check_up_amount}
                />
              </div>

              <div>
                <label className={labelClass}>Deductable</label>
                <Input
                  name="deductable"
                  placeholder="Enter Deductable"
                  value={formData.deductable}
                  onChange={(e: any) => handleChange('deductable', e.target.value)}
                  onBlur={() => handleBlur('deductable')}
                  error={errors.deductable}
                />
              </div>

              {/* Row 5 */}
              <div>
                <label className={labelClass}>Claim</label>
                <Input
                  name="claim"
                  placeholder="Enter Claim"
                  value={formData.claim}
                  onChange={(e: any) => handleChange('claim', e.target.value)}
                  onBlur={() => handleBlur('claim')}
                  error={errors.claim}
                />
              </div>

              <div>
                <label className={labelClass}>Net Premium <span className="text-red-500">*</span></label>
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

              <div>
                <label className={labelClass}>Total Premium <span className="text-red-500">*</span></label>
                <Input
                  name="total_premium"
                  placeholder="Enter Total Premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                  onBlur={() => handleBlur('total_premium')}
                  error={errors.total_premium}
                />
              </div>

            </div>
          </div>

          {/* Insured Members Information (Exact 4 Columns Row with Square Icon Button) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Insured Members</span>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                  title="Add Member"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {members.map((member, index) => (
                <div key={member.id} className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full sm:w-1/4">
                    <label className={labelClass}>Member Name</label>
                    <Input
                      name={`member_name_${member.id}`}
                      placeholder="Enter Member Name"
                      value={member.member_name}
                      onChange={(e: any) => updateMember(member.id, 'member_name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-1/4">
                    <label className={labelClass}>Relationship</label>
                    <Select
                      className={selectClass}
                      value={member.member_relationship}
                      onChange={(e: any) => updateMember(member.id, 'member_relationship', e.target.value)}
                    >
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map((rel: any) => (
                        <option key={rel.id} value={String(rel.id)}>
                          {rel.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 w-full sm:w-1/4">
                    <label className={labelClass}>DOB</label>
                    <DatePicker
                      className={selectClass}
                      value={member.member_dob}
                      onChange={(date) => updateMember(member.id, 'member_dob', date)}
                      placeholder="Select DOB"
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-1/4">
                    <label className={labelClass}>Age</label>
                    <Input
                      name={`member_age_${member.id}`}
                      placeholder="Enter Age"
                      value={member.member_age}
                      onChange={(e: any) => updateMember(member.id, 'member_age', e.target.value)}
                    />
                  </div>
                  {index > 0 ? (
                    <div className="shrink-0 mt-[25px]">
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="w-[36px] h-[36px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Remove Member"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  ) : (
                    members.length > 1 && <div className="w-[36px] shrink-0 hidden sm:block" />
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
                placeholder="Sample note for health policy"
                value={formData.note}
                onChange={(e: any) => handleChange('note', e.target.value)}
              />
            </div>
          </div>

          {/* Additional Document Information (2-Column Grid Layout matching Life Insurance) */}
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
                const selectedDocumentIds = documents.map(d => String(d.document_name)).filter(id => id !== '' && id !== 'undefined');

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
                        value={doc.document_name}
                        onChange={(e: any) => updateDocument(doc.id, 'document_name', e.target.value)}
                      >
                        <option value="">Select Document Name</option>
                        {documentNameOptions.map((dc: any) => {
                          const dId = String(dc.id || dc.document_id);
                          const dName = dc.name || dc.document_name || `Doc #${dId}`;
                          const isSelectedByOther = selectedDocumentIds.includes(dId) && String(doc.document_name) !== dId;

                          return (
                            <option key={dId} value={dId} disabled={isSelectedByOther}>
                              {dName}
                            </option>
                          );
                        })}
                      </Select>

                      <div className="w-full">
                        <FileUpload
                          name={`document_file_${doc.id}`}
                          file={doc.document_file}
                          existingUrl={(doc as any).existing_image_url}
                          onChange={(file) => updateDocument(doc.id, 'document_file', file)}
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
