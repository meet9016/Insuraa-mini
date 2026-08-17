import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/AgGridTable';
import { ColDef } from 'ag-grid-community';
import { FileEdit, Trash2, Eye } from 'lucide-react';


interface ClaimRecord {
  id: string;
  clientName: string;
  insuranceType: string;
  admittedDate: string;
  claimAmount: string;
  deductedAmount: string;
  claimStatus: string;
}

const mockData: ClaimRecord[] = [
  {
    id: "1",
    clientName: "Rahul Sharma",
    insuranceType: "Health Insurance",
    admittedDate: "10-08-2026",
    claimAmount: "₹50,000.00",
    deductedAmount: "₹5,000.00",
    claimStatus: "Pending"
  },
  {
    id: "2",
    clientName: "Priya Desai",
    insuranceType: "Motor Insurance",
    admittedDate: "05-08-2026",
    claimAmount: "₹12,500.00",
    deductedAmount: "₹0.00",
    claimStatus: "Approved"
  },
  {
    id: "3",
    clientName: "Amit Kumar",
    insuranceType: "Health Insurance",
    admittedDate: "28-07-2026",
    claimAmount: "₹1,20,000.00",
    deductedAmount: "₹15,000.00",
    claimStatus: "Settled"
  },
  {
    id: "4",
    clientName: "Sneha Patel",
    insuranceType: "Life Insurance",
    admittedDate: "15-07-2026",
    claimAmount: "₹5,00,000.00",
    deductedAmount: "₹0.00",
    claimStatus: "Rejected"
  },
  {
    id: "5",
    clientName: "Vikram Singh",
    insuranceType: "Motor Insurance",
    admittedDate: "02-08-2026",
    claimAmount: "₹8,500.00",
    deductedAmount: "₹500.00",
    claimStatus: "In Process"
  }
];

export default function ClaimList() {
  const router = useRouter();

  const columnDefs = useMemo<ColDef<ClaimRecord>[]>(() => [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      pinned: "left",
      resizable: false,
      filter: false,
      sortable: false,
      valueGetter: () => "",
    },
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
  ], []);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-4 sm:p-6">
      <Head>
        <title>Claim Management - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AgGridTable<ClaimRecord>
          title="Claim Management"
          subtitle="Manage and view your claim records with AG Grid Enterprise"
          columnDefs={columnDefs}
          rowData={mockData}
          addLabel="Add Claim"
          onAdd={() => router.push('/claim/add')}
          enableExport={true}
          enableSearch={true}
        />
      </div>
    </div>
  );
}
