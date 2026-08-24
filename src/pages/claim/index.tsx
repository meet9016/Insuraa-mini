import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
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
        <TableHeader 
          title="Claim Management"
          subtitle="Manage and view your claim records"
          buttonText="Add Claim"
          onButtonClick={() => router.push('/claim/add')}
          showSearch={false}
        />

        <div className="w-full">
          <AgGridTable rowData={mockData} columnDefs={columnDefs as any} />
        </div>
      </div>
    </div>
  );
}
