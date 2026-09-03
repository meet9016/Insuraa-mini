import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { validateHealthInsurance } from '@/utils/validation';
import { useCustomerList } from '@/hooks/useCustomerApi';
import {
  useHealthInsuranceMasterData,
  useHealthInsuranceCompanyPlansAndAgency,
  useHealthInsuranceActions,
  HealthInsurancePayload
} from '@/hooks/useHealthInsuranceApi';

export default function AddHealthInsurance() {
  const router = useRouter();
  const { id } = router.query;
  const { insertHealthInsurance } = useHealthInsuranceActions();

  // Fetch API master data & dropdowns
  const { data: masterData } = useHealthInsuranceMasterData();
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });

  const customerList = customerRes?.customerList || [];
  const companyList = masterData?.companies || [];
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
    gst_amount: '0',
    total_premium: '0',
    note: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch company plans based on selected company_id
  const { data: plansRes } = useHealthInsuranceCompanyPlansAndAgency(formData.companies_id);
  const companyPlans = plansRes?.plan_list || [];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Insured Members state
  const [members, setMembers] = useState([
    { id: 1, member_name: '', member_relationship: '', member_dob: '', member_age: '' }
  ]);

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now(), member_name: '', member_relationship: '', member_dob: '', member_age: '' }
    ]);
  };

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: number, field: string, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Documents state
  const [documents, setDocuments] = useState([
    { id: 1, document_name: '', document_file: null as File | null }
  ]);

  const addDocument = () => {
    if (documents.length < maxDocumentsAllowed) {
      setDocuments([...documents, { id: Date.now(), document_name: '', document_file: null }]);
    } else {
      toast.warning(`Maximum ${maxDocumentsAllowed} documents allowed`);
    }
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const updateDocument = (id: number, field: string, value: any) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

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
            }));
          } else if (Array.isArray(item.other_document_name)) {
            parsedDocs = item.other_document_name.map((docName: string, idx: number) => ({
              id: idx + 1,
              document_name: String(docName || ''),
              document_file: null,
            }));
          } else if (item.other_document_name && typeof item.other_document_name === 'string') {
            const docNames = item.other_document_name.split(',').map((s: string) => s.trim());
            parsedDocs = docNames.map((docName: string, idx: number) => ({
              id: idx + 1,
              document_name: String(docName),
              document_file: null,
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

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex items-center gap-2 mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";
  const getSelectClass = (fieldName: string) => `${inputClass} ${errors[fieldName] ? '!border-red-500 ring-2 ring-red-500/20' : ''}`;

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-0">
      <Head>
        <title>{id ? 'Edit Health Insurance' : 'Add Health Insurance'} - Insuraa</title>
        <style>{`
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          body::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 rounded-xl shadow-sm border border-gray-100">

        {/* Page Header */}
        <div className="sticky top-0 z-40 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-8 pt-6 -mt-6 -mx-6 px-6 rounded-t-xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl">{id ? 'Edit Health Insurance' : 'Add Health Insurance'}</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Insurance'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form className="space-y-8 bg-white" onSubmit={handleSubmit}>

          {/* Customer Information */}
          <div>
            <div className={sectionHeaderClass}>
              <UserIcon /> Customer Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => router.push('/customers/add')} className="text-xs text-[#2B4399] font-bold hover:underline">Add Customer</button>
                </div>
                <Select
                  className={getSelectClass('customer_id')}
                  value={formData.customer_id}
                  onChange={(e: any) => handleChange('customer_id', e.target.value)}
                >
                  <option value="">Select Customer Name</option>
                  {customerList.map((cust: any) => {
                    const custId = cust.customer_id || cust.id;
                    let rawName = '';
                    if (cust.first_name || cust.last_name) {
                      const fn = String(cust.first_name || '').replace(/,/g, '').trim();
                      const ln = String(cust.last_name || '').replace(/,/g, '').trim();
                      rawName = `${fn} ${ln}`.trim();
                    }
                    if (!rawName) {
                      rawName = String(cust.full_name || cust.name || cust.customer_name || `Customer #${custId}`);
                    }
                    const custName = rawName.replace(/,/g, '').replace(/\s+/g, ' ').trim();
                    const cleanMobile = (cust.customer_number || cust.mobile) ? String(cust.customer_number || cust.mobile).replace(/,/g, '').trim() : '';
                    const optionLabel = cleanMobile ? `${custName} (${cleanMobile})` : custName;
                    return (
                      <option key={custId} value={String(custId)}>
                        {optionLabel}
                      </option>
                    );
                  })}
                </Select>
                {errors.customer_id && <p className="text-xs text-red-500 mt-1 font-medium">{errors.customer_id}</p>}
              </div>
            </div>
          </div>

          {/* Policy PDF Details */}
          <div>
            <div className={sectionHeaderClass}>
              <FileIcon /> Policy PDF Details
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Upload Policy</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={(e) => setPolicyPdf(e.target.files?.[0] || null)}
                    className="h-[46px] border border-gray-300 rounded-lg text-sm px-4 py-2.5 w-full max-w-md file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm"
                  />
                  <button type="button" className="h-[46px] bg-[var(--primary)] text-white px-10 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm flex items-center justify-center">AI</button>
                </div>
              </div>
              <div className="bg-red-50 text-[#cf3838] p-4 rounded-lg text-xs border border-red-100 font-semibold leading-relaxed">
                Note: After Uploading The Policy PDF And Clicking The AI Button, The Form Will Be Auto-Filled. Please Review And Verify All Details Carefully, As AI-Generated Data May Not Be Fully Accurate, Before Saving Or Submitting.
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <div className={sectionHeaderClass}>
              <ShieldIcon /> Insurance Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 items-start">

              <div>
                <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                <Select
                  className={getSelectClass('companies_id')}
                  value={formData.companies_id}
                  onChange={(e: any) => {
                    handleChange('companies_id', e.target.value);
                    handleChange('plan_name', '');
                  }}
                >
                  <option value="">Select Insurance Company Name</option>
                  {companyList.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                {errors.companies_id && <p className="text-xs text-red-500 mt-1 font-medium">{errors.companies_id}</p>}
              </div>

              <div>
                <label className={labelClass}>Company Agency Code</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Company Agency Code"
                  value={formData.companies_agency_code}
                  onChange={(e: any) => handleChange('companies_agency_code', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
                <Select
                  className={getSelectClass('plan_name')}
                  value={formData.plan_name}
                  onChange={(e: any) => handleChange('plan_name', e.target.value)}
                >
                  <option value="">Select Company Plan Name</option>
                  {companyPlans.map((p: any) => (
                    <option key={p.plan_id || p.id} value={String(p.plan_id || p.id)}>
                      {p.plan_name || p.name}
                    </option>
                  ))}
                </Select>
                {errors.plan_name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.plan_name}</p>}
              </div>

              <div>
                <label className={labelClass}>Insurance Type <span className="text-red-500">*</span></label>
                <Select
                  className={getSelectClass('insurance_type')}
                  value={formData.insurance_type}
                  onChange={(e: any) => handleChange('insurance_type', e.target.value)}
                >
                  <option value="">Select Insurance Type</option>
                  {insuranceTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.insurance_type && <p className="text-xs text-red-500 mt-1 font-medium">{errors.insurance_type}</p>}
              </div>

              <div>
                <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                <Select
                  className={getSelectClass('payment_mode')}
                  value={formData.payment_mode}
                  onChange={(e: any) => handleChange('payment_mode', e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.payment_mode && <p className="text-xs text-red-500 mt-1 font-medium">{errors.payment_mode}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getSelectClass('policy_number')}
                  placeholder="Enter Policy Number"
                  value={formData.policy_number}
                  onChange={(e: any) => handleChange('policy_number', e.target.value)}
                />
                {errors.policy_number && <p className="text-xs text-red-500 mt-1 font-medium">{errors.policy_number}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={getSelectClass('policy_login_date')}
                  value={formData.policy_login_date}
                  onChange={(date) => handleChange('policy_login_date', date)}
                  placeholder="Select Policy Login Date"
                />
                {errors.policy_login_date && <p className="text-xs text-red-500 mt-1 font-medium">{errors.policy_login_date}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={getSelectClass('policy_start_date')}
                  value={formData.policy_start_date}
                  onChange={(date) => handleChange('policy_start_date', date)}
                  placeholder="Select Policy Start Date"
                />
                {errors.policy_start_date && <p className="text-xs text-red-500 mt-1 font-medium">{errors.policy_start_date}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={getSelectClass('policy_end_date')}
                  value={formData.policy_end_date}
                  onChange={(date) => handleChange('policy_end_date', date)}
                  placeholder="Select Policy End Date"
                />
                {errors.policy_end_date && <p className="text-xs text-red-500 mt-1 font-medium">{errors.policy_end_date}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Inspection Date</label>
                <DatePicker
                  className={inputClass}
                  value={formData.policy_inspection_date}
                  onChange={(date) => handleChange('policy_inspection_date', date)}
                  placeholder="Select Policy Inspection Date"
                />
              </div>

              <div>
                <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                <Select
                  className={getSelectClass('plan_type')}
                  value={formData.plan_type}
                  onChange={(e: any) => handleChange('plan_type', e.target.value)}
                >
                  <option value="">Select Plan Type</option>
                  {planTypes.map((item: any) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.plan_type && <p className="text-xs text-red-500 mt-1 font-medium">{errors.plan_type}</p>}
              </div>

              <div>
                <label className={labelClass}>Sum Assured <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getSelectClass('sum_assured')}
                  placeholder="Enter Sum Assured"
                  value={formData.sum_assured}
                  onChange={(e: any) => handleChange('sum_assured', e.target.value)}
                />
                {errors.sum_assured && <p className="text-xs text-red-500 mt-1 font-medium">{errors.sum_assured}</p>}
              </div>

              <div>
                <label className={labelClass}>Bonus</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Bonus"
                  value={formData.bonus}
                  onChange={(e: any) => handleChange('bonus', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Health Check Up</label>
                <Select
                  className={inputClass}
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
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Health Check Up Amount"
                  value={formData.health_check_up_amount}
                  onChange={(e: any) => handleChange('health_check_up_amount', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Deductable</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Deductable"
                  value={formData.deductable}
                  onChange={(e: any) => handleChange('deductable', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Claim</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Claim"
                  value={formData.claim}
                  onChange={(e: any) => handleChange('claim', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Net Premium <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getSelectClass('net_premium')}
                  placeholder="Enter Net Premium"
                  value={formData.net_premium}
                  onChange={(e: any) => handleChange('net_premium', e.target.value)}
                />
                {errors.net_premium && <p className="text-xs text-red-500 mt-1 font-medium">{errors.net_premium}</p>}
              </div>

              <div>
                <label className={labelClass}>GST Amount</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter GST Amount"
                  value={formData.gst_amount}
                  onChange={(e: any) => handleChange('gst_amount', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Total Premium <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getSelectClass('total_premium')}
                  placeholder="Enter Total Premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                />
                {errors.total_premium && <p className="text-xs text-red-500 mt-1 font-medium">{errors.total_premium}</p>}
              </div>

            </div>
          </div>

          {/* Insured Members Information */}
          <div>
            <div className="flex items-center justify-between bg-[#EEF1FA] text-[#2B4399] px-5 py-3 rounded-lg mb-5">
              <div className="flex items-center gap-2 text-[15px] font-bold">
                <UsersIcon /> Insured Members
              </div>
              <button type="button" onClick={addMember} className="bg-[#2B4399] text-white p-1.5 rounded-md hover:bg-[#203378] transition-colors shadow-sm">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={member.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start bg-gray-50/50 p-4 rounded-xl border border-gray-200/80 relative">
                  <div>
                    <label className={labelClass}>Member Name</label>
                    <input
                      type="text"
                      placeholder="Enter Member Name"
                      value={member.member_name}
                      onChange={(e: any) => updateMember(member.id, 'member_name', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <Select
                      className={inputClass}
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
                  <div>
                    <label className={labelClass}>DOB</label>
                    <DatePicker
                      className={inputClass}
                      value={member.member_dob}
                      onChange={(date) => updateMember(member.id, 'member_dob', date)}
                      placeholder="Select DOB"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div>
                        <label className={labelClass}>Age</label>
                        <input
                          type="text"
                          placeholder="Enter Age"
                          value={member.member_age}
                          onChange={(e: any) => updateMember(member.id, 'member_age', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm mt-7"
                        title="Remove Member"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Details */}
          <div>
            <div className={sectionHeaderClass}>
              <NoteIcon /> Note Details
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <textarea
                rows={4}
                placeholder="Sample note for health policy"
                value={formData.note}
                onChange={(e: any) => handleChange('note', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Additional Document Information */}
          <div>
            <div className="flex items-center justify-between bg-[#EEF1FA] text-[#2B4399] px-5 py-3 rounded-lg mb-5">
              <div className="flex items-center gap-2 text-[15px] font-bold">
                <FileIcon /> Additional Document Information
              </div>
              <button type="button" onClick={addDocument} className="bg-[#2B4399] text-white p-1.5 rounded-md hover:bg-[#203378] transition-colors shadow-sm">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex items-start gap-4">
                  <div className="flex-[2]">
                    <label className={labelClass}>Document Name</label>
                    <Select
                      className={inputClass}
                      value={doc.document_name}
                      onChange={(e: any) => updateDocument(doc.id, 'document_name', e.target.value)}
                    >
                      <option value="">Select Other Document Name</option>
                      {documentNameOptions.map((d: any) => (
                        <option key={d.id} value={String(d.id)}>
                          {d.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Upload File</label>
                    <input
                      type="file"
                      onChange={(e) => updateDocument(doc.id, 'document_file', e.target.files?.[0] || null)}
                      className="border border-gray-300 rounded-lg text-sm px-4 py-2 w-full file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white"
                    />
                  </div>
                  {documents.length > 1 && (
                    <button type="button" onClick={() => removeDocument(doc.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm mt-7">
                      <Minus size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// Icons matching theme
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}
function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
