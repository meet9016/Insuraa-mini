import React, { useState, useMemo } from 'react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import ReminderNotesModal from '@/components/leads/ReminderNotesModal';
import { useLeadTableList, useLeadActions } from '@/hooks/useLeadApi';
import { getLeadColumns } from '@/utils/tableColumns';

interface TableViewProps {
  search: string;
  onEditLead?: (lead: any) => void;
}

export default function TableView({ search, onEditLead }: TableViewProps) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data: tableRes, isLoading: isTableLoading } = useLeadTableList({
    page,
    limit,
    search,
    enabled: true,
  });
  const { deleteLead } = useLeadActions();

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    lead_id: string | number | null;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    lead_id: null,
    name: '',
    isDeleting: false,
  });

  // Reminder & Notes modal state
  const [reminderNotesState, setReminderNotesState] = useState<{
    isOpen: boolean;
    leadName?: string;
    leadId?: string | number;
    tab: 'notes' | 'reminders';
  }>({
    isOpen: false,
    leadName: '',
    leadId: '',
    tab: 'notes',
  });

  const handleDeleteClick = (data: any) => {
    const leadId = data?.lead_id || data?.id;
    const name = data?.full_name || data?.name || 'Lead';
    if (!leadId) return;
    setDeleteModalState({
      isOpen: true,
      lead_id: leadId,
      name,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.lead_id) return;
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
    try {
      const success = await deleteLead(deleteModalState.lead_id);
      if (success) {
        setDeleteModalState({ isOpen: false, lead_id: null, name: '', isDeleting: false });
      } else {
        setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
      }
    } catch {
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const leadTableList = tableRes?.leadList || [];
  const totalRecords = tableRes?.totalRecords ?? leadTableList.length ?? 0;

  const handlePaginationChanged = (params: any) => {
    if (!params || !params.api) return;
    const newPage = params.api.paginationGetCurrentPage() + 1;
    const newLimit = params.api.paginationGetPageSize();

    if (newLimit !== limit) {
      setLimit(newLimit);
      setPage(1);
    } else if (newPage !== page) {
      setPage(newPage);
    }
  };

  const fullRowData = useMemo(() => {
    const total = Number(totalRecords) || leadTableList.length || 0;
    if (total === 0) return [];
    if (total <= leadTableList.length && page === 1) return leadTableList;

    const padded = new Array(total).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    leadTableList.forEach((lead: any, i: number) => {
      if (startIndex + i < total) {
        padded[startIndex + i] = lead;
      }
    });
    return padded;
  }, [leadTableList, totalRecords, page, limit]);

  const columnDefs = useMemo(
    () =>
      getLeadColumns({
        onNotes: (data: any) => {
          setReminderNotesState({
            isOpen: true,
            leadName: data?.full_name || data?.name,
            leadId: data?.lead_id || data?.id,
            tab: 'notes',
          });
        },
        onEdit: (data: any) => {
          if (onEditLead) onEditLead(data);
        },
        onDelete: handleDeleteClick,
      }),
    [onEditLead]
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col">
      <AgGridTable
        rowData={fullRowData}
        columnDefs={columnDefs as any}
        loading={isTableLoading}
        pagination={true}
        paginationPageSize={limit}
        onPaginationChanged={handlePaginationChanged}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Reminder & Notes Modal */}
      <ReminderNotesModal
        isOpen={reminderNotesState.isOpen}
        onClose={() => setReminderNotesState(prev => ({ ...prev, isOpen: false }))}
        leadName={reminderNotesState.leadName}
        leadId={reminderNotesState.leadId}
        initialTab={reminderNotesState.tab}
      />
    </div>
  );
}

