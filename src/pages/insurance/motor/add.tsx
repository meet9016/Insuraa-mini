import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, Sparkles, User, FileText, Shield, Notebook } from 'lucide-react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { validateMotorInsurance } from '@/utils/validation';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { useMotorInsuranceMasterData, useMotorInsuranceCompanyPlansAndAgency, useMotorInsuranceActions } from '@/hooks/useMotorInsuranceApi';

export default function AddMotorInsurance() {
  const router = useRouter();
  const editId = router.query.id ? String(router.query.id) : '';
  const isEdit = Boolean(editId);
  const { insertMotorInsurance } = useMotorInsuranceActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch API master data & dropdowns
  const { data: masterData } = useMotorInsuranceMasterData();
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });

  const customerList = customerRes?.customerList || [];
  const companyList = masterData?.companies || [];
  const planTypeList = masterData?.plan_type || [];
  const vehicleTypeList = masterData?.vehicle_type || [];
  const classOfVehicleList = masterData?.class_of_vehicle || [];
  const insuranceTypeList = masterData?.insurance_type || [];
  const ncbOptionsList = masterData?.ncb_options || [];
  const documentNameList = masterData?.document_name || [];
  const maxDocs = masterData?.max_documents_allowed || 5;

  // Form State
  const [formData, setFormData] = useState({
    motor_insurance_id: '',
    // Customer Information
    customer_id: '',

    // Insurance Information
    companies_id: '',
    plan_name: '',
    companies_agency_code: '',
    plan_type: '',
    vehicle_type: '',
    class_of_vehicle: '',
    insurance_type: '',
    registration_number_rto: '',
    engine_number: '',
    chasis_no: '',
    policy_number: '',
    policy_login_date: '',
    policy_start_date: '',
    policy_end_date: '',
    mfy_year_of_manufacture: '',
    make_model_variant: '',
    ncb: '',
    cng_value: '',
    vehicle_value: '',
    own_damage_premimum: '',
    tp_premium: '',
    net_premium: '',
    gst_amount: '',
    total_premium: '',

    // Note
    note: '',
  });

  // Fetch existing details on Edit mode
  useEffect(() => {
    if (!router.isReady || !editId) return;

    setFormData(prev => ({ ...prev, motor_insurance_id: editId }));

    const fetchDetail = async () => {
      try {
        const reqData = new FormData();
        reqData.append('motor_insurance_id', editId);

        let item: any = null;

        try {
          const viewResponse = await api.post(endPointApi.MOTOR_INSURANCE.VIEW_MOTOR_INSURANCE, reqData);
          const viewResData = viewResponse?.data;
          item = viewResData?.data || viewResData;
        } catch (e) {
          console.warn('View endpoint failed, falling back to list endpoint', e);
        }

        if (!item || (!item.customer_id && !item.policy_number && !item.companies_id)) {
          const listFormData = new FormData();
          listFormData.append('page', '1');
          listFormData.append('limit', '100');
          listFormData.append('search', editId);

          const response = await api.post(endPointApi.MOTOR_INSURANCE.MOTOR_INSURANCE_LIST, listFormData);
          const resData = response?.data;
          const list = resData?.data || resData?.motor_insurance_list || [];
          if (Array.isArray(list)) {
            item = list.find((c: any) => String(c.id || c.motor_insurance_id) === editId) || list[0];
          }
        }

        if (item) {
          setFormData({
            motor_insurance_id: String(item.motor_insurance_id || item.id || editId).trim(),
            customer_id: String(item.customer_id || '').trim(),
            companies_id: String(item.companies_id || '').trim(),
            plan_name: String(item.plan_name || '').trim(),
            companies_agency_code: String(item.companies_agency_code || '').trim(),
            plan_type: String(item.plan_type || '').trim(),
            vehicle_type: String(item.vehicle_type || '').trim(),
            class_of_vehicle: String(item.class_of_vehicle || '').trim(),
            insurance_type: String(item.insurance_type || '').trim(),
            registration_number_rto: String(item.registration_number_rto || '').trim(),
            engine_number: String(item.engine_number || '').trim(),
            chasis_no: String(item.chasis_no || '').trim(),
            policy_number: String(item.policy_number || '').trim(),
            policy_login_date: String(item.policy_login_date || '').trim(),
            policy_start_date: String(item.policy_start_date || '').trim(),
            policy_end_date: String(item.policy_end_date || '').trim(),
            mfy_year_of_manufacture: String(item.mfy_year_of_manufacture || '').trim(),
            make_model_variant: String(item.make_model_variant || '').trim(),
            ncb: String(item.ncb || '').trim(),
            cng_value: String(item.cng_value || '').trim(),
            vehicle_value: String(item.vehicle_value || '').trim(),
            own_damage_premimum: String(item.own_damage_premimum || '').trim(),
            tp_premium: String(item.tp_premium || '').trim(),
            net_premium: String(item.net_premium || '').trim(),
            gst_amount: String(item.gst_amount || '').trim(),
            total_premium: String(item.total_premium || '').trim(),
            note: String(item.note || '').trim(),
          });

          if (item.policy_pdf) {
            setExistingPolicyPdfUrl(String(item.policy_pdf).trim());
          }

          const docData = item.documents || item.other_documents || [];
          if (Array.isArray(docData) && docData.length > 0) {
            setDocuments(docData.map((d: any, idx: number) => ({
              id: Date.now() + idx,
              other_document_name: String(d.other_document_name || d.document_name_id || d.id || '').trim(),
              other_document_image: null,
              existing_image_url: d.other_document_image || d.image || d.file_url || (typeof d === 'string' ? d : null),
            })));
          }
        }
      } catch (err) {
        toast.error('Failed to load motor insurance details');
      }
    };

    fetchDetail();
  }, [router.isReady, editId]);

  // Dynamic Company Plans & Agency Codes based on selected company_id
  const { data: plansAndAgencyRes } = useMotorInsuranceCompanyPlansAndAgency(formData.companies_id);
  const companyPlans = plansAndAgencyRes?.plan_list || [];
  const agencyCodeList = plansAndAgencyRes?.agency_code || [];

  // Policy PDF file state
  const [policyPdf, setPolicyPdf] = useState<File | null>(null);
  const [existingPolicyPdfUrl, setExistingPolicyPdfUrl] = useState<string>('');

  // Additional Documents State
  const [documents, setDocuments] = useState<Array<{ id: number; other_document_name: string; other_document_image: File | null; existing_image_url?: string | null }>>([
    { id: 1, other_document_name: '', other_document_image: null }
  ]);

  const handleChange = (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);
    if (errors[field]) {
      const { errors: newErrors } = validateMotorInsurance(updatedForm);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const handleBlur = (field: string) => {
    if (errors[field] || formData[field as keyof typeof formData]) {
      const { errors: newErrors } = validateMotorInsurance(formData);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  // Auto-calculate Policy End Date (1 Year)
  useEffect(() => {
    if (formData.policy_start_date) {
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
  }, [formData.policy_start_date]);

  // Auto-calculate Net Premium
  useEffect(() => {
    const od = parseFloat(formData.own_damage_premimum);
    const tp = parseFloat(formData.tp_premium);

    if (!isNaN(od) || !isNaN(tp)) {
      const net = (isNaN(od) ? 0 : od) + (isNaN(tp) ? 0 : tp);
      setFormData(prev => prev.net_premium !== String(net) ? { ...prev, net_premium: String(net) } : prev);
    } else if (formData.own_damage_premimum === '' && formData.tp_premium === '') {
      setFormData(prev => prev.net_premium !== '' ? { ...prev, net_premium: '' } : prev);
    }
  }, [formData.own_damage_premimum, formData.tp_premium]);

  // Auto-calculate Total Premium
  useEffect(() => {
    const net = parseFloat(formData.net_premium);
    const gst = parseFloat(formData.gst_amount);

    if (!isNaN(net) || !isNaN(gst)) {
      const total = (isNaN(net) ? 0 : net) + (isNaN(gst) ? 0 : gst);
      setFormData(prev => prev.total_premium !== String(total) ? { ...prev, total_premium: String(total) } : prev);
      setErrors(prev => ({ ...prev, total_premium: '' }));
    } else if (formData.net_premium === '' && formData.gst_amount === '') {
      setFormData(prev => prev.total_premium !== '' ? { ...prev, total_premium: '' } : prev);
    }
  }, [formData.net_premium, formData.gst_amount]);

  const addDocument = () => {
    if (documents.length < maxDocs) {
      setDocuments(prev => [...prev, { id: Date.now(), other_document_name: '', other_document_image: null }]);
    } else {
      toast.warning(`Maximum ${maxDocs} documents allowed`);
    }
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDocument = (id: number, field: 'other_document_name' | 'other_document_image', value: any) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const { isValid, errors: validationErrors } = validateMotorInsurance(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        policy_pdf: policyPdf,
        other_documents: documents
          .filter(d => d.other_document_name)
          .map(d => ({
            other_document_name: d.other_document_name,
            other_document_image: d.other_document_image
          }))
      };

      const res = await insertMotorInsurance(payload);
      if (res?.success) {
        router.push('/insurance/motor');
      }
    } catch (err: any) {
      toast.error('Failed to submit form');
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
        <title>{isEdit ? 'Edit Motor Insurance' : 'Add Motor Insurance'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">

        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{isEdit ? 'Edit Motor Insurance' : 'Add Motor Insurance'}</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Insurance' : 'Save Insurance')}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form className="space-y-9 bg-white" onSubmit={handleSubmit}>

          {/* Customer Information Section Card */}
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
                    return (
                      <option key={id} value={id}>
                        {phone ? `${name} (${phone})` : name}
                      </option>
                    );
                  })}
                </Select>
                {errors.customer_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.customer_id}</p>}
              </div>
            </div>
          </div>

          {/* Policy PDF Details Section Card */}
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
                  <button type="button" className="h-[46px] bg-[#2B4399] text-white px-6 rounded-xl text-sm font-bold hover:bg-[#203378] transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0">
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

          {/* Insurance Information Section Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>Insurance Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">

              <div>
                <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.companies_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.companies_id}
                  onChange={(e: any) => handleChange('companies_id', e.target.value)}
                  error={errors.companies_id}
                >
                  <option value="">Select Insurance Company Name</option>
                  {companyList.map((comp: any) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </Select>
                {errors.companies_id && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companies_id}</p>}
              </div>

              <div>
                <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.plan_name ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.plan_name}
                  onChange={(e: any) => handleChange('plan_name', e.target.value)}
                  error={errors.plan_name}
                >
                  <option value="">Select Company Plan Name</option>
                  {companyPlans.map((plan: any) => {
                    const pId = plan.plan_id || plan.id;
                    const pName = plan.plan_name || plan.name || `Plan #${pId}`;
                    return (
                      <option key={pId} value={pId}>
                        {pName}
                      </option>
                    );
                  })}
                </Select>
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
                    const id = ac.agency_code_id || ac.id || ac.code;
                    const label = ac.code ? (ac.name ? `${ac.code} - ${ac.name}` : ac.code) : (ac.name || `Code #${id}`);
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
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
                  {planTypeList.map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </Select>
                {errors.plan_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.plan_type}</p>}
              </div>

              <div>
                <label className={labelClass}>Vehicle Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.vehicle_type ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.vehicle_type}
                  onChange={(e: any) => handleChange('vehicle_type', e.target.value)}
                  error={errors.vehicle_type}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypeList.map((vt: any) => (
                    <option key={vt.id} value={vt.id}>
                      {vt.name}
                    </option>
                  ))}
                </Select>
                {errors.vehicle_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.vehicle_type}</p>}
              </div>

              <div>
                <label className={labelClass}>Class Of Vehicle <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.class_of_vehicle ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
                  value={formData.class_of_vehicle}
                  onChange={(e: any) => handleChange('class_of_vehicle', e.target.value)}
                  error={errors.class_of_vehicle}
                >
                  <option value="">Select Class of vehicle</option>
                  {classOfVehicleList.map((cov: any) => (
                    <option key={cov.id} value={cov.id}>
                      {cov.name}
                    </option>
                  ))}
                </Select>
                {errors.class_of_vehicle && <p className="text-xs text-red-500 font-semibold mt-1">{errors.class_of_vehicle}</p>}
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
                  {insuranceTypeList.map((it: any) => (
                    <option key={it.id} value={it.id}>
                      {it.name}
                    </option>
                  ))}
                </Select>
                {errors.insurance_type && <p className="text-xs text-red-500 font-semibold mt-1">{errors.insurance_type}</p>}
              </div>

              <div>
                <Input
                  label={<>Registration Number/RTO <span className="text-red-500">*</span></>}
                  name="registration_number_rto"
                  value={formData.registration_number_rto}
                  onChange={(e: any) => handleChange('registration_number_rto', e.target.value)}
                  onBlur={() => handleBlur('registration_number_rto')}
                  placeholder="Enter Registration Number/RTO"
                  error={errors.registration_number_rto}
                />
              </div>

              <div>
                <Input
                  label="Engine Number"
                  name="engine_number"
                  value={formData.engine_number}
                  onChange={(e: any) => handleChange('engine_number', e.target.value)}
                  placeholder="Enter Engine Number"
                />
              </div>

              <div>
                <Input
                  label="Chasis No"
                  name="chasis_no"
                  value={formData.chasis_no}
                  onChange={(e: any) => handleChange('chasis_no', e.target.value)}
                  placeholder="Enter Chasis No"
                />
              </div>

              <div>
                <Input
                  label={<>Policy Number <span className="text-red-500">*</span></>}
                  name="policy_number"
                  value={formData.policy_number}
                  onChange={(e: any) => handleChange('policy_number', e.target.value)}
                  onBlur={() => handleBlur('policy_number')}
                  placeholder="Enter Policy Number"
                  error={errors.policy_number}
                />
              </div>

              <div>
                <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                <DatePicker
                  value={formData.policy_login_date}
                  onChange={(date) => handleChange('policy_login_date', date)}
                  placeholder="Select Login Date"
                  error={errors.policy_login_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  value={formData.policy_start_date}
                  onChange={(date) => handleChange('policy_start_date', date)}
                  placeholder="Select Start Date"
                  error={errors.policy_start_date}
                />
              </div>

              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  value={formData.policy_end_date}
                  onChange={(date) => handleChange('policy_end_date', date)}
                  placeholder="Select End Date"
                  error={errors.policy_end_date}
                />
              </div>

              <div>
                <Input
                  label="MFY (Year Of Manufacture)"
                  name="mfy_year_of_manufacture"
                  value={formData.mfy_year_of_manufacture}
                  onChange={(e: any) => handleChange('mfy_year_of_manufacture', e.target.value)}
                  placeholder="Enter MFY ( Year of manufacture )"
                />
              </div>

              <div>
                <Input
                  label="Make/Model/variant"
                  name="make_model_variant"
                  value={formData.make_model_variant}
                  onChange={(e: any) => handleChange('make_model_variant', e.target.value)}
                  placeholder="Enter Make/model/variant"
                />
              </div>

              <div>
                <label className={labelClass}>NCB %</label>
                <Select
                  className={selectClass}
                  value={formData.ncb}
                  onChange={(e: any) => handleChange('ncb', e.target.value)}
                >
                  <option value="">Select NCB</option>
                  {ncbOptionsList.map((ncbItem: any) => (
                    <option key={ncbItem.id} value={ncbItem.id}>
                      {ncbItem.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  label="CNG Value"
                  name="cng_value"
                  value={formData.cng_value}
                  onChange={(e: any) => handleChange('cng_value', e.target.value)}
                  onBlur={() => handleBlur('cng_value')}
                  placeholder="Enter CNG Value"
                  error={errors.cng_value}
                />
              </div>

              <div>
                <Input
                  label="Vehicle Value (IDV)"
                  name="vehicle_value"
                  value={formData.vehicle_value}
                  onChange={(e: any) => handleChange('vehicle_value', e.target.value)}
                  onBlur={() => handleBlur('vehicle_value')}
                  placeholder="Enter Vehicle Value (IDV)"
                  error={errors.vehicle_value}
                />
              </div>

              <div>
                <Input
                  label="Own Damage Premium"
                  name="own_damage_premimum"
                  value={formData.own_damage_premimum}
                  onChange={(e: any) => handleChange('own_damage_premimum', e.target.value)}
                  onBlur={() => handleBlur('own_damage_premimum')}
                  placeholder="Enter Own Damage Premium"
                  error={errors.own_damage_premimum}
                />
              </div>

              <div>
                <Input
                  label="TP Premium"
                  name="tp_premium"
                  value={formData.tp_premium}
                  onChange={(e: any) => handleChange('tp_premium', e.target.value)}
                  onBlur={() => handleBlur('tp_premium')}
                  placeholder="Enter TP Premium"
                  error={errors.tp_premium}
                />
              </div>

              <div>
                <Input
                  label={<>Net Premium <span className="text-red-500">*</span></>}
                  name="net_premium"
                  value={formData.net_premium}
                  onChange={(e: any) => handleChange('net_premium', e.target.value)}
                  onBlur={() => handleBlur('net_premium')}
                  placeholder="Enter Net Premium"
                  error={errors.net_premium}
                />
              </div>

              <div>
                <Input
                  label="GST Amount"
                  name="gst_amount"
                  value={formData.gst_amount}
                  onChange={(e: any) => handleChange('gst_amount', e.target.value)}
                  onBlur={() => handleBlur('gst_amount')}
                  placeholder="Enter GST Amount"
                  error={errors.gst_amount}
                />
              </div>

              <div>
                <Input
                  label={<>Total Premium <span className="text-red-500">*</span></>}
                  name="total_premium"
                  value={formData.total_premium}
                  onChange={(e: any) => handleChange('total_premium', e.target.value)}
                  onBlur={() => handleBlur('total_premium')}
                  placeholder="Enter Total Premium"
                  error={errors.total_premium}
                />
              </div>
            </div>
          </div>

          {/* Note Details Section Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Notebook size={18} />
                <span>Note Details</span>
              </div>
            </div>
            <div>
              <Input
                as="textarea"
                label="Note"
                name="note"
                value={formData.note}
                onChange={(e: any) => handleChange('note', e.target.value)}
                placeholder="Enter Note"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Additional Document Information Section Card (2-Column Grid Layout matching Life Insurance) */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/90">
                  <div className="w-full sm:w-1/2">
                    <label className={labelClass}>Document Name</label>
                    <Select
                      className={selectClass}
                      value={doc.other_document_name}
                      onChange={(e: any) => updateDocument(doc.id, 'other_document_name', e.target.value)}
                    >
                      <option value="">Select Document Name</option>
                      {documentNameList.map((d: any) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <FileUpload
                      label="Upload Image/Document"
                      name={`other_document_image[${index}]`}
                      file={doc.other_document_image}
                      existingUrl={doc.existing_image_url}
                      onChange={(file) => updateDocument(doc.id, 'other_document_image', file)}
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
