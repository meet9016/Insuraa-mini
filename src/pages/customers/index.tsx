import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import CustomerViewModal from '@/components/customers/CustomerViewModal';
import { useCustomerList, useCustomerActions } from '@/hooks/useCustomerApi';
import { getCustomerColumns } from '@/utils/tableColumns';

export default function CustomersPage() {
  const router = useRouter();
  const { bulkDeleteCustomer } = useCustomerActions();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Customer View Modal state
  const [viewCustomerId, setViewCustomerId] = useState<string | number | null>(null);

  // Selected rows for bulk operations
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  // Single Delete Modal state
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

  // Fetch customer list using common custom hook with debounced search
  const { data: customerRes, isLoading } = useCustomerList({ page, limit, search: debouncedSearch });
  const customers = customerRes?.customerList || [];
  const totalRecords = customerRes?.totalRecords ?? customers.length ?? 0;

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
      (item: any) => item && (item.id || item.customer_id) && !String(item.id || item.customer_id).startsWith('placeholder-')
    );
    setSelectedRows(valid);
  };

  const fullRowData = useMemo(() => {
    if (!totalRecords || totalRecords <= customers.length) return customers;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    customers.forEach((cust: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = cust;
      }
    });
    return padded;
  }, [customers, totalRecords, page, limit]);

  const handleDeleteClick = (data: any) => {
    const targetId = data?.id || data?.customer_id;
    const displayName = data?.name || data?.full_name || `${data?.first_name || ''} ${data?.last_name || ''}`.trim() || 'Customer Record';
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
    const res = await bulkDeleteCustomer([deleteModalState.id]);
    setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    if (res?.success) {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    const ids = selectedRows
      .map((r: any) => r?.id || r?.customer_id)
      .filter(Boolean);

    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const res = await bulkDeleteCustomer(ids);
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);

    if (res?.success) {
      setSelectedRows([]);
      if (gridApi) {
        gridApi.deselectAll();
      }
    }
  };

  const columnDefs = useMemo(
    () =>
      getCustomerColumns({
        onView: (data: any) => setViewCustomerId(data?.customer_id || data?.id),
        onEdit: (data: any) => router.push(`/customers/add?id=${data?.id || data?.customer_id}`),
        onDelete: handleDeleteClick,
      }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Customer Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Customer Management"
          subtitle="Manage and view your customer records"
          searchPlaceholder="Search customers..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Customer"
          onButtonClick={() => router.push('/customers/add')}
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
            rowHeight={65}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
            onSelectionChanged={handleSelectionChanged}
            onGridReady={(params) => setGridApi(params.api)}
          />
        </div>
      </div>

      {/* Single Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Customers"
        itemName={`${selectedRows.length} selected record(s)`}
        description={`Are you sure you want to delete ${selectedRows.length} selected customer record(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />

      {/* Customer 360 View Modal */}
      <CustomerViewModal
        isOpen={Boolean(viewCustomerId)}
        onClose={() => setViewCustomerId(null)}
        customerId={viewCustomerId}
      />
    </div>
  );
}
