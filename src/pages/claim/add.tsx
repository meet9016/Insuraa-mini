import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PageHeader from '@/components/ui/PageHeader';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import { User, Info, Calendar, Building2, FileText } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { useClaimMasterData, useInsuranceTypeList, useClaimCustomerPolicyDropdown, useClaimActions, formatToYYYYMMDD } from '@/hooks/useClaimApi';

export default function AddClaim() {
  const router = useRouter();
  const editId = router.query.id ? String(router.query.id) : '';
  const isEditMode = Boolean(editId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { insertClaim, isInserting } = useClaimActions();

  // Fetch API master data & dropdowns
  const { data: masterData } = useClaimMasterData();
  const { data: insuranceTypeListData } = useInsuranceTypeList();
  const { data: customerRes } = useCustomerList({ page: 1, limit: 1000 });

  const customerList = customerRes?.customerList || [];
  const insuranceTypes = (insuranceTypeListData && insuranceTypeListData.length > 0) ? insuranceTypeListData : (masterData?.insurance_type || []);
  const claimStatuses = masterData?.claim_status || [];
  const hospitalRatings = masterData?.hospital_rating || [];

  const [formData, setFormData] = useState({
    customer_id: '',
    insurance_type: '',
    customer_insurance_id: '',
    admited_date: '',
    discharge_date: '',
    calim_amount: '',
    deducted_amount: '',
    setteled_amount: '',
    claim_number: '',
    file_at_office: '',
    file_at_company: '',
    next_followup_date: '',
    query: '',
    claim_satteled_date: '',
    diagnosis: '',
    claim_status: '',
    name_of_doctor: '',
    name_of_hospital: '',
    location_of_hospital: '',
    hospital_type: '',
    rating_of_hospital: '',
    note: '',
  });

  // Prefill claim details if editing
  useEffect(() => {
    if (!router.isReady || !editId) return;

    const fetchClaimDetail = async () => {
      try {
        const formDataPayload = new FormData();
        formDataPayload.append('page', '1');
        formDataPayload.append('limit', '100');
        formDataPayload.append('search', editId);

        const response = await api.post(endPointApi.CLAIM.CLAIM_LIST, formDataPayload);
        const resData = response?.data;
        const list = Array.isArray(resData?.data) ? resData.data : [];
        const item = list.find((c: any) => String(c.claim_id || c.id) === editId) || list[0];

        if (item) {
          setFormData({
            customer_id: String(item.customer_id || '').trim(),
            insurance_type: String(item.insurance_type || '').trim(),
            customer_insurance_id: String(item.customer_insurance_id || '').trim(),
            admited_date: formatToYYYYMMDD(item.admitted_date || item.admited_date || ''),
            discharge_date: formatToYYYYMMDD(item.discharge_date || ''),
            calim_amount: String(item.claim_amount ?? item.calim_amount ?? ''),
            deducted_amount: String(item.deducted_amount ?? ''),
            setteled_amount: String(item.settled_amount ?? item.setteled_amount ?? ''),
            claim_number: item.claim_number || '',
            file_at_office: formatToYYYYMMDD(item.file_at_office || ''),
            file_at_company: formatToYYYYMMDD(item.file_at_company || ''),
            next_followup_date: formatToYYYYMMDD(item.next_followup_date || ''),
            query: formatToYYYYMMDD(item.query_date || item.query || ''),
            claim_satteled_date: formatToYYYYMMDD(item.claim_settled_date || item.claim_satteled_date || ''),
            diagnosis: item.diagnosis || '',
            claim_status: String(item.claim_status || '').trim(),
            name_of_doctor: item.doctor_name || item.name_of_doctor || '',
            name_of_hospital: item.hospital_name || item.name_of_hospital || '',
            location_of_hospital: item.hospital_location || item.location_of_hospital || '',
            hospital_type: item.hospital_type || '',
            rating_of_hospital: String(item.rating_of_hospital || '').trim(),
            note: item.note || '',
          });
        }
      } catch (err) {
        console.error('Error fetching claim detail for edit:', err);
      }
    };

    fetchClaimDetail();
  }, [router.isReady, editId]);

  // Fetch Customer Policy Dropdown when customer_id and insurance_type are selected
  const { data: customerPolicyList = [] } = useClaimCustomerPolicyDropdown({
    customer_id: formData.customer_id,
    insurance_type_id: formData.insurance_type,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = isEditMode ? { ...formData, id: editId, claim_id: editId } : formData;
      const res = await insertClaim(payload);
      if (res?.status === 200 || res?.status === 201 || res?.status === '200' || res?.status === 'success') {
        router.back();
      }
    } catch (err) {
      console.error("Save claim error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-0">
      <Head>
        <title>{isEditMode ? 'Edit Claim - Insuraa' : 'Add Claim - Insuraa'}</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/70 space-y-6">
        {/* Page Header */}
        <PageHeader
          title={isEditMode ? 'Edit Claim' : 'Add Claim'}
          submitText={isEditMode ? 'Update Claim' : 'Save Claim'}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isInserting}
        />

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Information */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <User size={18} />
                <span>Customer Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-bold text-gray-700">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#2B4399] font-bold hover:underline"
                    onClick={() => router.push('/customer/add')}
                  >
                    + Add Customer
                  </button>
                </div>
                <Select
                  value={formData.customer_id}
                  onChange={(e: any) => handleChange('customer_id', e.target.value)}
                >
                  <option value="">Select Customer Name</option>
                  {customerList.map((cust: any) => {
                    const custId = cust.customer_id || cust.id;
                    const custName = cust.full_name || cust.name || (cust.first_name ? `${cust.first_name} ${cust.last_name || ''}`.trim() : `Customer #${custId}`);
                    const phone = cust.number || cust.mobile || cust.phone || '';
                    return (
                      <option key={custId} value={custId}>
                        {custName} {phone ? `(${phone})` : ''}
                      </option>
                    );
                  })}
                </Select>
              </div>

              <div>
                <label className={labelClass}>
                  Insurance Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.insurance_type}
                  onChange={(e: any) => handleChange('insurance_type', e.target.value)}
                >
                  <option value="">Select Insurance Type</option>
                  {insuranceTypes.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name || item.value}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={labelClass}>
                  Customer Policy <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.customer_insurance_id}
                  onChange={(e: any) => handleChange('customer_insurance_id', e.target.value)}
                >
                  <option value="">Select Customer Policy</option>
                  {customerPolicyList.map((item: any) => {
                    const id = item.customer_insurance_id || item.id || item.policy_id;
                    const label =
                      item.policy_number ||
                      item.policy_no ||
                      item.value ||
                      item.name ||
                      item.title ||
                      item.plan_name ||
                      (item.company_name ? `${item.policy_number || 'Policy'} - ${item.company_name}` : `Policy #${id}`);
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Claim Details */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <Info size={18} />
                <span>Claim Details</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div>
                <label className={labelClass}>
                  Admitted Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={formData.admited_date}
                  onChange={(dateStr: string) => handleChange('admited_date', dateStr)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Discharge Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={formData.discharge_date}
                  onChange={(dateStr: string) => handleChange('discharge_date', dateStr)}
                />
              </div>

              <Input
                label="Claim Amount"
                name="calim_amount"
                placeholder="Enter Claim Amount"
                value={formData.calim_amount}
                onChange={(e) => handleChange('calim_amount', e.target.value)}
                required
              />

              <Input
                label="Deducted Amount"
                name="deducted_amount"
                placeholder="Enter Deducted Amount"
                value={formData.deducted_amount}
                onChange={(e) => handleChange('deducted_amount', e.target.value)}
              />

              <Input
                label="Settled Amount"
                name="setteled_amount"
                placeholder="Enter Settled Amount"
                value={formData.setteled_amount}
                onChange={(e) => handleChange('setteled_amount', e.target.value)}
              />

              <Input
                label="Claim Number"
                name="claim_number"
                placeholder="Enter Claim Number (e.g. CLM0000012)"
                value={formData.claim_number}
                onChange={(e) => handleChange('claim_number', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Section 3: Important Dates & Status */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <Calendar size={18} />
                <span>Important Dates & Status</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div>
                <label className={labelClass}>File At Office Date</label>
                <DatePicker
                  value={formData.file_at_office}
                  onChange={(dateStr: string) => handleChange('file_at_office', dateStr)}
                />
              </div>

              <div>
                <label className={labelClass}>File At Company Date</label>
                <DatePicker
                  value={formData.file_at_company}
                  onChange={(dateStr: string) => handleChange('file_at_company', dateStr)}
                />
              </div>

              <div>
                <label className={labelClass}>Next Followup Date</label>
                <DatePicker
                  value={formData.next_followup_date}
                  onChange={(dateStr: string) => handleChange('next_followup_date', dateStr)}
                />
              </div>

              <div>
                <label className={labelClass}>Query Date</label>
                <DatePicker
                  value={formData.query}
                  onChange={(dateStr: string) => handleChange('query', dateStr)}
                />
              </div>

              <div>
                <label className={labelClass}>Claim Settled Date</label>
                <DatePicker
                  value={formData.claim_satteled_date}
                  onChange={(dateStr: string) => handleChange('claim_satteled_date', dateStr)}
                />
              </div>

              <Input
                label="Diagnosis"
                name="diagnosis"
                placeholder="Enter Diagnosis (e.g. Fever)"
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
              />

              <div>
                <label className={labelClass}>
                  Claim Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.claim_status}
                  onChange={(e: any) => handleChange('claim_status', e.target.value)}
                >
                  <option value="">Select Claim Status</option>
                  {claimStatuses.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.value || item.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Section 4: Doctor & Hospital Information */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <Building2 size={18} />
                <span>Doctor & Hospital Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <Input
                label="Name Of Doctor"
                name="name_of_doctor"
                placeholder="Enter Doctor Name (e.g. Dr. ABC)"
                value={formData.name_of_doctor}
                onChange={(e) => handleChange('name_of_doctor', e.target.value)}
              />

              <Input
                label="Name Of Hospital"
                name="name_of_hospital"
                placeholder="Enter Hospital Name (e.g. Apollo Hospital)"
                value={formData.name_of_hospital}
                onChange={(e) => handleChange('name_of_hospital', e.target.value)}
              />

              <Input
                label="Location Of Hospital"
                name="location_of_hospital"
                placeholder="Enter Hospital Location (e.g. Ahmedabad)"
                value={formData.location_of_hospital}
                onChange={(e) => handleChange('location_of_hospital', e.target.value)}
              />

              <Input
                label="Hospital Type"
                name="hospital_type"
                placeholder="Enter Hospital Type"
                value={formData.hospital_type}
                onChange={(e) => handleChange('hospital_type', e.target.value)}
              />

              <div>
                <label className={labelClass}>Rating Of Hospital</label>
                <Select
                  value={formData.rating_of_hospital}
                  onChange={(e: any) => handleChange('rating_of_hospital', e.target.value)}
                >
                  <option value="">Select Rating</option>
                  {hospitalRatings.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.value || item.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Section 5: Note Details */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <FileText size={18} />
                <span>Note Details</span>
              </div>
            </div>

            <div>
              <Input
                label="Note"
                name="note"
                as="textarea"
                placeholder="Enter any additional notes..."
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

