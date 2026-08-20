import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';
import AgGridTable from '@/components/ui/AgGridTable';
import { claimColumns } from '@/utils/tableColumns';

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

  const columnDefs = useMemo(() => claimColumns, []);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)]">
      <Head>
        <title>Claim Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-gray-200 bg-[#F2F7FF]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Claim Management</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and view your claim records
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/claim/add')}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Add Claim</span>
          </button>
        </div>

        <div className="w-full">
          <AgGridTable rowData={mockData} columnDefs={columnDefs as any} />
        </div>
      </div>
    </div>
  );
}
