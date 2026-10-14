import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useClaimList, useClaimActions } from '@/hooks/useClaimApi';
import { getClaimColumns } from '@/utils/tableColumns';

export default function ClaimList() {
  const router = useRouter();
  const { deleteClaim, bulkDeleteClaim } = useClaimActions();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Selected rows for bulk operations
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  // Delete Modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    id: '',
    name: '',
    isDeleting: false,
  });

  // Debounce search input (500ms delay) to prevent API calls on every character keypress
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch claim list using custom hook with debounced search and FormData payload
  const { data: resData, isLoading } = useClaimList({ page, limit, search: debouncedSearch });
  const claimList = resData?.claimList || [];
  const totalRecords = resData?.totalRecords ?? claimList.length ?? 0;

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

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

  const handleSelectionChanged = (event: any) => {
    if (!event?.api) return;
    const selected = event.api.getSelectedRows() || [];
    const valid = selected.filter(
      (item: any) => item && (item.claim_id || item.id) && !String(item.claim_id || item.id).startsWith('placeholder-')
    );
    setSelectedRows(valid);
  };

  const handleDeleteClick = (data: any) => {
    const targetId = data?.claim_id || data?.id;
    const displayName = data?.claim_number ? `Claim #${data.claim_number}` : (data?.customer_name || 'Claim Record');
    setDeleteModalState({
      isOpen: true,
      id: String(targetId),
      name: displayName,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;
    setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));
    const success = await deleteClaim(deleteModalState.id);
    setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    if (success) {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    const ids = selectedRows
      .map((r: any) => r?.claim_id || r?.id)
      .filter(Boolean);

    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const res = await bulkDeleteClaim(ids);
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);

    if (res?.success) {
      setSelectedRows([]);
      if (gridApi) {
        gridApi.deselectAll();
      }
    }
  };

  const fullRowData = useMemo(() => {
    if (!totalRecords || totalRecords <= claimList.length) return claimList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}`, claim_id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    claimList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [claimList, totalRecords, page, limit]);

  const columnDefs = useMemo(
    () =>
      getClaimColumns({
        onEdit: (data: any) => router.push(`/claim/add?id=${data?.claim_id || data?.id}`),
        onDelete: handleDeleteClick,
      }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc] ">
      <Head>
        <title>Claim Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Claim Management"
          subtitle="Manage and view your claim records"
          searchPlaceholder="Search claims..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Claim"
          onButtonClick={() => router.push('/claim/add')}
          extraActions={
            selectedRows.length > 0 ? (
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-md shadow-sm transition-all flex items-center gap-2 animate-in fade-in duration-200"
              >
                <Trash2 size={16} />
                <span>Bulk Delete ({selectedRows.length})</span>
              </button>
            ) : null
          }
        />

        <div className="w-full">
          <AgGridTable
            rowData={fullRowData}
            columnDefs={columnDefs as any}
            loading={isLoading}
            rowHeight={75}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
            onSelectionChanged={handleSelectionChanged}
            onGridReady={(params) => setGridApi(params.api)}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Claim Record"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Claims"
        itemName={`${selectedRows.length} selected record(s)`}
        description={`Are you sure you want to delete ${selectedRows.length} selected claim record(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}


