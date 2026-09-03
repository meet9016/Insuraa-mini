import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { X } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import ActionButtons from '@/components/ui/ActionButtons';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useRiderList, useRiderActions } from '@/hooks/useRiderApi';
import { getRiderColumns } from '@/utils/tableColumns';
import { validateRider } from '@/utils/validation';

export default function RiderList() {
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Delete modal state
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

  // Debounce search input (500ms delay) to prevent API calls on every character keypress
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // API hooks with debounced search
  const { data: riderRes, isLoading } = useRiderList({ page, limit, search: debouncedSearch });
  const riders = riderRes?.riderList || [];
  const totalRecords = riderRes?.totalRecords ?? riders.length ?? 0;
  const { insertRider, deleteRider } = useRiderActions();

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
    if (!totalRecords || totalRecords <= riders.length) return riders;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    riders.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [riders, totalRecords, page, limit]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewName('');
    setNameError('');
    setIsFormModalOpen(true);
  };

  const handleSave = async () => {
    const errorMsg = validateRider(newName);
    if (errorMsg) {
      setNameError(errorMsg);
      return;
    }

    setNameError('');
    setIsSubmitting(true);
    try {
      const success = await insertRider(newName, editingId);
      if (success) {
        setNewName('');
        setNameError('');
        setEditingId(null);
        setIsFormModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewName('');
    setNameError('');
    setEditingId(null);
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteRider(deleteModalState.id);
    } finally {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(
    () =>
      getRiderColumns({
        onEdit: (data: any) => {
          const id = data?.rider_id || data?.id || '';
          const name = data?.name || '';
          setEditingId(id);
          setNewName(name);
          setNameError('');
          setIsFormModalOpen(true);
        },
        onDelete: (data: any) => {
          const id = data?.rider_id || data?.id || '';
          const name = data?.name || 'this rider';
          setDeleteModalState({
            isOpen: true,
            id: id,
            name: name,
            isDeleting: false,
          });
        },
      }),
    []
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Rider List - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Rider List"
          subtitle="Manage and view your riders"
          searchPlaceholder="Search riders..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Rider"
          onButtonClick={handleOpenAddModal}
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

      {/* Form Popup Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel}></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white">
              <h2 className="font-bold text-base">{editingId ? 'Edit Rider' : 'Add Rider'}</h2>
              <button onClick={handleCancel} className="hover:text-gray-200 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Rider Name"
                  value={newName}
                  onChange={(e: any) => {
                    setNewName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400 ${
                    nameError ? '!border-red-500 ring-2 ring-red-500/20' : ''
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{nameError}</p>
                )}
              </div>
            </div>

            <ActionButtons
              onCancel={handleCancel}
              onSubmit={handleSave}
              isSubmitting={isSubmitting}
              submitText={editingId ? 'Update' : 'Save'}
              cancelText="Cancel"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Rider"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}
