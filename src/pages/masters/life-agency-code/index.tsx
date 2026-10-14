import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { Trash2 } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import TableHeader from '@/components/ui/TableHeader';
import AgencyCodeModal, { AgencyCodeFormData } from '@/components/agency-code/AgencyCodeModal';
import { useLifeCompanyDropdownList, useLifeAgencyCodeList, useLifeAgencyCodeActions } from '@/hooks/useAgencyCodeApi';
import { getAgencyCodeColumns } from '@/utils/tableColumns';
import { validateAgencyCode } from '@/utils/validation';

export default function LifeAgencyCodeList() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Bulk Delete selection state
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AgencyCodeFormData>({
    company_id: '',
    name: '',
    code: '',
    remark: '',
    email: '',
    mobile_number: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const { data: companyDropdownList = [], isLoading: isLoadingCompanies } = useLifeCompanyDropdownList();
  const { data: agencyCodeRes, isLoading: isLoadingList } = useLifeAgencyCodeList({ page, limit, search: debouncedSearch });
  const agencyCodeList = agencyCodeRes?.agencyCodeList || [];
  const totalRecords = agencyCodeRes?.totalRecords ?? agencyCodeList.length ?? 0;
  const { insertAgencyCode, deleteAgencyCode, bulkDeleteLifeAgencyCode } = useLifeAgencyCodeActions();

  const handleSelectionChanged = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes();
    const rows = selectedNodes.map((node: any) => node.data).filter((d: any) => d && !d.id?.toString().startsWith('placeholder-'));
    setSelectedRows(rows);
  };

  const handleConfirmBulkDelete = async () => {
    const ids = selectedRows
      .map(r => r?.agency_code_id || r?.id)
      .filter(id => id !== undefined && id !== null && id !== '');

    if (ids.length === 0) return;

    setIsBulkDeleting(true);
    const res = await bulkDeleteLifeAgencyCode(ids);
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);

    if (res?.success) {
      setSelectedRows([]);
      if (gridApi) {
        gridApi.deselectAll();
      }
    }
  };

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
    if (!totalRecords || totalRecords <= agencyCodeList.length) return agencyCodeList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    agencyCodeList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [agencyCodeList, totalRecords, page, limit]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      company_id: '',
      name: '',
      code: '',
      remark: '',
      email: '',
      mobile_number: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (data: any) => {
    const id = data?.agency_code_id || data?.id || '';
    setEditingId(id);
    setFormData({
      company_id: data?.company_id || '',
      name: data?.name || '',
      code: data?.code || '',
      remark: data?.remark || '',
      email: data?.email || '',
      mobile_number: data?.mobile_number || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const { isValid, errors: newErrors } = validateAgencyCode(formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const success = await insertAgencyCode({
        agency_code_id: editingId,
        company_id: formData.company_id,
        name: formData.name,
        code: formData.code,
        remark: formData.remark,
        email: formData.email,
        mobile_number: formData.mobile_number,
      });

      if (success) {
        setIsModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteAgencyCode(deleteModalState.id);
    } finally {
      setDeleteModalState({ isOpen: false, id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(
    () =>
      getAgencyCodeColumns({
        onEdit: (data: any) => handleEdit(data),
        onDelete: (data: any) => {
          const id = data?.agency_code_id || data?.id || '';
          const name = data?.name || 'this record';
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
        <title>Life Insurance Agency Code - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Life Insurance Agency Code"
          subtitle="Manage and view life insurance agency codes"
          searchPlaceholder="Search agency code..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Life Agency Code"
          onButtonClick={handleOpenAddModal}
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
            loading={isLoadingList}
            rowHeight={65}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
            onSelectionChanged={handleSelectionChanged}
            onGridReady={(params) => setGridApi(params.api)}
          />
        </div>
      </div>

      <AgencyCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Life Agency Code' : 'Add Life Agency Code'}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        companyOptions={companyDropdownList}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Life Agency Code"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Life Agency Codes"
        itemName={`${selectedRows.length} selected agency code(s)`}
        description={`Are you sure you want to delete ${selectedRows.length} selected agency code(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}
