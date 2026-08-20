import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  List,
  X,
  Search
} from 'lucide-react';
import AgGridTable from '@/components/ui/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import CompanyModal from '@/components/company/CompanyModal';
import PlansModal from '@/components/company/PlansModal';
import PlanFormModal from '@/components/company/PlanFormModal';
import { useCompanyList, useCompanyPlans, useCompanyActions } from '@/hooks/useCompanyApi';

export default function AddCompanies() {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState<string>('');
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

  // Fetch company list using custom hook
  const { data: companyList = [], isLoading } = useCompanyList({ page, limit, search });

  // Fetch plans for active selected company using custom hook
  const activeCompanyId = activePlansCompany?.id || activePlansCompany?.company_id || '';
  const { data: planList = [], isLoading: isLoadingPlans } = useCompanyPlans(activeCompanyId);

  // Company API actions hook
  const { insertCompany, insertCompanyPlan, deleteCompany, deleteCompanyPlan } = useCompanyActions();

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
      const success = await insertCompany(companyName, editingCompanyId);
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
      const success = await insertCompanyPlan(companyId, planName, editingPlanId);
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
        await deleteCompany(id);
      } else if (type === 'plan') {
        await deleteCompanyPlan(id);
      }
    } finally {
      setDeleteModalState({ isOpen: false, type: 'company', id: '', name: '', isDeleting: false });
    }
  };

  const columnDefs = useMemo(() => [
    {
      headerName: "Company Name",
      field: "name",
      minWidth: 250,
      cellRenderer: (params: any) => {
        const name = params.data?.name || params.data?.company_name || params.value || '-';
        return (
          <div className="font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={16} className="text-[#2B4399]" />
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      headerName: "Plans",
      field: "plans",
      minWidth: 180,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const plansCount = params.data?.plans_count ?? (Array.isArray(params.data?.plans) ? params.data.plans.length : 0);
        return (
          <div className="flex items-center h-full py-1">
            <button
              onClick={() => setActivePlansCompany(params.data)}
              className="bg-[#2F439D] hover:bg-[#263784] text-white text-[12px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <List size={14} /> Total Plans {plansCount}
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Action",
      field: "id",
      minWidth: 140,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 h-full py-1">
          <button
            onClick={() => handleEditCompany(params.data)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded transition-colors shadow-sm"
            title="Edit"
          >
            <Edit size={14} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => {
              const id = String(params.data?.id || params.data?.company_id || '');
              const name = params.data?.name || params.data?.company_name || 'this company';
              setDeleteModalState({
                isOpen: true,
                type: 'company',
                id: id,
                name: name,
                isDeleting: false,
              });
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded transition-colors shadow-sm"
            title="Delete"
          >
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ], []);

  const planColumnDefs = useMemo(() => [
    {
      headerName: "#",
      field: "id",
      width: 80,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full py-1">
          <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#2B4399] text-xs font-bold flex items-center justify-center">
            {params.node.rowIndex + 1}
          </div>
        </div>
      )
    },
    {
      headerName: "Plan Name",
      field: "name",
      minWidth: 250,
      cellRenderer: (params: any) => {
        const name = params.data?.name || params.data?.plan_name || params.value || '-';
        return (
          <span className="font-semibold text-gray-800">{name}</span>
        );
      }
    },
    {
      headerName: "Action",
      field: "action",
      minWidth: 140,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const id = String(params.data?.id || params.data?.plan_id || '');
        const name = params.data?.name || params.data?.plan_name || 'this plan';
        return (
          <div className="flex items-center gap-2 h-full py-1">
            <button
              onClick={() => handleEditPlan(params.data)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 p-1.5 rounded transition-all"
              title="Edit"
            >
              <Edit size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => {
                setDeleteModalState({
                  isOpen: true,
                  type: 'plan',
                  id: id,
                  name: name,
                  isDeleting: false,
                });
              }}
              className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 p-1.5 rounded transition-all"
              title="Delete"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          </div>
        );
      }
    }
  ], []);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col">
      <Head>
        <title>Companies - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-gray-200 bg-[#F2F7FF]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and view insurance companies and plans</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[240px] pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingCompanyId(null);
                setCompanyName('');
                setCompanyNameError('');
                setIsAddCompanyOpen(true);
              }}
              className="px-5 py-2.5 bg-[#2B4399] text-white text-sm font-bold rounded-xl shadow-md transition-all hover:bg-[#203378] flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <AgGridTable rowData={companyList} columnDefs={columnDefs as any} loading={isLoading} />
        </div>
      </div>

      {/* Common Reusable Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModalState.type === 'company' ? "Delete Company" : "Delete Plan"}
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
