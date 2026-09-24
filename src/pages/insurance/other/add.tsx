import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'react-toastify';
import { useOtherInsuranceMasterData, useOtherInsuranceCompanyPlansAndAgency, useOtherInsuranceActions, useOtherInsuranceView } from '@/hooks/useOtherInsuranceApi';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { validateOtherInsurance, otherInsuranceSchema } from '@/utils/validation';

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
  const customerList = customerRes?.customerList || [];
  const companyList = masterData?.companies || [];
  const insuranceTypes = masterData?.insurance_type || [];
  const planTypes = masterData?.plan_type || [];
  const companyPlans = plansRes?.plan_list || [];
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
                <Select
                  className={`${selectClass} ${errors.companies_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.companies_id}
                  onChange={(e: any) => handleChange('companies_id', e.target.value)}
                  onBlur={() => handleBlur('companies_id')}
                >
                  <option value="">Select Insurance Company Name</option>
                  {companyList.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </Select>
                {errors.companies_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companies_id}</p>}
              </div>

              <div>
                <label className={labelClass}>Plan Name</label>
                <Select
                  className={selectClass}
                  value={formData.plan_name}
                  onChange={(e: any) => handleChange('plan_name', e.target.value)}
                >
                  <option value="">Select Plan Name</option>
                  {companyPlans.map((p: any) => (
                    <option key={p.plan_id} value={String(p.plan_id)}>{p.plan_name}</option>
                  ))}
                </Select>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/90">
                  <div className="w-full sm:w-1/2">
                    <label className={labelClass}>Document Name</label>
                    <Select
                      className={selectClass}
                      value={doc.document_name}
                      onChange={(e: any) => updateDocument(doc.id, 'document_name', e.target.value)}
                    >
                      <option value="">Select Document Name</option>
                      {documentNameOptions.map((docOpt: any) => (
                        <option key={docOpt.id} value={String(docOpt.id)}>{docOpt.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <FileUpload
                      label="Upload Image/Document"
                      name={`document_file_${doc.id}`}
                      accept="image/*,.pdf,.doc,.docx"
                      file={doc.document_file}
                      existingUrl={doc.existing_image_url || ''}
                      onChange={(file) => updateDocument(doc.id, 'document_file', file)}
                      placeholder="Click or drag image to upload"
                    />
                  </div>
                  {index > 0 && (
                    <div className="shrink-0 mt-[25px]">
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="w-[34px] h-[34px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                        title="Remove Document"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
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

