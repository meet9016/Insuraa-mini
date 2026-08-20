import React from 'react';
import { X, Plus } from 'lucide-react';
import AgGridTable from '@/components/ui/AgGridTable';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlansCompany: any;
  planList: any[];
  isLoadingPlans: boolean;
  planColumnDefs: any[];
  onAddPlanClick: () => void;
}

export default function PlansModal({
  isOpen,
  onClose,
  activePlansCompany,
  planList,
  isLoadingPlans,
  planColumnDefs,
  onAddPlanClick,
}: PlansModalProps) {
  if (!isOpen || !activePlansCompany) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white shrink-0">
          <h2 className="font-bold text-base">{activePlansCompany.name || activePlansCompany.company_name} — Plans</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F2F7FF] shrink-0">
          <h3 className="font-semibold text-gray-900 text-sm">Company Plans</h3>
          <button
            type="button"
            onClick={onAddPlanClick}
            className="px-4 py-2 bg-[#2B4399] text-white text-xs font-bold rounded-lg shadow transition-all hover:bg-[#203378] flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Plan</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-white p-4">
          <AgGridTable rowData={planList} columnDefs={planColumnDefs as any} loading={isLoadingPlans} />
        </div>
      </div>
    </div>
  );
}
