import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, FileText } from 'lucide-react';

interface MotorQuotationRecord {
  id: string;
  quotationNo: string;
  customerName: string;
  mobile: string;
  vehicle: string;
  vehicleNumber: string;
  quotes: string;
  lowestPremium: string;
  createdOn: string;
}

const mockData: MotorQuotationRecord[] = [
  {
    id: "1",
    quotationNo: "MOT-1001",
    customerName: "Sharad",
    mobile: "09909929293",
    vehicle: "MITSUBISHI",
    vehicleNumber: "8596749536",
    quotes: "2 Quote(S)",
    lowestPremium: "₹5,020",
    createdOn: "17-06-2026"
  }
];

export default function MotorQuotationList() {
  const router = useRouter();

  const columns: Column<MotorQuotationRecord>[] = [
    {
      key: "select",
      label: "",
      render: () => (
        <input type="checkbox" className="rounded border-gray-300 text-[#2B4399] focus:ring-[#2D3591]" />
      )
    },
    {
      key: "quotationNo",
      label: "Quotation No",
      render: (row) => <span className="font-bold text-gray-900">{row.quotationNo}</span>
    },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{row.customerName}</span>
          <span className="text-xs text-gray-400 mt-0.5">{row.mobile}</span>
        </div>
      )
    },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{row.vehicle}</span>
          <span className="text-xs text-gray-400 mt-0.5">{row.vehicleNumber}</span>
        </div>
      )
    },
    {
      key: "quotes",
      label: "Quotes",
      render: (row) => <span className="text-gray-700 font-medium">{row.quotes}</span>
    },
    {
      key: "lowestPremium",
      label: "Lowest Premium",
      render: (row) => <span className="font-bold text-gray-900">{row.lowestPremium}</span>
    },
    {
      key: "createdOn",
      label: "Created On",
      render: (row) => <span className="text-gray-700 font-medium">{row.createdOn}</span>
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 bg-[#0ea5e9] text-white rounded hover:bg-[#0284c7] transition-colors" title="PDF">
            <FileText size={14} />
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
        <title>Motor Quotation - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Motor Quotation"
          columns={columns}
          data={mockData}
          addLabel="Add Motor Quotation"
          onAdd={() => router.push('/quotation/motor/add')}
        />
      </div>
    </div>
  );
}
