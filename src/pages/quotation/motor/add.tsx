import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus, Minus, Trash2, User, Car, Building2, FileText, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  useMotorQuotationMasterData,
  useMotorQuotationProducts,
  useMotorQuotationActions,
  useMotorQuotationDetail,
  MotorQuotationProductItem,
} from '@/hooks/useMotorQuotationApi';
import { usePincodeDetails } from '@/hooks/useCustomerApi';

import { validateMotorQuotation } from '@/utils/validation';

function ProductSelect({
  companyId,
  value,
  onChange,
  error,
}: {
  companyId?: string | number;
  value: string;
  onChange: (val: string, prodObj?: MotorQuotationProductItem) => void;
  error?: string;
}) {
  const { data: productList = [], isLoading } = useMotorQuotationProducts(companyId);

  return (
    <div>
      <Select
        value={value}
        onChange={(e: any) => {
          const val = e.target.value;
          const found = productList.find(
            (p) => String(p.product_id) === String(val) || p.name === val
          );
          onChange(val, found);
        }}
        disabled={!companyId}
        className={error ? '!border-red-500 ring-2 ring-red-500/20' : ''}
      >
        <option value="">
          {!companyId
            ? 'Select Company First'
            : isLoading
              ? 'Loading...'
              : 'Select Product'}
        </option>
        {productList.map((prod) => (
          <option key={prod.product_id} value={prod.product_id}>
            {prod.name}
          </option>
        ))}
      </Select>
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-1 px-0.5">{error}</p>
      )}
    </div>
  );
}

export default function AddMotorQuotation() {
  const router = useRouter();
  const quotationId = router.query.id ? String(router.query.id) : null;
  const { data: masterData, isLoading: isMasterLoading } = useMotorQuotationMasterData();
  const { insertMotorQuotation } = useMotorQuotationActions();
  const { data: quotationDetail, isLoading: isDetailLoading } = useMotorQuotationDetail(quotationId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quoteErrors, setQuoteErrors] = useState<Record<string | number, Record<string, string>>>({});

  const companyList = masterData?.companies || [];
  const vehicleTypeList = masterData?.vehicle_type || [];
  const makeList = masterData?.make || [];

  // Form State for Motor Quotation (All fields matching Postman body)
  const [formData, setFormData] = useState({
    insured_name: '',
    mobile: '',
    email: '',
    house_no: '',
    street: '',
    area: '',
    city: '',
    pincode: '',
    state: '',
    vehicle_type_id: '',
    vehicle_type: '',
    make_id: '',
    make: '',
    model_id: '',
    model: '',
    registration_no: '',
    mfg_year: '',
    cc_gvw: '',
    zone: '',
    seat_capacity: '',
    total_idv: '',
    ncb_percent: '',
    remarks: '',
  });

  const { data: pincodeData, isLoading: isPincodeLoading } = usePincodeDetails(formData?.pincode || '');

  React.useEffect(() => {
    if (pincodeData && !isPincodeLoading) {
      setFormData((prev) => ({
        ...prev,
        state: pincodeData.state || prev.state,
        city: pincodeData.city || prev.city,
      }));
    }
  }, [pincodeData, isPincodeLoading]);

  // Dynamic Array for Quotes / Comparison Details
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      company_id: '',
      company_name: '',
      product_id: '',
      product_name: '',
      add_on: '',
      idv: '',
      premium: '',
      discount: '',
      remark: '',
      is_recommended: false,
    },
  ]);

  React.useEffect(() => {
    if (!quotationDetail) return;

    setFormData({
      insured_name: quotationDetail.insured_name || '',
      mobile: quotationDetail.mobile || '',
      email: quotationDetail.email || '',
      house_no: quotationDetail.house_no || '',
      street: quotationDetail.street || '',
      area: quotationDetail.area || '',
      city: quotationDetail.city || '',
      pincode: quotationDetail.pincode || '',
      state: quotationDetail.state || '',
      vehicle_type_id: quotationDetail.vehicle_type_id ? String(quotationDetail.vehicle_type_id) : '',
      vehicle_type: quotationDetail.vehicle_type || '',
      make_id: quotationDetail.make_id ? String(quotationDetail.make_id) : '',
      make: quotationDetail.make || '',
      model_id: quotationDetail.model_id ? String(quotationDetail.model_id) : '',
      model: quotationDetail.model || '',
      registration_no: quotationDetail.registration_no || '',
      mfg_year: quotationDetail.mfg_year || '',
      cc_gvw: quotationDetail.cc_gvw || '',
      zone: quotationDetail.zone || '',
      seat_capacity: quotationDetail.seat_capacity ? String(quotationDetail.seat_capacity) : '',
      total_idv: quotationDetail.total_idv ? String(quotationDetail.total_idv) : '',
      ncb_percent: quotationDetail.ncb_percent ? String(quotationDetail.ncb_percent) : '',
      remarks: quotationDetail.remarks || '',
    });

    if (Array.isArray(quotationDetail.items) && quotationDetail.items.length > 0) {
      setQuotes(
        quotationDetail.items.map((item: any, idx: number) => ({
          id: item.item_id || Date.now() + idx,
          company_id: item.company_name ? String(item.company_name) : '',
          company_name: item.company_name_value || '',
          product_id: item.product_name ? String(item.product_name) : '',
          product_name: item.product_name_value || (item.product_name ? String(item.product_name) : ''),
          add_on: item.add_on || '',
          idv: item.idv ? String(item.idv) : '',
          premium: item.premium ? String(item.premium) : '',
          discount: item.discount ? String(item.discount) : '',
          remark: item.remark || '',
          is_recommended: Boolean(item.is_recommended == 1 || item.is_recommended === true),
        }))
      );
    }
  }, [quotationDetail]);

  const validate = (data = formData, qList = quotes) => {
    const { isValid, errors: newErrors, quoteErrors: newQuoteErrors } =
      validateMotorQuotation(data, qList);

    setErrors(newErrors);
    setQuoteErrors(newQuoteErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'mobile') {
      sanitizedValue = String(value).replace(/\D/g, '').slice(0, 10);
    } else if (field === 'pincode') {
      sanitizedValue = String(value).replace(/\D/g, '').slice(0, 6);
    } else if (field === 'mfg_year') {
      sanitizedValue = String(value).replace(/\D/g, '').slice(0, 4);
    }
    const updatedForm = { ...formData, [field]: sanitizedValue };
    setFormData(updatedForm);

    if (errors[field]) {
      const { errors: newErrors } = validateMotorQuotation(updatedForm, quotes);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const handleBlur = (field: string) => {
    if (errors[field] || formData[field as keyof typeof formData]) {
      const { errors: newErrors } = validateMotorQuotation(formData, quotes);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] || '' }));
    }
  };

  const handleVehicleTypeChange = (val: string) => {
    const selected = vehicleTypeList.find(
      (vt: any) => String(vt.id) === String(val) || String(vt.value) === String(val)
    );
    const updatedForm = {
      ...formData,
      vehicle_type_id: selected ? String(selected.id) : val,
      vehicle_type: selected ? selected.value : val,
    };
    setFormData(updatedForm);

    if (errors.vehicle_type_id) {
      const { errors: newErrors } = validateMotorQuotation(updatedForm, quotes);
      setErrors((prev) => ({ ...prev, vehicle_type_id: newErrors.vehicle_type_id || '' }));
    }
  };

  const handleMakeChange = (val: string) => {
    const selected = makeList.find(
      (mk: any) => String(mk.id) === String(val) || String(mk.value) === String(val)
    );
    setFormData((prev) => ({
      ...prev,
      make_id: selected ? String(selected.id) : val,
      make: selected ? selected.value : val,
    }));
  };

  const handleQuoteChange = (index: number, field: string, value: any) => {
    setQuotes((prevQuotes) => {
      const updated = [...prevQuotes];
      if (field === 'is_recommended') {
        // Only one quote can be recommended
        return updated.map((q, i) => ({
          ...q,
          is_recommended: i === index ? Boolean(value) : false,
        }));
      }
      updated[index] = { ...updated[index], [field]: value };

      const keyId = updated[index].id || index;
      if (quoteErrors[keyId]?.[field]) {
        const { quoteErrors: newQuoteErrors } = validateMotorQuotation(formData, updated);
        setQuoteErrors((prevErrors) => ({
          ...prevErrors,
          [keyId]: { ...(prevErrors[keyId] || {}), [field]: newQuoteErrors[keyId]?.[field] || '' },
        }));
      }

      return updated;
    });
  };

  const handleCompanyChange = (index: number, companyId: string) => {
    const selectedComp = companyList.find((c: any) => String(c.company_id) === String(companyId));
    setQuotes((prevQuotes) => {
      const updated = [...prevQuotes];
      updated[index] = {
        ...updated[index],
        company_id: companyId,
        company_name: selectedComp ? selectedComp.name : companyId,
        product_id: '',
        product_name: '',
      };

      const keyId = updated[index].id || index;
      if (quoteErrors[keyId]?.company_id) {
        const { quoteErrors: newQuoteErrors } = validateMotorQuotation(formData, updated);
        setQuoteErrors((prevErrors) => ({
          ...prevErrors,
          [keyId]: { ...(prevErrors[keyId] || {}), company_id: newQuoteErrors[keyId]?.company_id || '' },
        }));
      }

      return updated;
    });
  };

  const handleProductChange = (index: number, val: string, prodObj?: MotorQuotationProductItem) => {
    setQuotes((prevQuotes) => {
      const updated = [...prevQuotes];
      updated[index] = {
        ...updated[index],
        product_id: val,
        product_name: prodObj ? prodObj.name : val,
      };

      const keyId = updated[index].id || index;
      if (quoteErrors[keyId]?.product_id) {
        const { quoteErrors: newQuoteErrors } = validateMotorQuotation(formData, updated);
        setQuoteErrors((prevErrors) => ({
          ...prevErrors,
          [keyId]: { ...(prevErrors[keyId] || {}), product_id: newQuoteErrors[keyId]?.product_id || '' },
        }));
      }

      return updated;
    });
  };

  const addQuote = () => {
    setQuotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        company_id: '',
        company_name: '',
        product_id: '',
        product_name: '',
        add_on: '',
        idv: '',
        premium: '',
        discount: '',
        remark: '',
        is_recommended: false,
      },
    ]);
  };

  const removeQuote = (index: number) => {
    if (quotes.length > 1) {
      setQuotes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const success = await insertMotorQuotation({
      quotation_id: quotationId,
      ...formData,
      quotes,
    });
    setIsSubmitting(false);

    if (success) {
      router.back();
    }
  };

  const labelClass = 'text-[13px] font-bold text-gray-700 mb-1.5 block';

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-0">
      <Head>
        <title>{quotationId ? 'Edit' : 'Add'} Motor Quotation - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/70 space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              type="button"
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {quotationId ? 'Edit Motor Quotation' : 'Add Motor Quotation'}
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isDetailLoading}
              className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Motor Information / Proposal Information */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            {/* Section Banner Header with Left Blue Curved Border Accent matching image exactly */}
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <User size={18} />
                <span>Motor Information</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <Input
                label="Insured Person Name"
                name="insured_name"
                placeholder="Insured Name"
                value={formData.insured_name}
                onChange={(e) => handleInputChange('insured_name', e.target.value)}
                onBlur={() => handleBlur('insured_name')}
                error={errors.insured_name}
                required
              />

              <Input
                label="Mobile No"
                name="mobile"
                placeholder="MobileNo"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                onBlur={() => handleBlur('mobile')}
                error={errors.mobile}
                maxLength={10}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={errors.email}
              />

              <Input
                label="House No"
                name="house_no"
                placeholder="House No"
                value={formData.house_no}
                onChange={(e) => handleInputChange('house_no', e.target.value)}
                onBlur={() => handleBlur('house_no')}
                error={errors.house_no}
              />

              <div>
                <Input
                  label={isPincodeLoading ? 'Pincode (Loading...)' : 'Pincode'}
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) {
                      handleInputChange('pincode', val);
                    }
                  }}
                  onBlur={() => handleBlur('pincode')}
                  error={errors.pincode}
                  maxLength={6}
                />
              </div>

              <Input
                label="Street"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />

              <Input
                label="Area"
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />

              <Input
                label="City"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />

              <Input
                label="State"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Vehicle Details */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            {/* Section Banner Header with Left Blue Curved Border Accent matching image exactly */}
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <Car size={18} />
                <span>Vehicle Details</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div>
                <label className={labelClass}>
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.vehicle_type_id || formData.vehicle_type}
                  onChange={(e: any) => handleVehicleTypeChange(e.target.value)}
                  className={errors.vehicle_type_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}
                >
                  <option value="">{isMasterLoading ? 'Loading...' : 'Select Vehicle Type'}</option>
                  {vehicleTypeList.map((vt: any) => (
                    <option key={vt.id} value={vt.id}>
                      {vt.value}
                    </option>
                  ))}
                </Select>
                {errors.vehicle_type_id && (
                  <p className="text-xs text-red-500 font-semibold mt-1 px-0.5">
                    {errors.vehicle_type_id}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Make</label>
                <Select
                  value={formData.make_id || formData.make}
                  onChange={(e: any) => handleMakeChange(e.target.value)}
                >
                  <option value="">{isMasterLoading ? 'Loading...' : 'Select Make'}</option>
                  {makeList.map((mk: any) => (
                    <option key={mk.id} value={mk.id}>
                      {mk.value}
                    </option>
                  ))}
                </Select>
              </div>

              <Input
                label="Model"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />

              <Input
                label="Registration No"
                name="registration_no"
                placeholder="e.g. GJ05AB1234"
                value={formData.registration_no}
                onChange={(e) => handleInputChange('registration_no', e.target.value)}
              />

              <Input
                label="Year Of Manufacture"
                name="mfg_year"
                placeholder="Year Of Manufacture"
                value={formData.mfg_year}
                onChange={(e) => handleInputChange('mfg_year', e.target.value)}
                onBlur={() => handleBlur('mfg_year')}
                error={errors.mfg_year}
                maxLength={4}
              />

              <Input
                label="CC / GVW"
                name="cc_gvw"
                placeholder="CC/Gross Vehicle Weight"
                value={formData.cc_gvw}
                onChange={(e) => handleInputChange('cc_gvw', e.target.value)}
              />

              <div>
                <label className={labelClass}>Zone</label>
                <Select
                  value={formData.zone}
                  onChange={(e: any) => handleInputChange('zone', e.target.value)}
                >
                  <option value="">Select Zone</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </Select>
              </div>

              <Input
                label="Seating Capacity"
                name="seat_capacity"
                placeholder="Seating Capacity"
                value={formData.seat_capacity}
                onChange={(e) => handleInputChange('seat_capacity', e.target.value)}
                onBlur={() => handleBlur('seat_capacity')}
                error={errors.seat_capacity}
              />

              <Input
                label="Total IDV"
                name="total_idv"
                placeholder="Total IDV"
                value={formData.total_idv}
                onChange={(e) => handleInputChange('total_idv', e.target.value)}
                onBlur={() => handleBlur('total_idv')}
                error={errors.total_idv}
              />

              <Input
                label="NCB %"
                name="ncb_percent"
                placeholder="NCB %"
                value={formData.ncb_percent}
                onChange={(e) => handleInputChange('ncb_percent', e.target.value)}
                onBlur={() => handleBlur('ncb_percent')}
                error={errors.ncb_percent}
              />
            </div>
          </div>

          {/* Section 3: Quotation Details / Comparison Details */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            {/* Section Banner Header with Left Blue Curved Border Accent matching image exactly */}
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <Building2 size={18} />
                <span>Quotation Details</span>
              </div>
              <button
                type="button"
                onClick={addQuote}
                className="w-[36px] h-[36px] bg-[#2B4399] hover:bg-[#203378] text-white rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                title="Add Quote"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {quotes.map((quote, idx) => (
                <div
                  key={quote.id || idx}
                  className="bg-[#F8FAFC] p-4 md:p-5 rounded-xl border border-gray-200/80 space-y-4 shadow-2xs hover:border-gray-300 transition-all"
                >
                  {/* Row 1 of fields: Company, Product, Addon, IDV */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <div>
                      <label className={labelClass}>
                        Company <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={quote.company_id || ''}
                        onChange={(e: any) => handleCompanyChange(idx, e.target.value)}
                        className={quoteErrors[quote.id || idx]?.company_id ? '!border-red-500 ring-2 ring-red-500/20' : ''}
                      >
                        <option value="">{isMasterLoading ? 'Loading...' : 'Select Company'}</option>
                        {companyList.map((comp: any) => (
                          <option key={comp.company_id} value={comp.company_id}>
                            {comp.name}
                          </option>
                        ))}
                      </Select>
                      {quoteErrors[quote.id || idx]?.company_id && (
                        <p className="text-xs text-red-500 font-semibold mt-1 px-0.5">
                          {quoteErrors[quote.id || idx].company_id}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Product <span className="text-red-500">*</span>
                      </label>
                      <ProductSelect
                        companyId={quote.company_id}
                        value={quote.product_id || quote.product_name}
                        onChange={(val, prodObj) => handleProductChange(idx, val, prodObj)}
                        error={quoteErrors[quote.id || idx]?.product_id}
                      />
                    </div>

                    <div>
                      <Input
                        label="Addon"
                        name={`add_on_${idx}`}
                        placeholder="Addon details"
                        value={quote.add_on}
                        onChange={(e) => handleQuoteChange(idx, 'add_on', e.target.value)}
                      />
                    </div>

                    <div>
                      <Input
                        label="IDV"
                        name={`idv_${idx}`}
                        placeholder="IDV"
                        value={quote.idv}
                        onChange={(e) => handleQuoteChange(idx, 'idv', e.target.value)}
                        error={quoteErrors[quote.id || idx]?.idv}
                      />
                    </div>
                  </div>

                  {/* Row 2 of fields: Premium, Discount, Remark, Recommended + Delete */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <div>
                      <Input
                        label={
                          <span>
                            Premium <span className="text-red-500">*</span>
                          </span>
                        }
                        name={`premium_${idx}`}
                        placeholder="0"
                        value={quote.premium}
                        onChange={(e) => handleQuoteChange(idx, 'premium', e.target.value)}
                        error={quoteErrors[quote.id || idx]?.premium}
                      />
                    </div>

                    <div>
                      <Input
                        label="Discount"
                        name={`discount_${idx}`}
                        placeholder="Discount"
                        value={quote.discount}
                        onChange={(e) => handleQuoteChange(idx, 'discount', e.target.value)}
                        error={quoteErrors[quote.id || idx]?.discount}
                      />
                    </div>

                    <div>
                      <Input
                        label="Remark"
                        name={`remark_${idx}`}
                        placeholder="Remark"
                        value={quote.remark}
                        onChange={(e) => handleQuoteChange(idx, 'remark', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-0">
                      <div className="flex flex-col items-center justify-start">
                        <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">
                          Recommended
                        </label>
                        <div className="h-[42px] flex items-center justify-center">
                          <input
                            type="radio"
                            name="recommended_quote"
                            checked={quote.is_recommended}
                            onChange={(e) =>
                              handleQuoteChange(idx, 'is_recommended', e.target.checked)
                            }
                            className="w-4 h-4 text-[#2B4399] focus:ring-[#2B4399] cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-start">
                        <span className="text-[11px] font-bold block opacity-0 pointer-events-none mb-1.5 hidden md:block">
                          Delete
                        </span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => removeQuote(idx)}
                            className="w-[36px] h-[36px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl shadow-2xs flex items-center justify-center transition-colors shrink-0"
                            title="Delete Quote"
                          >
                            <Minus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Other Details */}
          <div className="border border-gray-200/70 rounded-2xl p-6 bg-white shadow-2xs space-y-5">
            {/* Section Banner Header with Left Blue Curved Border Accent matching image exactly */}
            <div className="bg-[#EEF1FA] border-l-[4px] border-[#2B4399] rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5 text-[#2B4399] font-bold text-[15px]">
                <FileText size={18} />
                <span>Other Details</span>
              </div>
            </div>

            <div>
              <Input
                label="Remarks"
                name="remarks"
                as="textarea"
                placeholder="Enter any additional remarks..."
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
