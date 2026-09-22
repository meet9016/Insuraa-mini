import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus, Trash2, User, Car, Building2, FileText, ArrowLeft } from 'lucide-react';
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

function ProductSelect({
  companyId,
  value,
  onChange,
}: {
  companyId?: string | number;
  value: string;
  onChange: (val: string, prodObj?: MotorQuotationProductItem) => void;
}) {
  const { data: productList = [], isLoading } = useMotorQuotationProducts(companyId);

  return (
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
  );
}

export default function AddMotorQuotation() {
  const router = useRouter();
  const quotationId = router.query.id ? String(router.query.id) : null;
  const { data: masterData, isLoading: isMasterLoading } = useMotorQuotationMasterData();
  const { insertMotorQuotation } = useMotorQuotationActions();
  const { data: quotationDetail, isLoading: isDetailLoading } = useMotorQuotationDetail(quotationId);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVehicleTypeChange = (val: string) => {
    const selected = vehicleTypeList.find(
      (vt: any) => String(vt.id) === String(val) || String(vt.value) === String(val)
    );
    setFormData((prev) => ({
      ...prev,
      vehicle_type_id: selected ? String(selected.id) : val,
      vehicle_type: selected ? selected.value : val,
    }));
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
                required
              />

              <Input
                label="Mobile No"
                name="mobile"
                placeholder="MobileNo"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />

              <Input
                label="House No"
                name="house_no"
                placeholder="House No"
                value={formData.house_no}
                onChange={(e) => handleInputChange('house_no', e.target.value)}
              />

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
                maxLength={6}
              />

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
                >
                  <option value="">{isMasterLoading ? 'Loading...' : 'Select Vehicle Type'}</option>
                  {vehicleTypeList.map((vt: any) => (
                    <option key={vt.id} value={vt.id}>
                      {vt.value}
                    </option>
                  ))}
                </Select>
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
              />

              <Input
                label="Total IDV"
                name="total_idv"
                placeholder="Total IDV"
                value={formData.total_idv}
                onChange={(e) => handleInputChange('total_idv', e.target.value)}
              />

              <Input
                label="NCB %"
                name="ncb_percent"
                placeholder="NCB %"
                value={formData.ncb_percent}
                onChange={(e) => handleInputChange('ncb_percent', e.target.value)}
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
                className="bg-[#2B4399] hover:bg-[#203378] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus size={15} strokeWidth={2.5} /> Add Quote
              </button>
            </div>

            <div className="space-y-4">
              {quotes.map((quote, idx) => (
                <div
                  key={quote.id || idx}
                  className="bg-[#F8FAFC] p-4 md:p-5 rounded-xl border border-gray-200/80 space-y-4 shadow-2xs hover:border-gray-300 transition-all"
                >
                  {/* Row 1 of fields: Company, Product, Addon, IDV */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}>
                        Company <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={quote.company_id || ''}
                        onChange={(e: any) => handleCompanyChange(idx, e.target.value)}
                      >
                        <option value="">{isMasterLoading ? 'Loading...' : 'Select Company'}</option>
                        {companyList.map((comp: any) => (
                          <option key={comp.company_id} value={comp.company_id}>
                            {comp.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Product <span className="text-red-500">*</span>
                      </label>
                      <ProductSelect
                        companyId={quote.company_id}
                        value={quote.product_id || quote.product_name}
                        onChange={(val, prodObj) => handleProductChange(idx, val, prodObj)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Addon</label>
                      <Input
                        name={`add_on_${idx}`}
                        placeholder="Addon details"
                        value={quote.add_on}
                        onChange={(e) => handleQuoteChange(idx, 'add_on', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>IDV</label>
                      <Input
                        name={`idv_${idx}`}
                        placeholder="IDV"
                        value={quote.idv}
                        onChange={(e) => handleQuoteChange(idx, 'idv', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 2 of fields: Premium, Discount, Remark, Recommended + Delete */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className={labelClass}>
                        Premium <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name={`premium_${idx}`}
                        placeholder="0"
                        value={quote.premium}
                        onChange={(e) => handleQuoteChange(idx, 'premium', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Discount</label>
                      <Input
                        name={`discount_${idx}`}
                        placeholder="Discount"
                        value={quote.discount}
                        onChange={(e) => handleQuoteChange(idx, 'discount', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Remark</label>
                      <Input
                        name={`remark_${idx}`}
                        placeholder="Remark"
                        value={quote.remark}
                        onChange={(e) => handleQuoteChange(idx, 'remark', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex flex-col items-center">
                        <label className="text-[11px] font-bold text-gray-700 mb-1.5">
                          Recommended
                        </label>
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

                      <button
                        type="button"
                        onClick={() => removeQuote(idx)}
                        className="bg-[#DA3F49] hover:bg-[#c9303a] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs h-[42px]"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
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
