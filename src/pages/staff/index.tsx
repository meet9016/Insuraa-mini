import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import ViewStaffModal from '@/components/ViewStaffModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useStaffList, useDeleteStaff, useUpdateStaffStatus } from '@/hooks/useStaffApi';
import { getStaffColumns } from '@/utils/tableColumns';

export default function StaffPage() {
  const router = useRouter();
  const deleteStaffMutation = useDeleteStaff();
  const updateStaffStatusMutation = useUpdateStaffStatus();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string | number;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    id: '',
    name: '',
    isDeleting: false,
  });

  // Debounce search input (500ms delay) to prevent redundant API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch staff list using custom hook
  const { data: staffRes, isLoading } = useStaffList({
    page,
    limit,
    search: debouncedSearch,
  });

  const staffList = staffRes?.staffList || [];
  const totalRecords = staffRes?.totalRecords ?? staffList.length ?? 0;

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

  // Build full row data with placeholders for smooth server pagination
  const fullRowData = useMemo(() => {
    if (!totalRecords || totalRecords <= staffList.length) return staffList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    staffList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [staffList, totalRecords, page, limit]);

  const handleViewStaff = (data: any) => {
    const idToView = data?.staff_id || data?.id;
    if (idToView) {
      setSelectedStaffId(idToView);
      setIsViewModalOpen(true);
    }
  };

  const handleStatusToggle = (data: any, newStatus: number) => {
    const idToUpdate = data?.staff_id || data?.id;
    if (!idToUpdate) return;

    updateStaffStatusMutation.mutate({
      staff_id: idToUpdate,
      status: newStatus,
    });
  };

  const handleEditStaff = (data: any) => {
    const idToEdit = data?.staff_id || data?.id;
    if (idToEdit) {
      router.push(`/staff/add?id=${idToEdit}`);
    }
  };

  const handleDeleteStaff = (data: any) => {
    const idToDelete = data?.staff_id || data?.id;
    const staffName = data?.full_name || 'Staff Member';
    if (idToDelete) {
      setDeleteModalState({
        isOpen: true,
        id: idToDelete,
        name: staffName,
        isDeleting: false,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModalState.id) return;
    setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));

    deleteStaffMutation.mutate(deleteModalState.id, {
      onSettled: () => {
        setDeleteModalState({
          isOpen: false,
          id: '',
          name: '',
          isDeleting: false,
        });
      },
    });
  };

  const columnDefs = useMemo(
    () =>
      getStaffColumns({
        onView: handleViewStaff,
        onStatusToggle: handleStatusToggle,
        onEdit: handleEditStaff,
        onDelete: handleDeleteStaff,
      }),
    []
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Staff Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Staff Management"
          subtitle="Manage and view your staff records"
          searchPlaceholder="Search staff by name, phone, email..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Staff"
          onButtonClick={() => router.push('/staff/add')}
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

      {/* View Staff Modal */}
      <ViewStaffModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStaffId(null);
        }}
        staffId={selectedStaffId}
      />

      {/* Common Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Staff"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}
