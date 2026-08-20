import React from 'react';
import { X } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  companyNameError: string;
  setCompanyNameError: (error: string) => void;
  editingCompanyId: string | number | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function CompanyModal({
  isOpen,
  onClose,
  companyName,
  setCompanyName,
  companyNameError,
  setCompanyNameError,
  editingCompanyId,
  isSubmitting,
  onSubmit,
}: CompanyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white">
          <h2 className="font-bold text-base">{editingCompanyId ? 'Edit Company' : 'Add Company'}</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (companyNameError) setCompanyNameError('');
            }}
            className={`w-full border rounded-md px-3.5 py-2.5 text-sm focus:outline-none transition-all placeholder:text-gray-400 ${companyNameError
              ? '!border-red-500 ring-2 ring-red-500/20'
              : 'border-gray-300 focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591]'
              }`}
          />
          {companyNameError && (
            <p className="text-xs text-red-500 mt-1 font-medium">{companyNameError}</p>
          )}
        </div>
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded-md font-bold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (editingCompanyId ? 'Update' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
}
