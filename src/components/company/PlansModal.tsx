import React from 'react';
import { X } from 'lucide-react';
import AgGridTable from '@/components/ui/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';

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

        <TableHeader
          title="Company Plans"
          buttonText="Add Plan"
          onButtonClick={onAddPlanClick}
          showSearch={false}
        />

        <div className="flex-1 overflow-auto bg-white p-4">
          <AgGridTable rowData={planList} columnDefs={planColumnDefs as any} loading={isLoadingPlans} height="450px" />
        </div>
      </div>
    </div>
  );
}
