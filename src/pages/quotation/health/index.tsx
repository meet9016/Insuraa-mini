import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, FileText } from 'lucide-react';

interface HealthQuotationRecord {
  id: string;
  quotationNo: string;
  customerName: string;
  mobile: string;
  plan: string;
  quotes: string;
  members: string;
  lowestPremium: string;
  createdOn: string;
}

const mockData: HealthQuotationRecord[] = [
  {
    id: "1",
    quotationNo: "QTN-10007",
    customerName: "Manish R Patel",
    mobile: "7359679117",
    plan: "Family Floater (2A + 2C)",
    quotes: "3 Quote(S)",
    members: "0 Member(S)",
    lowestPremium: "₹40,686",
    createdOn: "21-07-2026"
  },
  {
    id: "2",
    quotationNo: "QTN-10006",
    customerName: "Piyushbhai",
    mobile: "9978024598",
    plan: "Family Floater (2A + 2C)",
    quotes: "1 Quote(S)",
    members: "4 Member(S)",
    lowestPremium: "₹12,330",
    createdOn: "09-07-2026"
  },
  {
    id: "3",
    quotationNo: "QTN-10005",
    customerName: "Mishri Mehta",
    mobile: "8200545423",
    plan: "Individual (2A + 2C)",
    quotes: "2 Quote(S)",
    members: "0 Member(S)",
    lowestPremium: "₹4,000",
    createdOn: "26-06-2026"
  },
  {
    id: "4",
    quotationNo: "QTN-10004",
    customerName: "Jagdish Bhai",
    mobile: "8956237441",
    plan: "Family Floater (2A + 2C)",
    quotes: "2 Quote(S)",
    members: "1 Member(S)",
    lowestPremium: "₹1,000",
    createdOn: "25-06-2026"
  },
  {
    id: "5",
    quotationNo: "QTN-10003",
    customerName: "Jinal",
    mobile: "9925446125",
    plan: "Family Floater (0)",
    quotes: "1 Quote(S)",
    members: "1 Member(S)",
    lowestPremium: "₹21,000",
    createdOn: "24-06-2026"
  },
  {
    id: "6",
    quotationNo: "QTN-10002",
    customerName: "Haresh Italiya",
    mobile: "9723583059",
    plan: "Family Floater (2A + 2C)",
    quotes: "1 Quote(S)",
    members: "4 Member(S)",
    lowestPremium: "₹24,200",
    createdOn: "18-06-2026"
  },
  {
    id: "7",
    quotationNo: "QTN-10001",
    customerName: "Rameshbhai",
    mobile: "7418529633",
    plan: "Individual (1A)",
    quotes: "2 Quote(S)",
    members: "1 Member(S)",
    lowestPremium: "₹5,000",
    createdOn: "17-06-2026"
  }
];

export default function HealthQuotationList() {
  const router = useRouter();

  const columns: Column<HealthQuotationRecord>[] = [
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
      key: "plan", 
      label: "Plan", 
      render: (row) => <span className="text-gray-700 font-medium">{row.plan}</span> 
    },
    { 
      key: "quotes", 
      label: "Quotes", 
      render: (row) => <span className="text-gray-700 font-medium">{row.quotes}</span> 
    },
    { 
      key: "members", 
      label: "Members", 
      render: (row) => <span className="text-gray-700 font-medium">{row.members}</span> 
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
        <title>Health Quotation - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Health Quotation"
          columns={columns}
          data={mockData}
          addLabel="Add Health Quotation"
          onAdd={() => router.push('/quotation/health/add')}
        />
      </div>
    </div>
  );
}
