import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

import { useCustomerList } from '@/hooks/useCustomerApi';
import {
  useLifeInsuranceActions,
  useLifeInsuranceMasterData,
  useLifeInsuranceCompanyPlansAndAgency,
  LifeInsurancePayload
} from '@/hooks/useLifeInsuranceApi';

export default function AddLifeInsurance() {
  const router = useRouter();
  const { insertLifeInsurance } = useLifeInsuranceActions();
  const { data: masterData } = useLifeInsuranceMasterData();

  // Fetch dropdown data
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });
  const customerList = customerRes?.customerList || [];

  const companyList = masterData?.companies || [];
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
    payment_mode: '1',
    policy_number: '',
    policy_premium_term: '1',
    policy_term: '1',
    policy_login_date: '',
    policy_start_date: '',
    policy_end_date: '',
    policy_maturity_date: '',
    maturity_amount: '',
    plan_type: '1',
    sum_assured: '',
    net_premium: '',
    fy_gst: '18',
    gst_amount: '',
    total_premium: '',
    customer_payment_mode: '1',
    premium_overdue_days: '30',
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

  // Files & dynamic state arrays
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');

  const [riders, setRiders] = useState<Array<{ id: number; riders_id: string; riders_amount: string; riders_note: string }>>([
    { id: 1, riders_id: '', riders_amount: '', riders_note: '' }
  ]);

  const [nominees, setNominees] = useState<Array<{ id: number; nomainee_name: string; nomainee_relationship: string; nomainee_per: string }>>([
    { id: 1, nomainee_name: '', nomainee_relationship: '1', nomainee_per: '100' }
  ]);

  const [documents, setDocuments] = useState<Array<{ id: number; other_document_name: string; other_document_image: File | null }>>([
    { id: 1, other_document_name: '', other_document_image: null }
  ]);

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
        formData.append('id', queryId);
        formData.append('search', queryId);
        formData.append('limit', '100');
        formData.append('page', '1');

        const response = await api.post(endPointApi.LIFE_INSURANCE.LIFE_INSURANCE_LIST, formData);
        const resData = response?.data;
        const list = resData?.data?.life_insurance_list || resData?.data?.list || resData?.data || resData?.life_insurance_list || [];
        const item = Array.isArray(list)
          ? list.find((c: any) => String(c.id || c.life_insurance_id) === queryId) || list[0]
          : (resData?.data?.life_insurance_details || resData?.data || null);

        if (item) {
          const riderData = item.riders || item.rider || item.life_insurance_riders || item.rider_list || item.riders_list || [];
          const nomineeData = item.nominees || item.nominee || item.life_insurance_nominees || item.nominee_list || item.nominees_list || [];
          const docData = item.other_documents || item.other_document || item.documents || item.document_list || item.other_documents_list || [];

          setFormData(prev => ({
            ...prev,
            life_insurance_id: String(item.id || item.life_insurance_id || queryId),
            customer_id: String(item.customer_id || ''),
            companies_id: String(item.companies_id || item.company_id || ''),
            companies_agency_code: String(item.companies_agency_code || item.agency_code || ''),
            plan_name: String(item.plan_name || item.plan_id || ''),
            payment_mode: String(item.payment_mode || item.payment_mode_id || '1'),
            policy_number: item.policy_number || '',
            policy_term: String(item.policy_term || '1'),
            policy_premium_term: String(item.policy_premium_term || '1'),
            policy_login_date: item.policy_login_date || item.login_date || '',
            policy_start_date: item.policy_start_date || item.start_date || '',
            policy_end_date: item.policy_end_date || item.end_date || '',
            policy_maturity_date: item.policy_maturity_date || item.maturity_date || '',
            maturity_amount: String(item.maturity_amount ?? ''),
            plan_type: String(item.plan_type || item.plan_type_id || '1'),
            sum_assured: String(item.sum_assured ?? ''),
            net_premium: String(item.net_premium ?? item.total_premium ?? ''),
            gst_amount: String(item.gst_amount ?? ''),
            total_premium: String(item.total_premium ?? ''),
            customer_payment_mode: String(item.customer_payment_mode || '1'),
            premium_overdue_days: String(item.premium_overdue_days || '30'),
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
              nomainee_relationship: String(n.nomainee_relationship || n.nominee_relationship || n.relationship_id || '1'),
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

  const addRider = () => setRiders(prev => [...prev, { id: Date.now(), riders_id: '', riders_amount: '', riders_note: '' }]);
  const removeRider = (id: number) => setRiders(prev => prev.filter(r => r.id !== id));
  const updateRider = (id: number, field: string, value: string) => {
    setRiders(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addNominee = () => setNominees(prev => [...prev, { id: Date.now(), nomainee_name: '', nomainee_relationship: '1', nomainee_per: '' }]);
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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
      fy_gst: formData.fy_gst,
      gst_amount: formData.gst_amount,
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

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex items-center gap-2 mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] ">
      <Head>
        <title>Add Life Insurance - Insuraa</title>
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

            <h1 className="text-xl">{formData.life_insurance_id ? 'Edit Life Insurance' : 'Add Life Insurance'}</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Insurance'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white">

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
                    className={inputClass}
                    value={formData.customer_id}
                    onChange={(e) => handleChange('customer_id', e.target.value)}
                  >
                    <option value="">Select Customer Name</option>
                    {customerList.map((cust: any) => {
                      const id = cust.id || cust.customer_id;
                      const name = cust.first_name ? `${cust.first_name} ${cust.last_name || ''}`.trim() : (cust.name || `Customer #${id}`);
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </Select>
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
                  {existingPolicyPdfUrl && (
                    <div className="mt-2 text-xs text-[#2B4399] font-bold">
                      Uploaded Policy PDF: <a href={existingPolicyPdfUrl} target="_blank" rel="noreferrer" className="underline hover:text-[#203378]">{existingPolicyPdfUrl.split('/').pop() || 'View Policy PDF'}</a>
                    </div>
                  )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
                <div className="lg:col-span-2">
                  <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                  <Select
                    className={inputClass}
                    value={formData.companies_id}
                    onChange={(e) => handleChange('companies_id', e.target.value)}
                  >
                    <option value="">Select Insurance Company Name</option>
                    {companyList.map((comp: any) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
                  <Select
                    className={inputClass}
                    value={formData.plan_name}
                    onChange={(e) => handleChange('plan_name', e.target.value)}
                  >
                    <option value="">Select Company Plan Name</option>
                    {companyPlans.map((plan: any) => {
                      const pId = plan.id || plan.plan_id;
                      const pName = plan.plan_name || plan.name || `Plan #${pId}`;
                      return (
                        <option key={pId} value={pId}>
                          {pName}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <label className={labelClass}>Agency Code</label>
                  <Select
                    className={inputClass}
                    value={formData.companies_agency_code}
                    onChange={(e) => handleChange('companies_agency_code', e.target.value)}
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
                    className={inputClass}
                    value={formData.payment_mode}
                    onChange={(e) => handleChange('payment_mode', e.target.value)}
                  >
                    {paymentModes.map((pm: any) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className={labelClass}>Policy Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter Policy Number"
                    className={inputClass}
                    value={formData.policy_number}
                    onChange={(e) => handleChange('policy_number', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Policy Premium Term (Y)<span className="text-red-500">*</span></label>
                  {policyTermOptions.length > 0 ? (
                    <Select
                      className={inputClass}
                      value={formData.policy_premium_term}
                      onChange={(e) => handleChange('policy_premium_term', e.target.value)}
                    >
                      {policyTermOptions.map((pt: any) => (
                        <option key={pt.id} value={pt.term || pt.id}>
                          {pt.term || pt.id}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.policy_premium_term}
                      onChange={(e) => handleChange('policy_premium_term', e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Policy Term (Y)<span className="text-red-500">*</span></label>
                  {policyTermOptions.length > 0 ? (
                    <Select
                      className={inputClass}
                      value={formData.policy_term}
                      onChange={(e) => handleChange('policy_term', e.target.value)}
                    >
                      {policyTermOptions.map((pt: any) => (
                        <option key={pt.id} value={pt.term || pt.id}>
                          {pt.term || pt.id}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.policy_term}
                      onChange={(e) => handleChange('policy_term', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className={inputClass}
                    placeholder="Select Login Date"
                    value={formData.policy_login_date}
                    onChange={(dateStr: string) => handleChange('policy_login_date', dateStr)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className={inputClass}
                    placeholder="Select Start Date"
                    value={formData.policy_start_date}
                    onChange={(dateStr: string) => handleChange('policy_start_date', dateStr)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>Policy Premium End Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className={inputClass}
                    placeholder="Select Premium End Date"
                    value={formData.policy_end_date}
                    onChange={(dateStr: string) => handleChange('policy_end_date', dateStr)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Policy Maturity Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className={inputClass}
                    placeholder="Select Maturity Date"
                    value={formData.policy_maturity_date}
                    onChange={(dateStr: string) => handleChange('policy_maturity_date', dateStr)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Maturity Amount</label>
                  <input
                    type="text"
                    placeholder="Enter Maturity Amount"
                    className={inputClass}
                    value={formData.maturity_amount}
                    onChange={(e) => handleChange('maturity_amount', e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                  <Select
                    className={inputClass}
                    value={formData.plan_type}
                    onChange={(e) => handleChange('plan_type', e.target.value)}
                  >
                    {planTypeOptions.map((pt: any) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className={labelClass}>Sum Assured <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter Sum Assured"
                    className={inputClass}
                    value={formData.sum_assured}
                    onChange={(e) => handleChange('sum_assured', e.target.value)}
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className={labelClass}>Net Premium<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter Net Premium"
                    className={inputClass}
                    value={formData.net_premium}
                    onChange={(e) => handleChange('net_premium', e.target.value)}
                  />
                </div>

                {/* Dynamic Riders Section */}
                <div className="lg:col-span-4 space-y-4">
                  {riders.map((rider, index) => (
                    <div key={rider.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 items-end">
                      <div>
                        {index === 0 && <label className={labelClass}>Rider Name</label>}
                        <Select
                          className={inputClass}
                          value={rider.riders_id}
                          onChange={(e) => updateRider(rider.id, 'riders_id', e.target.value)}
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
                      <div>
                        {index === 0 && <label className={labelClass}>Rider Amount</label>}
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          className={inputClass}
                          value={rider.riders_amount}
                          onChange={(e) => updateRider(rider.id, 'riders_amount', e.target.value)}
                        />
                      </div>
                      <div className="lg:col-span-2 flex items-center gap-4">
                        <div className="flex-1">
                          {index === 0 && <label className={labelClass}>Note</label>}
                          <input
                            type="text"
                            placeholder="Enter Note"
                            className={inputClass}
                            value={rider.riders_note}
                            onChange={(e) => updateRider(rider.id, 'riders_note', e.target.value)}
                          />
                        </div>
                        {index === 0 ? (
                          <button type="button" onClick={addRider} className="bg-[#2B4399] text-white p-2.5 rounded-lg hover:bg-[#203378] transition-colors shrink-0 shadow-sm mt-6">
                            <Plus size={18} />
                          </button>
                        ) : (
                          <button type="button" onClick={() => removeRider(rider.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm mt-2">
                            <Minus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className={labelClass}>GST Amount</label>
                  <input
                    type="text"
                    placeholder="Enter GST Amount"
                    className={inputClass}
                    value={formData.gst_amount}
                    onChange={(e) => handleChange('gst_amount', e.target.value)}
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className={labelClass}>Total Premium</label>
                  <input
                    type="text"
                    placeholder="Total Premium"
                    className={inputClass}
                    value={formData.total_premium}
                    onChange={(e) => handleChange('total_premium', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Customer Payment Mode</label>
                  <Select
                    className={inputClass}
                    value={formData.customer_payment_mode}
                    onChange={(e) => handleChange('customer_payment_mode', e.target.value)}
                  >
                    <option value="1">Cash / Online</option>
                    <option value="2">Cheque</option>
                    <option value="3">Net Banking</option>
                  </Select>
                </div>
                <div className="lg:col-span-3">
                  <label className={labelClass}>Premium Overdue Days</label>
                  <Select
                    className={inputClass}
                    value={formData.premium_overdue_days}
                    onChange={(e) => handleChange('premium_overdue_days', e.target.value)}
                  >
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <div className={sectionHeaderClass}>
                <SettingsIcon /> Options
              </div>
              <div className="flex items-start gap-4 py-2 px-1">
                <input
                  type="checkbox"
                  checked={formData.regenerate_installments}
                  onChange={(e) => handleChange('regenerate_installments', e.target.checked)}
                  className="mt-1 w-4 h-4 border-gray-300 rounded text-[#2B4399] focus:ring-[#2D3591]"
                />
                <div>
                  <span className="text-sm text-gray-800 font-bold">Mark All Installments As Paid</span>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Check To Mark All Installments Up To Today's Date As Paid On Save.</p>
                </div>
              </div>
            </div>

            {/* Nominee Details */}
            <div>
              <div className="flex items-center justify-between bg-[#EEF1FA] text-[#2B4399] px-5 py-3 rounded-lg mb-5">
                <div className="flex items-center gap-2 text-[15px] font-bold">
                  <UsersIcon /> Nominee Details
                </div>
                <button type="button" onClick={addNominee} className="bg-[#2B4399] text-white p-1.5 rounded-md hover:bg-[#203378] transition-colors shadow-sm">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {nominees.map((nominee, index) => (
                  <div key={nominee.id} className="flex items-center gap-4">
                    <div className="flex-[2]">
                      <input
                        type="text"
                        placeholder="Nominee Name *"
                        className={inputClass}
                        value={nominee.nomainee_name}
                        onChange={(e) => updateNominee(nominee.id, 'nomainee_name', e.target.value)}
                      />
                    </div>
                    <div className="flex-[2]">
                      <Select
                        className={inputClass}
                        value={nominee.nomainee_relationship}
                        onChange={(e) => updateNominee(nominee.id, 'nomainee_relationship', e.target.value)}
                      >
                        {relationshipOptions.map((rel: any) => (
                          <option key={rel.id} value={rel.id}>
                            {rel.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Percentage (%)"
                        className={inputClass}
                        value={nominee.nomainee_per}
                        onChange={(e) => updateNominee(nominee.id, 'nomainee_per', e.target.value)}
                      />
                    </div>
                    {index > 0 && (
                      <button type="button" onClick={() => removeNominee(nominee.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm">
                        <Minus size={18} />
                      </button>
                    )}
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
                  className={inputClass}
                  value={formData.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <div className={sectionHeaderClass}>
                <BankIcon /> Bank Details IN Policy
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-5">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter Bank Name"
                    className={inputClass}
                    value={formData.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Account Type</label>
                  <input
                    type="text"
                    placeholder="Enter Account Type"
                    className={inputClass}
                    value={formData.account_type}
                    onChange={(e) => handleChange('account_type', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    className={inputClass}
                    value={formData.account_number}
                    onChange={(e) => handleChange('account_number', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className={labelClass}>IFSC CODE</label>
                  <input
                    type="text"
                    placeholder="Enter IFSC CODE"
                    className={inputClass}
                    value={formData.ifsc_code}
                    onChange={(e) => handleChange('ifsc_code', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter Account Holder Name"
                    className={inputClass}
                    value={formData.account_holder_name}
                    onChange={(e) => handleChange('account_holder_name', e.target.value)}
                  />
                </div>
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
                  <div key={doc.id} className="flex items-center gap-4">
                    <div className="flex-[2]">
                      <Select
                        className={inputClass}
                        value={doc.other_document_name}
                        onChange={(e) => updateDocument(doc.id, 'other_document_name', e.target.value)}
                      >
                        <option value="">Select Other Document Name</option>
                        {documentListOptions.map((dc: any) => {
                          const dId = dc.id || dc.document_id;
                          const dName = dc.name || dc.document_name || `Doc #${dId}`;
                          return (
                            <option key={dId} value={dId}>
                              {dName}
                            </option>
                          );
                        })}
                      </Select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <input
                        type="file"
                        onChange={(e) => updateDocument(doc.id, 'other_document_image', e.target.files?.[0] || null)}
                        className="border border-gray-300 rounded-lg text-sm px-4 py-1.5 w-full file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white"
                      />
                      {(doc as any).existing_image_url && !(doc.other_document_image) && (
                        <a href={(doc as any).existing_image_url} target="_blank" rel="noreferrer" className="text-xs text-[#2B4399] font-bold mt-1 underline">
                          View Uploaded Document
                        </a>
                      )}
                    </div>
                    {index > 0 && (
                      <button type="button" onClick={() => removeDocument(doc.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm">
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
    </div>
  );
}

// Icons
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function SettingsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>;
}
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function BanknoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
}
function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function BankIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
}
