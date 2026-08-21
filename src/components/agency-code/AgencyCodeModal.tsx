import React from 'react';
import { X, Building2, User, Hash, Phone, Mail, FileText } from 'lucide-react';
import ActionButtons from '@/components/ui/ActionButtons';
import Select from '@/components/ui/Select';

export interface CompanyOption {
  id: string | number;
  name: string;
}

export interface AgencyCodeFormData {
  company_id: string | number;
  name: string;
  code: string;
  remark: string;
  email: string;
  mobile_number: string;
}

interface AgencyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: AgencyCodeFormData;
  setFormData: React.Dispatch<React.SetStateAction<AgencyCodeFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  companyOptions: CompanyOption[];
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function AgencyCodeModal({
  isOpen,
  onClose,
  title,
  formData,
  setFormData,
  errors,
  setErrors,
  companyOptions,
  isSubmitting,
  onSubmit,
}: AgencyCodeModalProps) {
  if (!isOpen) return null;

  const handleChange = (field: keyof AgencyCodeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">

        {/* Header */}
        <div className="bg-[#2B4399] px-6 py-4.5 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <Building2 size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight leading-none text-white">{title}</h2>
              <p className="text-xs text-indigo-100/80 mt-1 font-medium">Configure agency code & company mapping</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
            title="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/30">

          {/* Company Selection - Using Select.tsx */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
              Select Company <span className="text-rose-500">*</span>
            </label>
            <Select
              value={formData.company_id}
              onChange={(e: any) => handleChange('company_id', e.target.value)}
              className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all outline-none font-medium ${errors.company_id
                  ? '!border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 focus:border-[#2B4399]'
                }`}
            >
              <option value="">-- Select Insurance Company --</option>
              {companyOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {errors.company_id && (
              <p className="text-xs text-rose-500 mt-1 font-semibold px-0.5">{errors.company_id}</p>
            )}
          </div>

          {/* 2-Column Row for Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
                Agent / Branch Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={17} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Agent Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all outline-none font-medium placeholder:text-slate-400 ${errors.name
                      ? '!border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 focus:border-[#2B4399] focus:ring-2 focus:ring-[#2B4399]/15'
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-semibold px-0.5">{errors.name}</p>
              )}
            </div>

            {/* Agency Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
                Agency Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Hash size={17} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Agency Code"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all outline-none font-medium placeholder:text-slate-400 ${errors.code
                      ? '!border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 focus:border-[#2B4399] focus:ring-2 focus:ring-[#2B4399]/15'
                    }`}
                />
              </div>
              {errors.code && (
                <p className="text-xs text-rose-500 mt-1 font-semibold px-0.5">{errors.code}</p>
              )}
            </div>

          </div>

          {/* 2-Column Row for Mobile & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={17} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange('mobile_number', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm transition-all outline-none font-medium focus:border-[#2B4399] focus:ring-2 focus:ring-[#2B4399]/15 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm transition-all outline-none font-medium focus:border-[#2B4399] focus:ring-2 focus:ring-[#2B4399]/15 placeholder:text-slate-400"
                />
              </div>
            </div>

          </div>

          {/* Remark Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">
              Remark
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400">
                <FileText size={17} />
              </div>
              <textarea
                rows={2}
                placeholder="Enter any additional notes or remark..."
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm transition-all outline-none font-medium focus:border-[#2B4399] focus:ring-2 focus:ring-[#2B4399]/15 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="shrink-0">
          <ActionButtons
            onCancel={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitText="Save Agency Code"
            cancelText="Cancel"
          />
        </div>

      </div>
    </div>
  );
}
