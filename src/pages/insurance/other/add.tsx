import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, MapPin, Search, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'react-toastify';
import { useOtherInsuranceMasterData, useOtherInsuranceCompanyPlansAndAgency, useOtherInsuranceActions, useOtherInsuranceView } from '@/hooks/useOtherInsuranceApi';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { useCompanyActions } from '@/hooks/useCompanyApi';
import { validateOtherInsurance, otherInsuranceSchema } from '@/utils/validation';

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

export default function AddOtherInsurance() {
  const router = useRouter();
  const { id } = router.query;
  const { insertOtherInsurance } = useOtherInsuranceActions();

  // Form state based on requested fields
  const [formData, setFormData] = useState({
    customer_id: '',
    other_insurance_type: '',
    companies_id: '',
    plan_name: '',
    companies_agencycode: '',
    plan_type: '',
    policy_number: '',
    policy_login_date: '',
    policy_start_date: '',
    policy_end_date: '',
    sum_assured: '',
    net_premium: '',
    gst_amount: '',
    total_premium: '',
    note: '',
    shop_address: '',
  });

  // Fetch API master data & dropdowns
  const { data: masterData } = useOtherInsuranceMasterData();
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });
  const { data: plansRes } = useOtherInsuranceCompanyPlansAndAgency(formData.companies_id);

  // Dropdown options
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
    queryClient.invalidateQueries({ queryKey: ["otherInsuranceMasterData"] });
    queryClient.invalidateQueries({ queryKey: ["companyList"] });
  };

  const insuranceTypes = masterData?.insurance_type || [];
  const planTypes = masterData?.plan_type || [];
  const companyPlans = plansRes?.plan_list || [];

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
    queryClient.invalidateQueries({ queryKey: ["otherInsuranceCompanyPlansAndAgency"] });
  };

  const agencyCodes = plansRes?.agency_code || [];
  const documentNameOptions = masterData?.document_name || [];
  const maxDocumentsAllowed = masterData?.max_documents_allowed || 5;

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState<any[]>([{ id: 1, document_name: '', document_file: null, existing_image_url: '' }]);

  // Fetch Edit Data if ID is present
  const { data: editData } = useOtherInsuranceView(typeof id === 'string' ? id : null);

  useEffect(() => {
    if (editData) {
      // Find shop_address from extra_fields
      const shopAddressField = editData.extra_fields?.find((f: any) => f.name === 'shop_address');

      setFormData({
        customer_id: String(editData.customer_id || ''),
        other_insurance_type: String(editData.other_insurance_type || ''),
        companies_id: String(editData.companies_id || ''),
        plan_name: editData.plan_name || editData.plan_name_text || '',
        companies_agencycode: String(editData.companies_agency_code || editData.companies_agencycode || ''),
        plan_type: String(editData.plan_type || '').trim(),
        policy_number: String(editData.policy_number || '').trim(),
        policy_login_date: editData.policy_login_date || '',
        policy_start_date: editData.policy_start_date || '',
        policy_end_date: editData.policy_end_date || '',
        sum_assured: String(editData.sum_assured || '').trim(),
        net_premium: String(editData.net_premium || '').trim(),
        gst_amount: String(editData.gst_amount || '').trim(),
        total_premium: String(editData.total_premium || '').trim(),
        note: editData.note?.trim() || '',
        shop_address: shopAddressField?.value || editData.shop_address || '',
      });

      if (editData.policy_pdf) {
        setExistingPolicyPdfUrl(editData.policy_pdf);
      }

      if (editData.documents && editData.documents.length > 0) {
        setDocuments(editData.documents.map((d: any, index: number) => ({
          id: index + 1,
          document_name: String(d.document_id || d.other_document_id || ''),
          document_file: null,
          existing_image_url: d.document_image || d.other_document_image || ''
        })));
      }
    }
  }, [editData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (errors[field]) {
        try {
          const fieldSchema = otherInsuranceSchema.extract(field);
          if (fieldSchema) {
            const { error } = fieldSchema.validate(value);
            setErrors(prevErr => ({
              ...prevErr,
              [field]: error ? error.details[0].message : '',
            }));
          }
        } catch (e) {
          // ignore
        }
      }
      return updated;
    });
  };

  const handleBlur = (field: string) => {
    try {
      const fieldSchema = otherInsuranceSchema.extract(field);
      if (fieldSchema) {
        const val = formData[field as keyof typeof formData];
        const { error } = fieldSchema.validate(val);
        setErrors(prev => ({
          ...prev,
          [field]: error ? error.details[0].message : '',
        }));
      }
    } catch (e) {
      // ignore
    }
  };

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

  // Auto-calculate Total Premium
  useEffect(() => {
    const net = parseFloat(formData.net_premium);
    const gst = parseFloat(formData.gst_amount);

    if (!isNaN(net) || !isNaN(gst)) {
      const total = (isNaN(net) ? 0 : net) + (isNaN(gst) ? 0 : gst);
      setFormData(prev => ({ ...prev, total_premium: String(total) }));
      setErrors(prev => ({ ...prev, total_premium: '' }));
    } else if (formData.net_premium === '' && formData.gst_amount === '') {
      setFormData(prev => ({ ...prev, total_premium: '' }));
    }
  }, [formData.net_premium, formData.gst_amount]);

  const validateForm = () => {
    const { isValid, errors: validationErrors } = validateOtherInsurance(formData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        other_insurance_id: id ? String(id) : null,
        ...formData,
        companies_agency_code: formData.companies_agencycode, // mapped for API
        policy_pdf: policyPdf,
        other_documents: documents.map(d => ({
          other_document_name: d.document_name,
          other_document_image: d.document_file,
        })),
      };

      // Remove the old key so it doesn't get appended
      delete (payload as any).companies_agencycode;

      console.log('Submitting Data:', payload);
      const success = await insertOtherInsurance(payload);
      if (success) {
        toast.success('Other Insurance saved successfully!');
        router.back();
      }
    } catch (err: any) {
      toast.error('Error saving other insurance');
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
        <title>{id ? 'Edit Other Insurance' : 'Add Other Insurance'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">

        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{id ? 'Edit Other Insurance' : 'Add Other Insurance'}</h1>
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
                  onBlur={() => handleBlur('customer_id')}
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
            </div>
          </div>

          {/* Insurance Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>Insurance Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">

              <div>
                <label className={labelClass}>Other Insurance Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.other_insurance_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.other_insurance_type}
                  onChange={(e: any) => handleChange('other_insurance_type', e.target.value)}
                  onBlur={() => handleBlur('other_insurance_type')}
                >
                  <option value="">Select Type</option>
                  {insuranceTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                  ))}
                </Select>
                {errors.other_insurance_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.other_insurance_type}</p>}
              </div>

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
                      companies_agencycode: '',
                    }));
                    if (errors.companies_id) {
                      const { errors: newErrors } = validateOtherInsurance({ ...formData, companies_id: val });
                      setErrors(prev => ({ ...prev, companies_id: newErrors.companies_id || '' }));
                    }
                  }}
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
                />
              </div>

              <div>
                <label className={labelClass}>Company Agency Code</label>
                <Select
                  className={selectClass}
                  value={formData.companies_agencycode}
                  onChange={(e: any) => handleChange('companies_agencycode', e.target.value)}
                >
                  <option value="">Select Agency Code</option>
                  {agencyCodes.map((a: any) => (
                    <option key={a.agency_code_id} value={String(a.agency_code_id)}>{a.name} - {a.code}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={labelClass}>Plan Type</label>
                <Select
                  className={selectClass}
                  value={formData.plan_type}
                  onChange={(e: any) => handleChange('plan_type', e.target.value)}
                >
                  <option value="">Select Plan Type</option>
                  {planTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                  ))}
                </Select>
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
                  className={selectClass}
                  value={formData.policy_login_date}
                  onChange={(date) => handleChange('policy_login_date', date)}
                  placeholder="Select Date"
                  error={errors.policy_login_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={selectClass}
                  value={formData.policy_start_date}
                  onChange={(date) => handleChange('policy_start_date', date)}
                  placeholder="Select Date"
                  error={errors.policy_start_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={selectClass}
                  value={formData.policy_end_date}
                  onChange={(date) => handleChange('policy_end_date', date)}
                  placeholder="Select Date"
                  error={errors.policy_end_date}
                />
              </div>

              <div>
                <label className={labelClass}>Sum Assured</label>
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
                  placeholder="Total Premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                  readOnly
                  className="bg-gray-50"
                  error={errors.total_premium}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Note</label>
                <Input
                  name="note"
                  placeholder="Enter Note"
                  value={formData.note}
                  onChange={(e: any) => handleChange('note', e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* Shop Address / Location Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Location Details</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-2">
                <label className={labelClass}>Shop Address</label>
                <Input
                  name="shop_address"
                  placeholder="Enter Shop Address"
                  value={formData.shop_address}
                  onChange={(e: any) => handleChange('shop_address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Document Information Section (2-Column Grid Layout matching Life Insurance) */}
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
                  disabled={documents.length >= maxDocumentsAllowed}
                  className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
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
                        {documentNameOptions.map((docOpt: any) => {
                          const dId = String(docOpt.id || docOpt.document_id);
                          const dName = docOpt.name || docOpt.document_name || `Doc #${dId}`;
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
                          accept="image/*,.pdf,.doc,.docx"
                          file={doc.document_file}
                          existingUrl={doc.existing_image_url || ''}
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

