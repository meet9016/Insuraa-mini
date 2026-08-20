import React from 'react';
import { FileEdit, Trash2, Eye } from 'lucide-react';

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
      <div className="flex items-center gap-1.5 h-full py-1">
        <button className="p-1.5 bg-[#0ea5e9] text-white rounded hover:bg-[#0284c7] transition-colors" title="View">
          <Eye size={14} />
        </button>
        <button className="p-1.5 bg-[#10b981] text-white rounded hover:bg-[#059669] transition-colors" title="Edit">
          <FileEdit size={14} />
        </button>
        <button className="p-1.5 bg-[#f43f5e] text-white rounded hover:bg-[#e11d48] transition-colors" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
];
