import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft, User, MapPin, FileText } from 'lucide-react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import FileUpload from '@/components/ui/FileUpload';
import { useCustomerDropdowns } from '@/hooks/useCustomerDropdowns';
import { usePincodeDetails } from '@/hooks/useCustomerApi';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';
import { validateCustomer } from '@/utils/validation';

interface CustomerDocItem {
  id: number;
  documentId: string;
  file: File | null;
  existing_image_url?: string | null;
}

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
    nationality: '',
    state: '',
    city: '',
    address: '',
  });

  const { data: pincodeData, isLoading: isPincodeLoading } = usePincodeDetails(formValues.pincode);

  useEffect(() => {
    if (pincodeData) {
      setFormValues(prev => ({
        ...prev,
        nationality: pincodeData.country || prev.nationality || 'India',
        state: pincodeData.state || prev.state || '',
        city: pincodeData.city || prev.city || '',
      }));
    }
  }, [pincodeData]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customerImage, setCustomerImage] = useState<File | null>(null);
  const [existingCustomerImageUrl, setExistingCustomerImageUrl] = useState<string>('');

  const [documents, setDocuments] = useState<CustomerDocItem[]>([
    { id: 1, documentId: '', file: null, existing_image_url: null }
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

          const imgUrl = item.customer_image || item.image || item.image_url || item.profile_image;
          if (imgUrl) {
            setExistingCustomerImageUrl(String(imgUrl));
          }

          if (item.documents && Array.isArray(item.documents) && item.documents.length > 0) {
            setDocuments(item.documents.map((d: any, idx: number) => ({
              id: idx + 1,
              documentId: String(d.document_id || d.id || ''),
              file: null,
              existing_image_url: d.document_image || d.image || d.file || d.path || null
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
    if (field === 'customerNumber') {
      sanitizedValue = value.replace(/\D/g, '');
    }
    if (field === 'pincode') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
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
      setDocuments(prev => [...prev, { id: Date.now(), documentId: '', file: null, existing_image_url: null }]);
    } else {
      toast.warning('Maximum 5 documents allowed');
    }
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const handleDocumentChange = (id: number, documentId: string) => {
    setDocuments(docs => docs.map(doc => doc.id === id ? { ...doc, documentId } : doc));
  };

  const handleDocumentFileChange = (id: number, file: File | null) => {
    setDocuments(docs => docs.map(doc => doc.id === id ? { ...doc, file } : doc));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-xl flex items-center justify-between gap-2 mb-6 border-l-4 border-[#2B4399]";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const selectClass = "w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs";

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-0">
      <Head>
        <title>{id ? 'Edit Customer' : 'Add Customer'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">

        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{id ? 'Edit Customer' : 'Add Customer'}</h1>
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
              {isSubmitting ? 'Saving...' : id ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-9 bg-white">

          {/* Customer Information (Strict 4 Fields Per Row Grid) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Customer Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Row 1 */}
              <div>
                <label className={labelClass}>Customer Type <span className="text-red-500">*</span></label>
                <Select
                  className={`${selectClass} ${errors.customerType ? '!border-red-500 ring-2 ring-red-500/20' : ''}`}
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
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.customerType}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                <Input
                  name="firstName"
                  placeholder="Enter First Name"
                  value={formValues.firstName}
                  onChange={(e: any) => handleChange('firstName', e.target.value)}
                  error={errors.firstName}
                />
              </div>

              <div>
                <label className={labelClass}>Middle Name</label>
                <Input
                  name="middleName"
                  placeholder="Enter Middle Name"
                  value={formValues.middleName}
                  onChange={(e: any) => handleChange('middleName', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                <Input
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={formValues.lastName}
                  onChange={(e: any) => handleChange('lastName', e.target.value)}
                  error={errors.lastName}
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                <Input
                  name="customerNumber"
                  placeholder="Enter Phone Number"
                  value={formValues.customerNumber}
                  onChange={(e: any) => handleChange('customerNumber', e.target.value)}
                  error={errors.customerNumber}
                />
              </div>

              <div>
                <FileUpload
                  label="Customer Image"
                  name="customer_image"
                  accept="image/*"
                  file={customerImage}
                  existingUrl={existingCustomerImageUrl}
                  onChange={(file) => setCustomerImage(file)}
                  placeholder="Click or drag image to upload"
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formValues.email}
                  onChange={(e: any) => handleChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Reference By</label>
                <Input
                  name="referenceBy"
                  placeholder="Reference By"
                  value={formValues.referenceBy}
                  onChange={(e: any) => handleChange('referenceBy', e.target.value)}
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className={labelClass}>Date Of Birth</label>
                <DatePicker
                  className={selectClass}
                  value={formValues.dob}
                  onChange={(dateStr: string) => handleChange('dob', dateStr)}
                  placeholder="Select Date Of Birth"
                />
              </div>

              <div>
                <label className={labelClass}>Year ( Age )</label>
                <Input
                  name="age"
                  placeholder="Enter Year ( Age )"
                  value={formValues.age}
                  onChange={(e: any) => handleChange('age', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <Select
                  className={selectClass}
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
                <Input
                  name="height"
                  placeholder="Enter Height"
                  value={formValues.height}
                  onChange={(e: any) => handleChange('height', e.target.value)}
                />
              </div>

              {/* Row 4 */}
              <div>
                <label className={labelClass}>Weight</label>
                <Input
                  name="weight"
                  placeholder="Enter Weight"
                  value={formValues.weight}
                  onChange={(e: any) => handleChange('weight', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Marital Status</label>
                <Select
                  className={selectClass}
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
                  className={selectClass}
                  value={formValues.anniversaryDate}
                  onChange={(dateStr: string) => handleChange('anniversaryDate', dateStr)}
                  placeholder="Select Anniversary Date"
                />
              </div>

              <div>
                <label className={labelClass}>Education</label>
                <Select
                  className={selectClass}
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

              {/* Row 5 */}
              <div>
                <label className={labelClass}>Adhar Card Number</label>
                <Input
                  name="adharCardNo"
                  placeholder="Enter Adhar Card Number"
                  value={formValues.adharCardNo}
                  onChange={(e: any) => handleChange('adharCardNo', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Pancard Number</label>
                <Input
                  name="pancardNo"
                  placeholder="Enter Pancard Number"
                  value={formValues.pancardNo}
                  onChange={(e: any) => handleChange('pancardNo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Address Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>
                  Pincode <span className="text-red-500">*</span>
                  {isPincodeLoading && (
                    <span className="ml-2 text-xs text-[#2B4399] font-normal animate-pulse">
                      Loading details...
                    </span>
                  )}
                </label>
                <Input
                  name="pincode"
                  placeholder="Enter 6-digit Pincode"
                  value={formValues.pincode}
                  maxLength={6}
                  onChange={(e: any) => handleChange('pincode', e.target.value)}
                  error={errors.pincode}
                />
              </div>

              <div>
                <label className={labelClass}>Nationality</label>
                <Input
                  name="nationality"
                  placeholder="Nationality"
                  value={formValues.nationality}
                  onChange={(e: any) => handleChange('nationality', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>State</label>
                <Input
                  name="state"
                  placeholder="State"
                  value={formValues.state}
                  onChange={(e: any) => handleChange('state', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <Input
                  name="city"
                  placeholder="City"
                  value={formValues.city}
                  onChange={(e: any) => handleChange('city', e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <label className={labelClass}>Home Address</label>
                <Input
                  name="address"
                  placeholder="Enter Home Address"
                  value={formValues.address}
                  onChange={(e: any) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Document Information (2-Column Grid Layout matching Life Insurance) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>Document Information</span>
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
                const selectedDocumentIds = documents.map(d => String(d.documentId)).filter(id => id !== '' && id !== 'undefined');

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
                        value={doc.documentId}
                        onChange={(e: any) => handleDocumentChange(doc.id, e.target.value)}
                      >
                        <option value="">Select Document Name</option>
                        {dropdownData?.document_name?.map((item) => {
                          const dId = String(item.id);
                          const dName = item.name;
                          const isSelectedByOther = selectedDocumentIds.includes(dId) && String(doc.documentId) !== dId;

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
                          file={doc.file}
                          existingUrl={doc.existing_image_url}
                          onChange={(file) => handleDocumentFileChange(doc.id, file)}
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
