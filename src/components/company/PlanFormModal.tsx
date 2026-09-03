import React from 'react';
import { X } from 'lucide-react';
import ActionButtons from '@/components/ui/ActionButtons';
import Input from '@/components/ui/Input';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  setPlanName: (name: string) => void;
  planNameError: string;
  setPlanNameError: (error: string) => void;
  editingPlanId: string | number | null;
  isSubmittingPlan: boolean;
  onSubmit: () => void;
}

export default function PlanFormModal({
  isOpen,
  onClose,
  planName,
  setPlanName,
  planNameError,
  setPlanNameError,
  editingPlanId,
  isSubmittingPlan,
  onSubmit,
}: PlanFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white">
          <h2 className="font-bold text-base">{editingPlanId ? 'Edit Plan' : 'Add Plan'}</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6">
          <div>
            <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="planName"
              placeholder="e.g. Term Life Gold"
              value={planName}
              onChange={(e: any) => {
                setPlanName(e.target.value);
                if (planNameError) setPlanNameError('');
              }}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400 ${
                planNameError ? '!border-red-500 ring-2 ring-red-500/20' : ''
              }`}
            />
            {planNameError && (
              <p className="text-xs text-red-500 mt-1 font-medium">{planNameError}</p>
            )}
          </div>
        </div>
        <ActionButtons 
          onCancel={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmittingPlan}
          submitText={editingPlanId ? 'Update' : 'Save Plan'}
        />
      </div>
    </div>
  );
}
