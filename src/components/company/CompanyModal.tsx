import React from 'react';
import { X } from 'lucide-react';
import ActionButtons from '@/components/ui/ActionButtons';
import Input from '@/components/ui/Input';

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
          <Input
            label="Company Name"
            name="companyName"
            required
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e: any) => {
              setCompanyName(e.target.value);
              if (companyNameError) setCompanyNameError('');
            }}
            error={companyNameError}
            labelClassName="text-[13px] font-semibold text-gray-700"
          />
        </div>
        <ActionButtons 
          onCancel={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitText={editingCompanyId ? 'Update' : 'Save'}
        />
      </div>
    </div>
  );
}
