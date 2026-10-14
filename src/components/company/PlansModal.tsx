import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlansCompany: any;
  planList: any[];
  isLoadingPlans: boolean;
  planColumnDefs: any[];
  onAddPlanClick: () => void;
  onBulkDeletePlans?: (ids: (string | number)[]) => Promise<any>;
}

export default function PlansModal({
  isOpen,
  onClose,
  activePlansCompany,
  planList,
  isLoadingPlans,
  planColumnDefs,
  onAddPlanClick,
  onBulkDeletePlans,
}: PlansModalProps) {
  const [selectedPlanRows, setSelectedPlanRows] = useState<any[]>([]);
  const [planGridApi, setPlanGridApi] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlanRows([]);
      if (planGridApi) planGridApi.deselectAll();
    }
  }, [isOpen, planGridApi]);

  if (!isOpen || !activePlansCompany) return null;

  const handleSelectionChanged = (event: any) => {
    if (!event?.api) return;
    const selected = event.api.getSelectedRows() || [];
    const valid = selected.filter(
      (item: any) => item && (item.id || item.plan_id) && !String(item.id || item.plan_id).startsWith('placeholder-')
    );
    setSelectedPlanRows(valid);
  };

  const handleConfirmBulkDelete = async () => {
    if (!selectedPlanRows || selectedPlanRows.length === 0 || !onBulkDeletePlans) return;
    const ids = selectedPlanRows
      .map((r: any) => r?.id || r?.plan_id)
      .filter(Boolean);

    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const res = await onBulkDeletePlans(ids);
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);

    if (res?.success) {
      setSelectedPlanRows([]);
      if (planGridApi) {
        planGridApi.deselectAll();
      }
    }
  };

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
          extraActions={
            selectedPlanRows.length > 0 && onBulkDeletePlans ? (
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-md shadow-sm transition-all flex items-center gap-2 animate-in fade-in duration-200"
              >
                <Trash2 size={16} />
                <span>Bulk Delete ({selectedPlanRows.length})</span>
              </button>
            ) : null
          }
        />

        <div className="flex-1 overflow-auto bg-white p-4">
          <AgGridTable
            rowData={planList}
            columnDefs={planColumnDefs as any}
            loading={isLoadingPlans}
            height="450px"
            onSelectionChanged={handleSelectionChanged}
            onGridReady={(params) => setPlanGridApi(params.api)}
          />
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Plans"
        itemName={`${selectedPlanRows.length} selected plan(s)`}
        description={`Are you sure you want to delete ${selectedPlanRows.length} selected plan(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}

