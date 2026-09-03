import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import PageHeader from '@/components/ui/PageHeader';
import { useCustomerDropdowns } from '@/hooks/useCustomerDropdowns';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';
import { validateCustomer } from '@/utils/validation';

export default function AddCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const { data: dropdownData } = useCustomerDropdowns();

  const [formValues, setFormValues] = useState({
    customerId: id ? String(id) : '',
    customerType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    customerNumber: '',
    email: '',
    dob: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    education: '',
    maritalStatus: '',
    anniversaryDate: '',
    adharCardNo: '',
    pancardNo: '',
    referenceBy: '',
    pincode: '',
    nationality: 'India',
    state: '',
    city: '',
    address: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customerImage, setCustomerImage] = useState<File | null>(null);

  const [documents, setDocuments] = useState<{ id: number; documentId: string; file: File | null }[]>([
    { id: 1, documentId: '', file: null }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const queryId = router.query.id ? String(router.query.id) : '';
    if (!queryId) return;

    setFormValues(prev => ({ ...prev, customerId: queryId }));

    const fetchCustomerDetails = async () => {
      try {
        let resData;
        try {
          const response = await api.get(endPointApi.CUSTOMER.CUSTOMER_LIST, {
            params: { customer_id: queryId, id: queryId, search: queryId, limit: 100, page: 1 }
          });
          resData = response.data;
        } catch (e) {
          const formData = new FormData();
          formData.append('customer_id', queryId);
          formData.append('id', queryId);
          formData.append('search', queryId);
          formData.append('limit', '100');
          formData.append('page', '1');
          const response = await api.post(endPointApi.CUSTOMER.CUSTOMER_LIST, formData);
          resData = response.data;
        }

        const list = resData?.data?.customer_list || resData?.data?.list || resData?.data || resData?.customer_list || [];
        const item = Array.isArray(list)
          ? list.find((c: any) => String(c.id || c.customer_id) === queryId) || list[0]
          : (resData?.data?.customer_details || resData?.data || null);

        if (item) {
          const rawDob = item.dob || item.date_of_birth || item.customer_dob || item.birth_date || '';
          const rawAnniversary = item.anniversary_date || item.anniversary || item.anniversary_dob || item.marriage_date || '';

          setFormValues({
            customerId: String(item.id || item.customer_id || queryId),
            customerType: String(item.customer_type || item.customer_type_id || ''),
            firstName: item.first_name || item.name?.split(' ')[0] || '',
            middleName: item.middle_name || '',
            lastName: item.last_name || item.name?.split(' ').slice(1).join(' ') || '',
            customerNumber: item.customer_number || item.number || item.phone || '',
            email: item.email || '',
            dob: rawDob,
            age: String(item.age || ''),
            gender: String(item.gender || item.gender_id || ''),
            height: String(item.height ?? item.customer_height ?? item.height_id ?? item.height_val ?? ''),
            weight: String(item.weight ?? item.customer_weight ?? item.weight_id ?? item.weight_val ?? ''),
            education: String(item.education || item.education_id || ''),
            maritalStatus: String(item.marital_status || item.marital_status_id || ''),
            anniversaryDate: rawAnniversary,
            adharCardNo: item.adhar_card_no || item.adhar_no || '',
            pancardNo: item.pancard_no || item.pan_no || '',
            referenceBy: item.reference_by || '',
            pincode: item.pincode || '',
            nationality: item.nationality || 'India',
            state: item.state || '',
            city: item.city || '',
            address: item.address || '',
          });

          if (item.documents && Array.isArray(item.documents) && item.documents.length > 0) {
            setDocuments(item.documents.map((d: any, idx: number) => ({
              id: idx + 1,
              documentId: String(d.document_id || d.id || ''),
              file: null
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching customer details for edit:', err);
      }
    };

    fetchCustomerDetails();
  }, [router.isReady, router.query.id]);

  const handleChange = (field: string, value: string) => {
    let sanitizedValue = value;
    if (field === 'customerNumber' || field === 'pincode') {
      sanitizedValue = value.replace(/\D/g, '');
    }

    setFormValues(prev => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const { isValid, errors: newErrors } = validateCustomer(formValues);
    setErrors(newErrors);
    return isValid;
  };

  const addDocument = () => {
    if (documents.length < 5) {
      setDocuments([...documents, { id: Date.now(), documentId: '', file: null }]);
    }
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleDocumentChange = (id: number, documentId: string) => {
    setDocuments(docs => docs.map(doc => doc.id === id ? { ...doc, documentId } : doc));
  };

  const handleDocumentFileChange = (id: number, file: File | null) => {
    setDocuments(docs => docs.map(doc => doc.id === id ? { ...doc, file } : doc));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const activeCustomerId = formValues.customerId || (router.query.id ? String(router.query.id) : '');
      const payload = new FormData();
      payload.append('customer_id', activeCustomerId);
      payload.append('customer_type', formValues.customerType);
      payload.append('first_name', formValues.firstName);
      payload.append('middle_name', formValues.middleName);
      payload.append('last_name', formValues.lastName);
      payload.append('customer_number', formValues.customerNumber);
      payload.append('email', formValues.email);
      payload.append('dob', formValues.dob);
      payload.append('age', formValues.age);
      payload.append('gender', formValues.gender);
      payload.append('height', formValues.height);
      payload.append('weight', formValues.weight);
      payload.append('education', formValues.education);
      payload.append('marital_status', formValues.maritalStatus);
      payload.append('anniversary_date', formValues.anniversaryDate);
      payload.append('adhar_card_no', formValues.adharCardNo);
      payload.append('pancard_no', formValues.pancardNo);
      payload.append('reference_by', formValues.referenceBy);
      payload.append('pincode', formValues.pincode);
      payload.append('nationality', formValues.nationality);
      payload.append('state', formValues.state);
      payload.append('city', formValues.city);
      payload.append('address', formValues.address);

      if (customerImage) {
        payload.append('customer_image', customerImage);
      }

      documents.forEach((doc, index) => {
        if (doc.documentId) {
          payload.append(`document_id[${index}]`, doc.documentId);
        }
        if (doc.file) {
          payload.append(`document_image[${index}]`, doc.file);
        }
      });

      const response = await api.post(endPointApi.CUSTOMER.INSERT_CUSTOMER, payload);
      const resData = response.data;

      if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
        toast.success(resData?.message || 'Customer saved successfully!');
        setTimeout(() => {
          router.push('/customers');
        }, 1500);
      } else {
        toast.error(resData?.message || 'Failed to save customer');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Error occurred while saving customer';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex justify-between items-center mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";
  const getInputClass = (fieldName: string) =>
    `${inputClass} ${errors[fieldName] ? '!border-red-500 ring-2 ring-red-500/20' : ''}`;

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>{id ? 'Edit Customer' : 'Add Customer'} - Insuraa</title>
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
        <PageHeader
          title={id ? 'Edit Customer' : 'Add Customer'}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText={id ? 'Update Customer' : 'Save Customer'}
        />

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white">

          {/* Customer Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><UserIcon /> Customer Information</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Customer Type <span className="text-red-500">*</span></label>
                <Select
                  className={getInputClass('customerType')}
                  value={formValues.customerType}
                  onChange={(e: any) => handleChange('customerType', e.target.value)}
                >
                  <option value="">Select Customer Type</option>
                  {dropdownData?.customer_type?.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {errors.customerType && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerType}</p>
                )}
              </div>
              <div className="hidden md:block md:col-span-3"></div>

              <div>
                <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getInputClass('firstName')}
                  placeholder="Enter First Name"
                  value={formValues.firstName}
                  onChange={(e: any) => handleChange('firstName', e.target.value)}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.firstName}</p>}
              </div>

              <div>
                <label className={labelClass}>Middle Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Middle Name"
                  value={formValues.middleName}
                  onChange={(e: any) => handleChange('middleName', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getInputClass('lastName')}
                  placeholder="Enter Last Name"
                  value={formValues.lastName}
                  onChange={(e: any) => handleChange('lastName', e.target.value)}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.lastName}</p>}
              </div>

              <div>
                <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getInputClass('customerNumber')}
                  placeholder="Enter Phone Number"
                  value={formValues.customerNumber}
                  onChange={(e: any) => handleChange('customerNumber', e.target.value)}
                />
                {errors.customerNumber && <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerNumber}</p>}
              </div>

              <div>
                <label className={labelClass}>Customer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => setCustomerImage(e.target.files?.[0] || null)}
                  className="h-[46px] border border-gray-300 rounded-lg text-sm px-4 py-2.5 w-full file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white"
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="Enter Email"
                  value={formValues.email}
                  onChange={(e: any) => handleChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Reference By</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Reference By"
                  value={formValues.referenceBy}
                  onChange={(e: any) => handleChange('referenceBy', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Date Of Birth</label>
                <DatePicker
                  className={inputClass}
                  value={formValues.dob}
                  onChange={(dateStr: string) => handleChange('dob', dateStr)}
                  placeholder="Select Date Of Birth"
                />
              </div>

              <div>
                <label className={labelClass}>Year ( Age )</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Year ( Age )"
                  value={formValues.age}
                  onChange={(e: any) => handleChange('age', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <Select
                  className={inputClass}
                  value={formValues.gender}
                  onChange={(e: any) => handleChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  {dropdownData?.gender?.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className={labelClass}>Height</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Height"
                  value={formValues.height}
                  onChange={(e: any) => handleChange('height', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Weight</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Weight"
                  value={formValues.weight}
                  onChange={(e: any) => handleChange('weight', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Marital Status</label>
                <Select
                  className={inputClass}
                  value={formValues.maritalStatus}
                  onChange={(e: any) => handleChange('maritalStatus', e.target.value)}
                >
                  <option value="">Select Marital Status</option>
                  {dropdownData?.marital_status?.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={labelClass}>Anniversary Date</label>
                <DatePicker
                  className={inputClass}
                  value={formValues.anniversaryDate}
                  onChange={(dateStr: string) => handleChange('anniversaryDate', dateStr)}
                  placeholder="Select Anniversary Date"
                />
              </div>

              <div>
                <label className={labelClass}>Education</label>
                <Select
                  className={inputClass}
                  value={formValues.education}
                  onChange={(e: any) => handleChange('education', e.target.value)}
                >
                  <option value="">Select Education</option>
                  {dropdownData?.education?.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={labelClass}>Adhar Card Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Adhar Card Number"
                  value={formValues.adharCardNo}
                  onChange={(e: any) => handleChange('adharCardNo', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Pancard Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Pancard Number"
                  value={formValues.pancardNo}
                  onChange={(e: any) => handleChange('pancardNo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><MapPinIcon /> Address Information</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={getInputClass('pincode')}
                  placeholder="Enter Pincode"
                  value={formValues.pincode}
                  onChange={(e: any) => handleChange('pincode', e.target.value)}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1 font-medium">{errors.pincode}</p>}
              </div>

              <div>
                <label className={labelClass}>Nationality</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Nationality"
                  value={formValues.nationality}
                  onChange={(e: any) => handleChange('nationality', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="State"
                  value={formValues.state}
                  onChange={(e: any) => handleChange('state', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="City"
                  value={formValues.city}
                  onChange={(e: any) => handleChange('city', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Home Address</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Home Address"
                  value={formValues.address}
                  onChange={(e: any) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><FileIcon /> Document Information</div>
              <button
                type="button"
                onClick={addDocument}
                disabled={documents.length >= 5}
                className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-semibold ${documents.length >= 5
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2B4399] text-white hover:bg-[#203378]'
                  }`}
                title={documents.length >= 5 ? 'Maximum 5 documents allowed' : 'Add Document'}
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1 w-full">
                    <Select
                      className={inputClass}
                      value={doc.documentId}
                      onChange={(e: any) => handleDocumentChange(doc.id, e.target.value)}
                    >
                      <option value="">Select Document Name</option>
                      {dropdownData?.document_name?.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      onChange={(e: any) => handleDocumentFileChange(doc.id, e.target.files?.[0] || null)}
                      className="border border-gray-300 rounded-lg text-sm px-4 py-2 w-full file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="bg-[#ff0000b3] text-white p-1 rounded-sm transition-colors mt-1 md:mt-0 shadow-sm shrink-0 flex items-center justify-center"
                    title="Remove"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// Minimal Icons for section headers
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function MapPinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
}
