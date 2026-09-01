import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import TableHeader from '@/components/ui/TableHeader';
import CompanyModal from '@/components/company/CompanyModal';
import PlansModal from '@/components/company/PlansModal';
import PlanFormModal from '@/components/company/PlanFormModal';
import { useLifeCompanyList, useLifeCompanyPlans, useLifeCompanyActions } from '@/hooks/useLifeCompanyApi';
import { getCompanyColumns, getCompanyPlanColumns } from '@/utils/tableColumns';

export default function AddLifeCompanies() {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [activePlansCompany, setActivePlansCompany] = useState<any>(null);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planNameError, setPlanNameError] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | number | null>(null);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  // Delete Modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'company' | 'plan';
    id: string;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: 'company',
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

  // Fetch life company list using custom hook (API: company_list_life) with debounced search
  const { data: companyRes, isLoading } = useLifeCompanyList({ page, limit, search: debouncedSearch });
  const companyList = companyRes?.companyList || [];
  const totalRecords = companyRes?.totalRecords ?? companyList.length ?? 0;

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
    if (!totalRecords || totalRecords <= companyList.length) return companyList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    companyList.forEach((comp: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = comp;
      }
    });
    return padded;
  }, [companyList, totalRecords, page, limit]);

  // Fetch plans for active selected company using custom hook (API: fetch_company_plans_life)
  const activeCompanyId = activePlansCompany?.id || activePlansCompany?.company_id || '';
  const { data: planList = [], isLoading: isLoadingPlans } = useLifeCompanyPlans(activeCompanyId);

  // Life Company API actions hook (insert_company_life, insert_company_plan_life, delete_company_life, delete_company_plan_life)
  const { insertLifeCompany, insertLifeCompanyPlan, deleteLifeCompany, deleteLifeCompanyPlan } = useLifeCompanyActions();

  const handleEditCompany = (company: any) => {
    const companyId = company?.id || company?.company_id || '';
    const name = company?.name || company?.company_name || '';
    setEditingCompanyId(companyId);
    setCompanyName(name);
    setCompanyNameError('');
    setIsAddCompanyOpen(true);
  };

  const handleAddCompany = async () => {
    if (!companyName.trim()) {
      setCompanyNameError('Company Name is required');
      return;
    }

    setCompanyNameError('');
    setIsSubmitting(true);
    try {
      const success = await insertLifeCompany(companyName, editingCompanyId);
      if (success) {
        setCompanyName('');
        setCompanyNameError('');
        setEditingCompanyId(null);
        setIsAddCompanyOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlan = (plan: any) => {
    const pId = plan?.id || plan?.plan_id || '';
    const pName = plan?.name || plan?.plan_name || '';
    setEditingPlanId(pId);
    setPlanName(pName);
    setPlanNameError('');
    setIsAddPlanOpen(true);
  };

  const handleAddPlan = async () => {
    if (!planName.trim()) {
      setPlanNameError('Plan Name is required');
      return;
    }

    setPlanNameError('');
    setIsSubmittingPlan(true);

    try {
      const companyId = activePlansCompany?.id || activePlansCompany?.company_id || '';
      const success = await insertLifeCompanyPlan(companyId, planName, editingPlanId);
      if (success) {
        setPlanName('');
        setPlanNameError('');
        setEditingPlanId(null);
        setIsAddPlanOpen(false);
      }
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteModalState;
    if (!id) return;

    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));

    try {
      if (type === 'company') {
        await deleteLifeCompany(id);
      } else if (type === 'plan') {
        await deleteLifeCompanyPlan(id);
      }
    } finally {
      setDeleteModalState({ isOpen: false, type: 'company', id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(
    () =>
      getCompanyColumns({
        companyNameHeader: "Life Insurance Company Name",
        onEdit: (data: any) => handleEditCompany(data),
        onDelete: (data: any) => {
          const id = String(data?.id || data?.company_id || '');
          const name = data?.name || data?.company_name || 'this company';
          setDeleteModalState({
            isOpen: true,
            type: 'company',
            id: id,
            name: name,
            isDeleting: false,
          });
        },
        onViewPlans: (data: any) => setActivePlansCompany(data),
      }),
    []
  );

  const planColumnDefs = useMemo(
    () =>
      getCompanyPlanColumns({
        onEdit: (data: any) => handleEditPlan(data),
        onDelete: (data: any) => {
          const id = String(data?.id || data?.plan_id || '');
          const name = data?.name || data?.plan_name || 'this plan';
          setDeleteModalState({
            isOpen: true,
            type: 'plan',
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
        <title>Life Insurance Companies - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Life Insurance Companies"
          subtitle="Manage and view life insurance companies and plans"
          searchPlaceholder="Search life insurance companies..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Life Company"
          onButtonClick={() => {
            setEditingCompanyId(null);
            setCompanyName('');
            setCompanyNameError('');
            setIsAddCompanyOpen(true);
          }}
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

      {/* Common Reusable Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModalState.type === 'company' ? "Delete Life Company" : "Delete Plan"}
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      <CompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        companyName={companyName}
        setCompanyName={setCompanyName}
        companyNameError={companyNameError}
        setCompanyNameError={setCompanyNameError}
        editingCompanyId={editingCompanyId}
        isSubmitting={isSubmitting}
        onSubmit={handleAddCompany}
      />

      <PlansModal
        isOpen={!!activePlansCompany}
        onClose={() => !isAddPlanOpen && setActivePlansCompany(null)}
        activePlansCompany={activePlansCompany}
        planList={planList}
        isLoadingPlans={isLoadingPlans}
        planColumnDefs={planColumnDefs}
        onAddPlanClick={() => {
          setEditingPlanId(null);
          setPlanName('');
          setPlanNameError('');
          setIsAddPlanOpen(true);
        }}
      />

      <PlanFormModal
        isOpen={isAddPlanOpen}
        onClose={() => setIsAddPlanOpen(false)}
        planName={planName}
        setPlanName={setPlanName}
        planNameError={planNameError}
        setPlanNameError={setPlanNameError}
        editingPlanId={editingPlanId}
        isSubmittingPlan={isSubmittingPlan}
        onSubmit={handleAddPlan}
      />

    </div>
  );
}
