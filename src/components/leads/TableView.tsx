import React, { useState, useMemo } from 'react';
import { Plus, Download, LayoutGrid, List, Trash2 } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import ReminderNotesModal from '@/components/leads/ReminderNotesModal';
import { useLeadTableList, useLeadActions } from '@/hooks/useLeadApi';
import { getLeadColumns } from '@/utils/tableColumns';

interface TableViewProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  onEditLead?: (lead: any) => void;
  onAddLead?: () => void;
  onExport?: () => void;
  viewMode?: 'kanban' | 'table';
  onViewModeChange?: (mode: 'kanban' | 'table') => void;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  showSearch?: boolean;
}

export default function TableView({
  search = '',
  onSearchChange,
  onEditLead,
  onAddLead,
  onExport,
  viewMode = 'table',
  onViewModeChange,
  title = 'Leads List',
  subtitle,
  searchPlaceholder = 'Search leads by name or ID...',
  buttonText = 'Add Lead',
  showSearch = true,
}: TableViewProps) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Bulk Delete state
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: tableRes, isLoading: isTableLoading } = useLeadTableList({
    page,
    limit,
    search: debouncedSearch,
    enabled: true,
  });
  const { deleteLead, bulkDeleteLead } = useLeadActions();

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

  const handleConfirmBulkDelete = async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    const ids = selectedRows
      .map((r: any) => r?.lead_id)
      .filter(Boolean);

    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const res = await bulkDeleteLead(ids);
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);

    if (res?.success) {
      setSelectedRows([]);
      if (gridApi) {
        gridApi.deselectAll();
      }
    }
  };

  const handleSelectionChanged = (event: any) => {
    if (!event?.api) return;
    const selected = event.api.getSelectedRows() || [];
    const valid = selected.filter(
      (item: any) => item && item.lead_id && !String(item.lead_id).startsWith('placeholder-')
    );
    setSelectedRows(valid);
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

    const padded = new Array(total).fill(null).map((_, idx) => ({ id: `placeholder-${idx}`, lead_id: `placeholder-${idx}` }));
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
      <TableHeader
        title={title}
        subtitle={subtitle}
        searchPlaceholder={searchPlaceholder}
        searchValue={search}
        onSearchChange={onSearchChange}
        showSearch={showSearch && !!onSearchChange}
        extraActions={
          <>
            {selectedRows.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-md shadow-sm transition-all flex items-center gap-2 animate-in fade-in duration-200"
              >
                <Trash2 size={16} />
                <span>Bulk Delete ({selectedRows.length})</span>
              </button>
            )}
            {onViewModeChange && (
              <div className="bg-white border border-gray-200 p-1 rounded-md flex items-center shadow-sm">
                <button
                  type="button"
                  onClick={() => onViewModeChange('kanban')}
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-[#2B4399] shadow-sm text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Kanban View"
                >
                  <LayoutGrid size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('table')}
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${
                    viewMode === 'table'
                      ? 'bg-[#2B4399] shadow-sm text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Table View"
                >
                  <List size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow whitespace-nowrap"
              >
                <Download size={16} className="text-gray-500" /> Export
              </button>
            )}
          </>
        }
        buttonText={onAddLead ? buttonText : undefined}
        onButtonClick={onAddLead}
      />

      <AgGridTable
        rowData={fullRowData}
        columnDefs={columnDefs as any}
        loading={isTableLoading}
        pagination={true}
        paginationPageSize={limit}
        onPaginationChanged={handlePaginationChanged}
        onSelectionChanged={handleSelectionChanged}
        onGridReady={(params) => setGridApi(params.api)}
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

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Leads"
        itemName={`${selectedRows.length} selected lead(s)`}
        description={`Are you sure you want to delete ${selectedRows.length} selected lead(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
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
