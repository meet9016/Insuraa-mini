import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import TableHeader from '@/components/ui/TableHeader';
import AgencyCodeModal, { AgencyCodeFormData } from '@/components/agency-code/AgencyCodeModal';
import { useCompanyDropdownList, useAgencyCodeList, useAgencyCodeActions } from '@/hooks/useAgencyCodeApi';
import { getAgencyCodeColumns } from '@/utils/tableColumns';

export default function GeneralAgencyCodeList() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

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

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input (500ms delay) to prevent API calls on every character keypress
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // API Hooks with debounced search
  const { data: companyDropdownList = [], isLoading: isLoadingCompanies } = useCompanyDropdownList();
  const { data: agencyCodeRes, isLoading: isLoadingList } = useAgencyCodeList({ page, limit, search: debouncedSearch });
  const agencyCodeList = agencyCodeRes?.agencyCodeList || [];
  const totalRecords = agencyCodeRes?.totalRecords ?? agencyCodeList.length ?? 0;
  const { insertAgencyCode, deleteAgencyCode } = useAgencyCodeActions();

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
    const newErrors: Record<string, string> = {};
    if (!formData.company_id) newErrors.company_id = 'Company is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.code.trim()) newErrors.code = 'Agency Code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <title>General Insurance Agency Code - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="General Insurance Agency Code"
          subtitle="Manage and view general insurance agency codes"
          searchPlaceholder="Search agency code..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add General Agency Code"
          onButtonClick={handleOpenAddModal}
        />

        <div className="w-full">
          <AgGridTable
            rowData={fullRowData}
            columnDefs={columnDefs as any}
            loading={isLoadingList}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
          />
        </div>
      </div>

      <AgencyCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit General Agency Code' : 'Add General Agency Code'}
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
        title="Delete General Agency Code"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}
