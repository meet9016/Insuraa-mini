import React from 'react';
import { Building2, List } from 'lucide-react';
import { TableActions } from '../components/ui/TableActions';

export const claimColumns = [
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 180,
    cellRenderer: (params: any) => (
      <span className="font-bold text-gray-900">{params.value}</span>
    ),
  },
  {
    headerName: "Insurance Type",
    field: "insuranceType",
    minWidth: 160,
    cellRenderer: (params: any) => (
      <span className="text-gray-700 font-medium">{params.value}</span>
    ),
  },
  {
    headerName: "Admitted Date",
    field: "admittedDate",
    minWidth: 140,
    cellRenderer: (params: any) => (
      <span className="text-gray-700 font-semibold">{params.value}</span>
    ),
  },
  {
    headerName: "Claim Amount",
    field: "claimAmount",
    minWidth: 140,
    cellRenderer: (params: any) => (
      <span className="font-bold text-gray-900">{params.value}</span>
    ),
  },
  {
    headerName: "Deducted Amount",
    field: "deductedAmount",
    minWidth: 150,
    cellRenderer: (params: any) => (
      <span className="font-bold text-gray-900">{params.value}</span>
    ),
  },
  {
    headerName: "Claim Status",
    field: "claimStatus",
    minWidth: 140,
    cellRenderer: (params: any) => {
      const status = params.value;
      let badgeClass = "bg-gray-100 text-gray-700";
      if (status === 'Approved' || status === 'Settled') badgeClass = "bg-emerald-100 text-emerald-700";
      if (status === 'Rejected') badgeClass = "bg-rose-100 text-rose-700";
      if (status === 'Pending' || status === 'In Process') badgeClass = "bg-amber-100 text-amber-700";

      return <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`}>{status}</span>;
    },
  },
  {
    headerName: "Action",
    field: "id",
    minWidth: 140,
    sortable: false,
    filter: false,
    cellRenderer: () => (
      <TableActions
        onView={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        editIcon="file-edit"
      />
    ),
  },
];


// DYNAMIC COLUMN

export interface SourceOfLeadColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getSourceOfLeadColumns = ({ onEdit, onDelete }: SourceOfLeadColumnProps) => [
  {
    headerName: "Source Of Lead",
    field: "name",
    minWidth: 200,
    cellRenderer: (params: any) => {
      const name = params.data?.name || params.value || '-';
      return <span className="font-semibold text-gray-800">{name}</span>;
    },
  },
  {
    headerName: "Action",
    field: "lead_product_id",
    minWidth: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      return (
        <TableActions
          data={params.data}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export interface RiderColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getRiderColumns = ({ onEdit, onDelete }: RiderColumnProps) => [
  {
    headerName: "Rider",
    field: "name",
    minWidth: 200,
    cellRenderer: (params: any) => {
      const name = params.data?.name || params.value || '-';
      return <span className="font-semibold text-gray-800">{name}</span>;
    },
  },
  {
    headerName: "Action",
    field: "rider_id",
    minWidth: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      return (
        <TableActions
          data={params.data}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export interface DocumentColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getDocumentColumns = ({ onEdit, onDelete }: DocumentColumnProps) => [
  {
    headerName: "Document",
    field: "name",
    minWidth: 200,
    cellRenderer: (params: any) => {
      const name = params.data?.name || params.value || '-';
      return <span className="font-semibold text-gray-800">{name}</span>;
    },
  },
  {
    headerName: "Action",
    field: "document_id",
    minWidth: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      return (
        <TableActions
          data={params.data}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export interface CompanyColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  onViewPlans: (data: any) => void;
  companyNameHeader?: string;
}

export const getCompanyColumns = ({ onEdit, onDelete, onViewPlans, companyNameHeader = "Company Name" }: CompanyColumnProps) => [
  {
    headerName: companyNameHeader,
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
      const plansCount = params.data?.plan_count ?? params.data?.plans_count ?? (Array.isArray(params.data?.plans) ? params.data.plans.length : 0);
      return (
        <div className="flex items-center h-full py-1">
          <button
            onClick={() => onViewPlans(params.data)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2B4399] bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 transition-all shadow-xs group"
          >
            <List size={14} className="text-[#2B4399] group-hover:scale-105 transition-transform" />
            <span>Total Plans</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-[#2B4399] rounded-full">
              {plansCount}
            </span>
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
      <TableActions
        data={params.data}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];

export interface CompanyPlanColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getCompanyPlanColumns = ({ onEdit, onDelete }: CompanyPlanColumnProps) => [
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
    cellRenderer: (params: any) => (
      <TableActions
        data={params.data}
        onEdit={onEdit}
        onDelete={onDelete}
        variant="light"
      />
    )
  }
];

export interface AgencyCodeColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getAgencyCodeColumns = ({ onEdit, onDelete }: AgencyCodeColumnProps) => [
  {
    headerName: "Name",
    field: "name",
    minWidth: 160,
    cellRenderer: (params: any) => {
      const name = params.data?.name || params.value || '-';
      return <span className="font-semibold text-gray-800">{name}</span>;
    },
  },
  {
    headerName: "Agency Code",
    field: "code",
    minWidth: 140,
    cellRenderer: (params: any) => {
      const code = params.data?.code || params.value || '-';
      return <span className="font-bold text-[#2B4399] bg-indigo-50 px-2.5 py-1 rounded-md text-xs">{code}</span>;
    },
  },
  {
    headerName: "Mobile Number",
    field: "mobile_number",
    minWidth: 140,
    cellRenderer: (params: any) => {
      const mobile = params.data?.mobile_number || params.value || '-';
      return <span className="text-gray-700">{mobile}</span>;
    },
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 180,
    cellRenderer: (params: any) => {
      const email = params.data?.email || params.value || '-';
      return <span className="text-gray-700">{email}</span>;
    },
  },
  {
    headerName: "Remark",
    field: "remark",
    minWidth: 160,
    cellRenderer: (params: any) => {
      const remark = params.data?.remark || params.value || '-';
      return <span className="text-gray-500 text-xs italic">{remark}</span>;
    },
  },
  {
    headerName: "Action",
    field: "id",
    minWidth: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => (
      <TableActions
        data={params.data}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];


