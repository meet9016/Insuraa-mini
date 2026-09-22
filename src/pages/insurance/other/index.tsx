import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { getOtherInsuranceColumns } from '@/utils/tableColumns';
import ViewOtherInsuranceModal from './components/ViewOtherInsuranceModal';
import { TableActions } from '@/components/ui/tableaggrid/TableActions';
import { useOtherInsuranceList, useOtherInsuranceActions } from '@/hooks/useOtherInsuranceApi';

export default function OtherInsuranceList() {
  const router = useRouter();
  const { deleteOtherInsurance } = useOtherInsuranceActions();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // View Modal state
  const [viewModalState, setViewModalState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

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

  // Debounce search input (500ms delay)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch list using custom hook with debounced search
  const { data: resData, isLoading } = useOtherInsuranceList({ page, limit, search: debouncedSearch });
  const insuranceList = resData?.otherInsuranceList || [];
  const totalRecords = resData?.totalRecords ?? insuranceList.length ?? 0;

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

  const fullRowData = useMemo(() => {
    if (!totalRecords || totalRecords <= insuranceList.length) return insuranceList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    insuranceList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [insuranceList, totalRecords, page, limit]);

  const handleDeleteClick = (data: any) => {
    const targetId = data?.other_insurance_id || data?.id;
    const displayName = data?.policy_number ? `Policy #${data.policy_number}` : (data?.customer_name || 'Other Insurance Record');
    setDeleteModalState({
      isOpen: true,
      id: String(targetId),
      name: displayName,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
    const success = await deleteOtherInsurance(deleteModalState.id);
    if (success) {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    } else {
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const columnDefs = useMemo(
    () => getOtherInsuranceColumns({
      onView: (data) => setViewModalState({ isOpen: true, id: data.other_insurance_id || data.id }),
      onEdit: (data) => router.push(`/insurance/other/add?id=${data.other_insurance_id || data.id}`),
      onDelete: (data) => handleDeleteClick(data)
    }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Other Insurance Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Other Insurance Management"
          subtitle="Manage and view your other insurance records"
          searchPlaceholder="Search other insurance..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Other Insurance"
          onButtonClick={() => router.push('/insurance/other/add')}
        />

        <div className="w-full">
          <AgGridTable
            rowData={fullRowData}
            columnDefs={columnDefs as any}
            loading={isLoading}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        title="Delete Other Insurance"
        message={`Are you sure you want to delete ${deleteModalState.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false })}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* View Modal */}
      <ViewOtherInsuranceModal
        isOpen={viewModalState.isOpen}
        id={viewModalState.id}
        onClose={() => setViewModalState({ isOpen: false, id: null })}
      />
    </div>
  );
}
