import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useHealthQuotationList, useHealthQuotationActions } from '@/hooks/useHealthQuotationApi';
import { getHealthQuotationColumns } from '@/utils/tableColumns';

export default function HealthQuotationList() {
  const router = useRouter();
  const { deleteHealthQuotation } = useHealthQuotationActions();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

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

  // Fetch health quotation list using custom hook
  const { data: resData, isLoading } = useHealthQuotationList({
    page,
    limit,
    search: debouncedSearch,
  });

  const quotationList = resData?.quotationList || [];
  const totalRecords = resData?.totalRecords ?? quotationList.length ?? 0;

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
    if (!totalRecords || totalRecords <= quotationList.length) return quotationList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    quotationList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [quotationList, totalRecords, page, limit]);

  const handleDeleteClick = (data: any) => {
    const targetId = data?.quotation_id || data?.id;
    const displayName = data?.insured_name ? data.insured_name : (data?.quotation_id ? `Quotation #${data.quotation_id}` : 'Health Quotation Record');
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
    const success = await deleteHealthQuotation(deleteModalState.id);
    setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    if (success) {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(
    () =>
      getHealthQuotationColumns({
        onView: (data: any) => {
          // Handle view action if needed
        },
        onEdit: (data: any) =>
          router.push(`/quotation/health/add?id=${data?.quotation_id || data?.id}`),
        onDelete: handleDeleteClick,
      }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Health Quotation - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Health Quotation"
          subtitle="Manage and view your health quotation records"
          searchPlaceholder="Search health quotation..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Health Quotation"
          onButtonClick={() => router.push('/quotation/health/add')}
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
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Health Quotation Record"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}

