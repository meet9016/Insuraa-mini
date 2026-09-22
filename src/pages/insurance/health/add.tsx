import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, Users, BookOpen } from 'lucide-react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
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
    gst_amount: '',
    total_premium: '',
    note: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className={labelClass}>Customer Name <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => router.push('/customers/add')} className="text-xs text-[#2B4399] font-bold hover:underline">Add Customer</button>
                </div>
                <Select
                  className={`${selectClass} ${errors.customer_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.customer_id}
                  onChange={(e: any) => handleChange('customer_id', e.target.value)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Row 1 */}
              <div>
                <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.companies_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
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
                {errors.companies_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companies_id}</p>}
              </div>

              <div>
                <label className={labelClass}>Company Agency Code</label>
                <Input
                  name="companies_agency_code"
                  placeholder="Enter Company Agency Code"
                  value={formData.companies_agency_code}
                  onChange={(e: any) => handleChange('companies_agency_code', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.plan_name ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
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
                {errors.plan_name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.plan_name}</p>}
              </div>

              <div>
                <label className={labelClass}>Insurance Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.insurance_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
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
                {errors.insurance_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.insurance_type}</p>}
              </div>

              {/* Row 2 */}
              <div>
                <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.payment_mode ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
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
                {errors.payment_mode && <p className="text-xs text-red-500 font-semibold mt-1">{errors.payment_mode}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Number <span className="text-red-500">*</span></label>
                <Input
                  name="policy_number"
                  placeholder="Enter Policy Number"
                  value={formData.policy_number}
                  onChange={(e: any) => handleChange('policy_number', e.target.value)}
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
                />
                {errors.policy_login_date && <p className="text-xs text-red-500 font-semibold mt-1">{errors.policy_login_date}</p>}
              </div>

              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_start_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.policy_start_date}
                  onChange={(date) => handleChange('policy_start_date', date)}
                  placeholder="Select Policy Start Date"
                />
                {errors.policy_start_date && <p className="text-xs text-red-500 font-semibold mt-1">{errors.policy_start_date}</p>}
              </div>

              {/* Row 3 */}
              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className={`${selectClass} ${errors.policy_end_date ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.policy_end_date}
                  onChange={(date) => handleChange('policy_end_date', date)}
                  placeholder="Select Policy End Date"
                />
                {errors.policy_end_date && <p className="text-xs text-red-500 font-semibold mt-1">{errors.policy_end_date}</p>}
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
                />
              </div>

              <div>
                <label className={labelClass}>Deductable</label>
                <Input
                  name="deductable"
                  placeholder="Enter Deductable"
                  value={formData.deductable}
                  onChange={(e: any) => handleChange('deductable', e.target.value)}
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
                />
              </div>

              <div>
                <label className={labelClass}>Net Premium <span className="text-red-500">*</span></label>
                <Input
                  name="net_premium"
                  placeholder="Enter Net Premium"
                  value={formData.net_premium}
                  onChange={(e: any) => handleChange('net_premium', e.target.value)}
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
                />
              </div>

              <div>
                <label className={labelClass}>Total Premium <span className="text-red-500">*</span></label>
                <Input
                  name="total_premium"
                  placeholder="Enter Total Premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                  error={errors.total_premium}
                />
              </div>

            </div>
          </div>

          {/* Insured Members Information (Exact 4 Columns Row with Square Icon Button) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Insured Members</span>
              </div>
            </div>

            <div className="space-y-5">
              {members.map((member, index) => (
                <div key={member.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                  <div>
                    <label className={labelClass}>Member Name</label>
                    <Input
                      name={`member_name_${member.id}`}
                      placeholder="Enter Member Name"
                      value={member.member_name}
                      onChange={(e: any) => updateMember(member.id, 'member_name', e.target.value)}
                    />
                  </div>
                  <div>
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
                  <div>
                    <label className={labelClass}>DOB</label>
                    <DatePicker
                      className={selectClass}
                      value={member.member_dob}
                      onChange={(date) => updateMember(member.id, 'member_dob', date)}
                      placeholder="Select DOB"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <Input
                      name={`member_age_${member.id}`}
                      placeholder="Enter Age"
                      value={member.member_age}
                      onChange={(e: any) => updateMember(member.id, 'member_age', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={addMember}
                        className="w-[42px] h-[42px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Add Member"
                      >
                        <Plus size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="w-[42px] h-[42px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Remove Member"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
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

          {/* Additional Document Information (Clean Tight Flex Container) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span>Additional Document Information</span>
              </div>
            </div>

            <div className="space-y-5">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="w-full sm:w-1/3">
                    <label className={labelClass}>Document Name</label>
                    <Select
                      className={selectClass}
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
                  <div className="flex-1 w-full">
                    <FileUpload
                      label="Upload Image/Document"
                      name={`document_file_${doc.id}`}
                      file={doc.document_file}
                      existingUrl={(doc as any).existing_image_url}
                      onChange={(file) => updateDocument(doc.id, 'document_file', file)}
                      placeholder="Click or drag image to upload"
                    />
                  </div>
                  <div className="shrink-0 pb-[2px]">
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={addDocument}
                        className="w-[42px] h-[42px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Add Document"
                      >
                        <Plus size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="w-[42px] h-[42px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Remove Document"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
