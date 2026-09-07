import React from 'react';
import { X } from 'lucide-react';
import ActionButtons from '@/components/ui/ActionButtons';
import Input from '@/components/ui/Input';
import { validateCompanyPlan } from '@/utils/validation';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlanName(value);
    if (planNameError) {
      setPlanNameError(validateCompanyPlan(value));
    }
  };

  const handleBlur = () => {
    if (planNameError || planName) {
      setPlanNameError(validateCompanyPlan(planName));
    }
  };

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
          <Input
            label="Plan Name"
            required
            name="planName"
            placeholder="e.g. Term Life Gold"
            value={planName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={planNameError}
          />
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

