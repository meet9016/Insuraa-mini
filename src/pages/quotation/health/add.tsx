import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, ArrowLeft, User, FileText, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import {
  useHealthQuotationMasterData,
  useHealthQuotationActions,
  useHealthQuotationProducts,
  useHealthQuotationDetail,
} from '@/hooks/useHealthQuotationApi';
import { usePincodeDetails } from '@/hooks/useCustomerApi';

function ProductSelect({ companyId, value, onChange, selectClass, labelClass }: any) {
  const { data: productList, isLoading } = useHealthQuotationProducts(companyId);

  return (
    <div>
      <label className={labelClass}>
        Product <span className="text-red-500">*</span>
      </label>
      <Select
        className={selectClass}
        value={value}
        onChange={onChange}
        disabled={!companyId}
      >
        <option value="">
          {!companyId
            ? "Select Company First"
            : isLoading
              ? "Loading products..."
              : "Select Product"}
        </option>
        {(productList || []).map((prod: any) => (
          <option key={prod.product_id} value={prod.name}>
            {prod.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default function AddHealthQuotation() {
  const router = useRouter();
  const quotationId = router.query.id ? String(router.query.id) : null;
  const { data: masterData } = useHealthQuotationMasterData();
  const { insertHealthQuotation } = useHealthQuotationActions();
  const { data: quotationDetail, isLoading: isDetailLoading } = useHealthQuotationDetail(quotationId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const companiesList = masterData?.companies || [];
  const proposalTypeList = masterData?.proposal_type || [];
  const planOptedList = masterData?.plan_opted || [];
  const familySizeList = masterData?.family_size || [];
  const policyTenureList = masterData?.policy_tenure || [];

  const [formData, setFormData] = useState({
    proposal_type: '',
    insured_name: '',
    mobile: '',
    email: '',
    plan_opted: '',
    family_size: '',
    policy_tenure: '',
    house_no: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });

  const { data: pincodeData, isLoading: isPincodeLoading } = usePincodeDetails(formData.pincode);

  React.useEffect(() => {
    if (pincodeData) {
      setFormData((prev) => ({
        ...prev,
        state: pincodeData.state || prev.state || '',
        city: pincodeData.city || prev.city || '',
      }));
    }
  }, [pincodeData]);

  const [quotes, setQuotes] = useState([
    {
      id: 1,
      company_name: '',
      product_name: '',
      zone: '',
      sa: '',
      recommended: false,
      addon: '',
      premium_1y: '',
      premium_2y: '',
      premium_3y: '',
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      member_name: '',
      relation: '',
      dob: '',
      age: '',
      gender: '',
      medical_history: '',
    },
  ]);

  React.useEffect(() => {
    if (!quotationDetail) return;

    setFormData({
      proposal_type: quotationDetail.proposal_type !== undefined && quotationDetail.proposal_type !== null ? String(quotationDetail.proposal_type) : '',
      insured_name: quotationDetail.insured_name || '',
      mobile: quotationDetail.mobile || '',
      email: quotationDetail.email || '',
      plan_opted: quotationDetail.plan_opted !== undefined && quotationDetail.plan_opted !== null ? String(quotationDetail.plan_opted) : '',
      family_size: quotationDetail.family_size !== undefined && quotationDetail.family_size !== null ? String(quotationDetail.family_size) : '',
      policy_tenure: quotationDetail.policy_tenure !== undefined && quotationDetail.policy_tenure !== null ? String(quotationDetail.policy_tenure) : '',
      house_no: quotationDetail.house_no || '',
      street: quotationDetail.street || '',
      area: quotationDetail.area || '',
      city: quotationDetail.city || '',
      state: quotationDetail.state || '',
      pincode: quotationDetail.pincode || '',
    });

    if (Array.isArray(quotationDetail.items) && quotationDetail.items.length > 0) {
      setQuotes(
        quotationDetail.items.map((item: any, idx: number) => ({
          id: item.item_id || idx + 1,
          company_name: item.company_name !== undefined && item.company_name !== null ? String(item.company_name) : '',
          product_name: item.product_name_value || (item.product_name && item.product_name !== 0 ? String(item.product_name) : ''),
          zone: item.zone || '',
          sa: item.sa || '',
          recommended: item.is_recommended === 1 || item.is_recommended === '1' || item.is_recommended === true,
          addon: item.addon || '',
          premium_1y: item.premium_1y !== undefined && item.premium_1y !== null ? String(item.premium_1y) : '',
          premium_2y: item.premium_2y !== undefined && item.premium_2y !== null ? String(item.premium_2y) : '',
          premium_3y: item.premium_3y !== undefined && item.premium_3y !== null ? String(item.premium_3y) : '',
        }))
      );
    }

    if (Array.isArray(quotationDetail.members) && quotationDetail.members.length > 0) {
      setMembers(
        quotationDetail.members.map((member: any, idx: number) => ({
          id: member.member_id || idx + 1,
          member_name: member.member_name || '',
          relation: member.relation || '',
          dob: member.dob || '',
          age: member.age !== undefined && member.age !== null ? String(member.age) : '',
          gender: member.gender || '',
          medical_history: member.medical_history || '',
        }))
      );
    }
  }, [quotationDetail]);

  const handleChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'pincode') {
      sanitizedValue = String(value).replace(/\D/g, '').slice(0, 6);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleQuoteChange = (id: number, field: string, value: any) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (field === 'company_name') {
            return { ...q, company_name: value, product_name: '' };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const handleMemberChange = (id: number, field: string, value: any) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addQuote = () =>
    setQuotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        company_name: '',
        product_name: '',
        zone: '',
        sa: '',
        recommended: false,
        addon: '',
        premium_1y: '',
        premium_2y: '',
        premium_3y: '',
      },
    ]);

  const removeQuote = (id: number) => {
    if (quotes.length > 1) setQuotes(quotes.filter((q) => q.id !== id));
  };

  const addMember = () =>
    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        member_name: '',
        relation: '',
        dob: '',
        age: '',
        gender: '',
        medical_history: '',
      },
    ]);

  const removeMember = (id: number) => {
    if (members.length > 1) setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      quotation_id: router.query.id ? String(router.query.id) : null,
      proposal_type: formData.proposal_type,
      insured_name: formData.insured_name,
      mobile: formData.mobile,
      email: formData.email,
      plan_opted: formData.plan_opted,
      family_size: formData.family_size,
      policy_tenure: formData.policy_tenure,
      house_no: formData.house_no,
      street: formData.street,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      quotes: quotes,
      members: members,
    };

    const success = await insertHealthQuotation(payload);
    setIsSubmitting(false);

    if (success) {
      router.push('/quotation/health');
    }
  };

  const sectionHeaderClass =
    "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-xl flex items-center justify-between gap-2 mb-6 border-l-4 border-[#2B4399]";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const selectClass =
    "w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs";
  const smallInputClass =
    "w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs placeholder:text-gray-400";

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-0">
      <Head>
        <title>{quotationId ? 'Edit' : 'Add'} Health Quotation - Insuraa</title>
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

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">
        {/* Page Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-5 mb-8 pt-4 -mt-6 -mx-6 px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button
              onClick={() => router.back()}
              type="button"
              className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {quotationId ? 'Edit Health Quotation' : 'Add Health Quotation'}
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
        </div>

        <form className="space-y-8 bg-white" onSubmit={handleSubmit}>
          {/* Proposal Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Proposal Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Proposal Type</label>
                <Select
                  className={selectClass}
                  value={formData.proposal_type}
                  onChange={(e: any) => handleChange('proposal_type', e.target.value)}
                >
                  <option value="">Select Proposal Type</option>
                  {proposalTypeList.map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.value}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  label="Insured Name"
                  required
                  name="insured_name"
                  placeholder="Insured Name"
                  value={formData.insured_name}
                  onChange={(e: any) => handleChange('insured_name', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="MobileNo"
                  name="mobile"
                  placeholder="MobileNo"
                  value={formData.mobile}
                  onChange={(e: any) => handleChange('mobile', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e: any) => handleChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Plan Opted</label>
                <Select
                  className={selectClass}
                  value={formData.plan_opted}
                  onChange={(e: any) => handleChange('plan_opted', e.target.value)}
                >
                  <option value="">Select Plan Opted</option>
                  {planOptedList.map((po: any) => (
                    <option key={po.id} value={po.id}>
                      {po.value}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className={labelClass}>Family Size</label>
                <Select
                  className={selectClass}
                  value={formData.family_size}
                  onChange={(e: any) => handleChange('family_size', e.target.value)}
                >
                  <option value="">Select Family Size</option>
                  {familySizeList.map((fs: any) => (
                    <option key={fs.id} value={fs.id}>
                      {fs.value}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className={labelClass}>Policy Tenure</label>
                <Select
                  className={selectClass}
                  value={formData.policy_tenure}
                  onChange={(e: any) => handleChange('policy_tenure', e.target.value)}
                >
                  <option value="">Select Policy Tenure</option>
                  {policyTenureList.map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.value}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  label="House No"
                  name="house_no"
                  placeholder="House No"
                  value={formData.house_no}
                  onChange={(e: any) => handleChange('house_no', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Pincode
                  {isPincodeLoading && (
                    <span className="ml-2 text-xs text-[#2B4399] font-normal animate-pulse">
                      Loading...
                    </span>
                  )}
                </label>
                <Input
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  maxLength={6}
                  onChange={(e: any) => handleChange('pincode', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Street"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={(e: any) => handleChange('street', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Area"
                  name="area"
                  placeholder="Area"
                  value={formData.area}
                  onChange={(e: any) => handleChange('area', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="City"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e: any) => handleChange('city', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="State"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e: any) => handleChange('state', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Quotation Details */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span>Quotation Details</span>
              </div>
              <button
                type="button"
                onClick={addQuote}
                className="bg-[#2B4399] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#203378] transition-colors shadow-2xs"
              >
                <Plus size={15} strokeWidth={2.5} /> Add Quote
              </button>
            </div>

            <div className="space-y-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-gray-50/70 p-5 rounded-xl border border-gray-200/80 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                      <label className={labelClass}>
                        Company <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className={selectClass}
                        value={quote.company_name}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'company_name', e.target.value)
                        }
                      >
                        <option value="">Select Company</option>
                        {companiesList.map((comp: any) => (
                          <option key={comp.company_id} value={comp.company_id}>
                            {comp.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="md:col-span-3">
                      <ProductSelect
                        companyId={quote.company_name}
                        value={quote.product_name}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'product_name', e.target.value)
                        }
                        selectClass={selectClass}
                        labelClass={labelClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Zone"
                        name="zone"
                        placeholder="A"
                        value={quote.zone}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'zone', e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="SA"
                        name="sa"
                        placeholder="Sum assured"
                        value={quote.sa}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'sa', e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-1 flex flex-col items-center">
                      <label className="text-[12px] font-bold text-gray-700 mb-2">
                        Recommended
                      </label>
                      <input
                        type="radio"
                        name="recommendedQuote"
                        checked={quote.recommended}
                        onChange={() =>
                          setQuotes((prev) =>
                            prev.map((q) => ({
                              ...q,
                              recommended: q.id === quote.id,
                            }))
                          )
                        }
                        className="w-4 h-4 text-[#2B4399] focus:ring-[#2D3591]"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeQuote(quote.id)}
                        className="bg-[#da3f49] text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#c9303a] transition-colors w-full flex items-center justify-center gap-1"
                        title="Delete Quote"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        label="Addon"
                        name="addon"
                        placeholder="Addon details"
                        value={quote.addon}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'addon', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Premium 1Y"
                        required
                        name="premium_1y"
                        placeholder="0"
                        value={quote.premium_1y}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'premium_1y', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Premium 2Y"
                        name="premium_2y"
                        placeholder="0"
                        value={quote.premium_2y}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'premium_2y', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Premium 3Y"
                        name="premium_3y"
                        placeholder="0"
                        value={quote.premium_3y}
                        onChange={(e: any) =>
                          handleQuoteChange(quote.id, 'premium_3y', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Details */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Member Details</span>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="bg-[#2B4399] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#203378] transition-colors shadow-2xs"
              >
                <Plus size={15} strokeWidth={2.5} /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50/70 p-5 rounded-xl border border-gray-200/80"
                >
                  <div className="md:col-span-3">
                    <Input
                      label="Name"
                      required
                      name="member_name"
                      placeholder="Member name"
                      value={member.member_name}
                      onChange={(e: any) =>
                        handleMemberChange(member.id, 'member_name', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Relation"
                      required
                      name="relation"
                      placeholder="Self"
                      value={member.relation}
                      onChange={(e: any) =>
                        handleMemberChange(member.id, 'relation', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      DOB <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      value={member.dob}
                      onChange={(dateStr: string) => handleMemberChange(member.id, 'dob', dateStr)}
                      className={smallInputClass}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      label="Age"
                      name="age"
                      placeholder="0"
                      value={member.age}
                      onChange={(e: any) =>
                        handleMemberChange(member.id, 'age', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Gender"
                      required
                      name="gender"
                      placeholder="Male"
                      value={member.gender}
                      onChange={(e: any) =>
                        handleMemberChange(member.id, 'gender', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      label="Medical History"
                      name="medical_history"
                      placeholder="No"
                      value={member.medical_history}
                      onChange={(e: any) =>
                        handleMemberChange(member.id, 'medical_history', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="bg-[#da3f49] text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#c9303a] transition-colors w-full flex items-center justify-center gap-1"
                      title="Delete Member"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
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
