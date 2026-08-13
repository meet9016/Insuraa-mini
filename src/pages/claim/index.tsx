import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
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

  const columns: Column<ClaimRecord>[] = [
    {
      key: "select",
      label: "",
      render: () => (
        <input type="checkbox" className="rounded border-gray-300 text-[#2B4399] focus:ring-[#2D3591]" />
      )
    },
    {
      key: "clientName",
      label: "Client Name",
      render: (row) => <span className="font-bold text-gray-900">{row.clientName}</span>
    },
    { 
      key: "insuranceType", 
      label: "Insurance Type", 
      render: (row) => <span className="text-gray-700 font-medium">{row.insuranceType}</span> 
    },
    { 
      key: "admittedDate", 
      label: "Admitted Date", 
      render: (row) => <span className="text-gray-700 font-semibold">{row.admittedDate}</span> 
    },
    { 
      key: "claimAmount", 
      label: "Claim Amount", 
      render: (row) => <span className="font-bold text-gray-900">{row.claimAmount}</span> 
    },
    { 
      key: "deductedAmount", 
      label: "Deducted Amount", 
      render: (row) => <span className="font-bold text-gray-900">{row.deductedAmount}</span> 
    },
    {
      key: "claimStatus",
      label: "Claim Status",
      render: (row) => {
        let badgeClass = "bg-gray-100 text-gray-700";
        if (row.claimStatus === 'Approved' || row.claimStatus === 'Settled') badgeClass = "bg-emerald-100 text-emerald-700";
        if (row.claimStatus === 'Rejected') badgeClass = "bg-rose-100 text-rose-700";
        if (row.claimStatus === 'Pending' || row.claimStatus === 'In Process') badgeClass = "bg-amber-100 text-amber-700";

        return <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`}>{row.claimStatus}</span>;
      }
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <div className="flex items-center gap-1.5">
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
      )
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] ">
      <Head>
        <title>Claim Management - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Claim Management"
          columns={columns}
          data={mockData}
          addLabel="Add Claim"
          onAdd={() => router.push('/claim/add')}
        />
      </div>
    </div>
  );
}
