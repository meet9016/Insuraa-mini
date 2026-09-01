import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import LifeInsuranceViewModal from '@/components/insurance/LifeInsuranceViewModal';
import { useLifeInsuranceList, useLifeInsuranceActions } from '@/hooks/useLifeInsuranceApi';
import { getLifeInsuranceColumns } from '@/utils/tableColumns';

export default function LifeInsuranceList() {
  const router = useRouter();
  const { deleteLifeInsurance } = useLifeInsuranceActions();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // View Modal state
  const [viewId, setViewId] = useState<string | null>(null);

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

  // Fetch life insurance list using custom hook with debounced search
  const { data: resData, isLoading } = useLifeInsuranceList({ page, limit, search: debouncedSearch });
  const insuranceList = resData?.lifeInsuranceList || [];
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
    const targetId = data?.life_insurance_id || data?.id;
    const displayName = data?.policy_number ? `Policy #${data.policy_number}` : (data?.customer_name || 'Life Insurance Record');
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
    const success = await deleteLifeInsurance(deleteModalState.id);
    setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    if (success) {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(
    () =>
      getLifeInsuranceColumns({
        onView: (data: any) => setViewId(String(data?.life_insurance_id || data?.id)),
        onEdit: (data: any) => router.push(`/insurance/life/add?id=${data?.life_insurance_id || data?.id}`),
        onDelete: handleDeleteClick,
      }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc]  flex flex-col">
      <Head>
        <title>Life Insurance Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Life Insurance Management"
          subtitle="Manage and view your life insurance records"
          searchPlaceholder="Search life insurance..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Life Insurance"
          onButtonClick={() => router.push('/insurance/life/add')}
        />

        <div className="w-full">
          <AgGridTable
            rowData={fullRowData}
            columnDefs={columnDefs as any}
            loading={isLoading}
            rowHeight={85}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
          />
        </div>
      </div>

      {/* View Policy Modal */}
      <LifeInsuranceViewModal
        isOpen={Boolean(viewId)}
        onClose={() => setViewId(null)}
        lifeInsuranceId={viewId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Life Insurance Record"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}
