import React from 'react';
import { Building2, List, User, Eye, FileEdit, Trash2, Calendar, Clock } from 'lucide-react';
import { TableActions } from '../components/ui/tableaggrid/TableActions';

export const claimColumns = [
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 180,
    cellRenderer: (params: any) => (
      <span className="font-semibold text-gray-900">{params.value}</span>
    ),
  },
  {
    headerName: "Insurance Type",
    field: "insuranceType",
    minWidth: 160,
    cellRenderer: (params: any) => (
      <span className="text-gray-700 font-semibold">{params.value}</span>
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

      return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>{status}</span>;
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
        onView={() => { }}
        onEdit={() => { }}
        onDelete={() => { }}
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const name = params.data?.name || params.data?.company_name || params.value || '-';
      return (
        <div className="font-semibold text-gray-900 flex items-center gap-2">
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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

export interface CompanyPlanColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getCompanyPlanColumns = ({ onEdit, onDelete }: CompanyPlanColumnProps) => [
  {
    headerName: "Plan Name",
    field: "name",
    minWidth: 250,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const name = params.data?.name || params.data?.plan_name || params.value || '-';
      return (
        <span className="font-semibold text-gray-800">{name}</span>
      );
    }
  },
  {
    headerName: "Action",
    field: "id",
    minWidth: 140,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <TableActions
          data={params.data}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    }
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
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const name = params.data?.name || params.value || '-';
      return <span className="font-semibold text-gray-800">{name}</span>;
    },
  },
  {
    headerName: "Agency Code",
    field: "code",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const code = params.data?.code || params.value || '-';
      return <span className="font-bold text-[#2B4399] bg-indigo-50 px-2.5 py-1 rounded-md text-xs">{code}</span>;
    },
  },
  {
    headerName: "Mobile Number",
    field: "mobile_number",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const mobile = params.data?.mobile_number || params.value || '-';
      return <span className="text-gray-700">{mobile}</span>;
    },
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 180,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const email = params.data?.email || params.value || '-';
      return <span className="text-gray-700">{email}</span>;
    },
  },
  {
    headerName: "Remark",
    field: "remark",
    minWidth: 160,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
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

export interface CustomerColumnProps {
  onView: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getCustomerColumns = ({ onView, onEdit, onDelete }: CustomerColumnProps) => [
  {
    headerName: "Customer Name",
    field: "name",
    minWidth: 200,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const name = params.data?.name || params.data?.full_name || `${params.data?.first_name || ''} ${params.data?.last_name || ''}`.trim() || params.value || '-';
      return (
        <div className="font-semibold text-gray-900 flex items-center gap-2">
          <User size={16} className="text-[#2B4399]" />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    headerName: "Group Code",
    field: "group_code",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <span className="text-gray-700 font-medium">
          {params.data?.group_code || params.data?.groupCode || params.value || '-'}
        </span>
      );
    },
  },
  {
    headerName: "Mobile Number",
    field: "customer_number",
    minWidth: 150,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <span className="text-gray-700 font-medium">
          {params.data?.customer_number || params.data?.number || params.data?.phone || params.value || '-'}
        </span>
      );
    },
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 180,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <span className="text-gray-700 font-medium">{params.value || '-'}</span>
      );
    },
  },
  {
    headerName: "Type",
    field: "customer_type",
    minWidth: 130,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const typeVal = params.data?.customer_type_name || params.data?.type || params.value || 'Individual';
      return (
        <span className="bg-[#e7f0fa] text-[#2F439D] font-medium text-xs px-2.5 py-1 rounded-full">
          {typeVal}
        </span>
      );
    },
  },
  {
    headerName: "Action",
    field: "id",
    minWidth: 140,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <TableActions
          data={params.data}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export interface LeadColumnProps {
  onView?: (data: any) => void;
  onNotes?: (data: any) => void;
  onReminders?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export const getLeadColumns = ({ onView, onNotes, onReminders, onEdit, onDelete }: LeadColumnProps = {}) => [
  {
    headerName: "ID",
    field: "lead_id",
    minWidth: 110,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const idVal = params.data?.lead_id || params.data?.id || params.value || '-';
      return <span className="text-gray-500 font-bold">#LEAD-{idVal}</span>;
    },
  },
  {
    headerName: "Customer Name",
    field: "full_name",
    minWidth: 180,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const name = params.data?.full_name || params.data?.name || params.value || '-';
      return <span className="font-bold text-[#2B4399]">{name}</span>;
    },
  },
  {
    headerName: "Phone",
    field: "number",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const phone = params.data?.number || params.data?.phone || params.value || '-';
      return <span className="font-bold text-gray-600">{phone}</span>;
    },
  },
  {
    headerName: "Whatsapp",
    field: "whatsapp_number",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const whatsapp = params.data?.whatsapp_number || params.value || '-';
      return <span className="text-gray-600 font-medium">{whatsapp}</span>;
    },
  },
  {
    headerName: "Product",
    field: "product_name",
    minWidth: 150,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const prod = params.data?.product_name || params.data?.type || params.value || '-';
      return <span className="font-semibold text-gray-800">{prod}</span>;
    },
  },
  {
    headerName: "Business Group",
    field: "business_group_name",
    minWidth: 160,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const bg = params.data?.business_group_name || params.data?.agent || params.data?.reference || params.value || 'Direct';
      return <span className="font-bold text-gray-600">{bg}</span>;
    },
  },
  {
    headerName: "Status",
    field: "status_name",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const statusName = params.data?.status_name || params.data?.status || params.value || '-';
      const statusColor = params.data?.status_color || '#2B4399';
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold border shadow-2xs"
          style={{
            backgroundColor: `${statusColor}18`,
            color: statusColor,
            borderColor: `${statusColor}40`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}></span>
          {statusName}
        </span>
      );
    },
  },
  {
    headerName: "Date",
    field: "date",
    minWidth: 130,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return <span className="text-gray-500 font-bold">{params.value || '-'}</span>;
    },
  },
  {
    headerName: "Action",
    field: "lead_id",
    minWidth: 150,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <TableActions
          data={params.data}
          onNotes={onNotes || onView}
          onReminders={onReminders}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export interface NoteColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getNoteColumns = ({ onEdit, onDelete }: NoteColumnProps) => [
  {
    headerName: "DATE",
    field: "date",
    width: 180,
    cellRenderer: (params: any) => (
      <div className="flex items-center h-full">
        <span className="inline-flex items-center gap-1.5 bg-[#EEF2FF] text-[#2B4399] border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
          <Calendar size={13} className="text-[#2B4399]" />
          {params.value}
        </span>
      </div>
    ),
  },
  {
    headerName: "REMARK",
    field: "remark",
    flex: 1,
    cellRenderer: (params: any) => (
      <div className="flex items-center h-full text-sm font-medium text-gray-700">
        {params.value}
      </div>
    ),
  },
  {
    headerName: "ACTION",
    field: "id",
    width: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => (
      <TableActions
        data={params.data}
        onEdit={onEdit}
        onDelete={onDelete}
        variant="light"
      />
    ),
  },
];

export interface ReminderColumnProps {
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

export const getReminderColumns = ({ onEdit, onDelete }: ReminderColumnProps) => [
  {
    headerName: "DATE",
    field: "date",
    width: 160,
    cellRenderer: (params: any) => (
      <div className="flex items-center h-full">
        <span className="inline-flex items-center gap-1.5 bg-[#EEF2FF] text-[#2B4399] border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full">
          <Calendar size={13} />
          {params.value}
        </span>
      </div>
    ),
  },
  {
    headerName: "TIME",
    field: "time",
    width: 150,
    cellRenderer: (params: any) => (
      <div className="flex items-center h-full">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold px-2.5 py-1 rounded-full">
          <Clock size={13} />
          {params.value}
        </span>
      </div>
    ),
  },
  {
    headerName: "MESSAGE",
    field: "message",
    flex: 1,
    cellRenderer: (params: any) => (
      <div className="flex items-center h-full text-sm font-medium text-gray-700">
        {params.value}
      </div>
    ),
  },
  {
    headerName: "ACTION",
    field: "id",
    width: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => (
      <TableActions
        data={params.data}
        onEdit={onEdit}
        onDelete={onDelete}
        variant="light"
      />
    ),
  },
];

export interface LifeInsuranceColumnProps {
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export const getLifeInsuranceColumns = ({ onView, onEdit, onDelete }: LifeInsuranceColumnProps) => [
  {
    headerName: "Customer Name",
    field: "customer_name",
    minWidth: 200,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const data = params.data;
      const custName = data.customer_name || (data.first_name ? `${data.first_name || ''} ${data.last_name || ''}`.trim() : (data.name || 'N/A'));
      const mobile = data.customer_mobile || data.mobile || data.customer_number || 'N/A';
      const code = data.customer_code || data.code || (data.customer_id ? `C${data.customer_id}` : 'N/A');
      const addedBy = data.added_by || data.addedBy || 'Self';

      return (
        <div className="flex flex-col justify-center h-full py-1 leading-snug">
          <span className="font-bold text-gray-900 text-sm leading-snug truncate">{custName}</span>
          <span className="text-[11px] text-gray-500">Mo: {mobile}</span>
          <span className="text-[10px] bg-blue-50 text-[#2B4399] px-1.5 py-0.5 rounded w-fit font-bold my-0.5">Code: {code}</span>
          {/* <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <User size={11} className="text-[#2B4399]" /> Added by {addedBy}
          </div> */}
        </div>
      );
    },
  },
  {
    headerName: "Policy Number",
    field: "policy_number",
    minWidth: 160,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return <div className="flex items-center h-full font-bold text-gray-900">{params.value || '-'}</div>;
    },
  },
  {
    headerName: "Policy Date",
    field: "policy_login_date",
    minWidth: 210,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const data = params.data;
      return (
        <div className="flex flex-col justify-center h-full gap-0.5 text-[11px] py-1 leading-tight">
          <div className="flex items-center gap-2"><span className="text-gray-500 font-medium min-w-[85px]">Start Date:</span> <span className="font-bold text-gray-900">{data.policy_start_date || data.startDate || '-'}</span></div>
          <div className="flex items-center gap-2"><span className="text-gray-500 font-medium min-w-[85px]">Premium End:</span> <span className="font-bold text-gray-900">{data.policy_end_date || data.premiumEndDate || '-'}</span></div>
          {(data.policy_login_date || data.loginDate) && (
            <div className="flex items-center gap-2"><span className="text-gray-500 font-medium min-w-[85px]">Login Date:</span> <span className="font-bold text-gray-900">{data.policy_login_date || data.loginDate}</span></div>
          )}
        </div>
      );
    },
  },
  {
    headerName: "Company",
    field: "company_name",
    minWidth: 180,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const company = params.data.company_name || params.data.companies_name || params.data.company || '-';
      return <div className="flex items-center h-full font-semibold text-gray-700">{company}</div>;
    },
  },
  {
    headerName: "Plan Name",
    field: "plan_name",
    minWidth: 160,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return <div className="flex items-center h-full text-gray-700">{params.value || '-'}</div>;
    },
  },
  {
    headerName: "Total Premium",
    field: "total_premium",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const val = params.value || params.data.net_premium || '0';
      return <div className="flex items-center h-full text-gray-700 font-medium">₹{val}</div>;
    },
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    minWidth: 130,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return <div className="flex items-center h-full font-bold text-gray-900">₹{params.value || '0'}</div>;
    },
  },
  {
    headerName: "Sum Assured",
    field: "sum_assured",
    minWidth: 140,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return <div className="flex items-center h-full font-bold text-gray-900">₹{params.value || '0'}</div>;
    },
  },
  {
    headerName: "Plan Type",
    field: "plan_type",
    minWidth: 130,
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      const rawType = String(params.data.plan_type_name || params.value || '');
      let displayType = rawType;
      if (rawType === '1') displayType = 'Fresh';
      else if (rawType === '2' || rawType === '3') displayType = 'Renewal';

      let badgeColor = "bg-blue-50 text-blue-600";
      if (displayType === 'Port') badgeColor = "bg-amber-50 text-amber-600";
      if (displayType === 'Renewal') badgeColor = "bg-emerald-50 text-emerald-600";
      return (
        <div className="flex items-center h-full">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${badgeColor}`}>{displayType || 'Fresh'}</span>
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
    cellRenderer: (params: any) => {
      if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
      return (
        <div className="flex items-center h-full">
          <TableActions
            data={params.data}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      );
    },
  },
];


