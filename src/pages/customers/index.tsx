import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, Eye, User, Users } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;

  groupCode: string;
  number: string;
  email: string;
  agentName: string;
  subAgent: string;
  agentCount?: number; // For the "3 Agents" badge
  type: string; // e.g., "Software"
}

const mockData: CustomerRecord[] = [
  {
    id: "1",
    name: "PANKAJ MURLIDHAR POREDDIWAR",

    groupCode: "PMP5241",
    number: "9850185241",
    email: "",
    agentName: "",
    subAgent: "",
    type: "Software"
  },
  {
    id: "2",
    name: "Bhvcgg Vgg Vbvvv",

    groupCode: "BVV0596",
    number: "9586410596",
    email: "",
    agentName: "",
    subAgent: "",
    type: "Software"
  },
  {
    id: "3",
    name: "Krish Sharama",

    groupCode: "KS6699",
    number: "6262336699",
    email: "Krish@Gmail.Com",
    agentName: "Demo",
    subAgent: "BHAVIK THAKKAR",
    agentCount: 3,
    type: "Software"
  },
  {
    id: "4",
    name: "Devang Sharama",

    groupCode: "DS4566",
    number: "7532584566",
    email: "",
    agentName: "Kiran Mayee Naik",
    subAgent: "Satya Prakash",
    type: "Software"
  },
  {
    id: "5",
    name: "Shopno Demo",

    groupCode: "SD4444",
    number: "4444444444",
    email: "Pp.Shopno@Gmail.Com",
    agentName: "Demo",
    subAgent: "",
    type: "Software"
  }
];

export default function CustomerList() {
  const router = useRouter();

  const columns: Column<CustomerRecord>[] = [
    {
      key: "select",
      label: "",
      render: () => (
        <input type="checkbox" className="rounded border-gray-300 text-[#2B4399] focus:ring-[#2D3591]" />
      )
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-tight flex items-center gap-2">
            <span className="text-gray-400 font-normal"></span> {row.name}
          </span>

        </div>
      )
    },
    {
      key: "groupCode",
      label: "Group Code",
      render: (row) => <span className="text-gray-700 font-medium">{row.groupCode}</span>
    },
    {
      key: "number",
      label: "Number",
      render: (row) => <span className="text-gray-700 font-medium">{row.number}</span>
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-gray-700 font-medium">{row.email}</span>
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
        <title>Customer Management - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Customer Management"
          columns={columns}
          data={mockData}
          addLabel="Add Customer"
          onAdd={() => router.push('/customers/add')}
        />
      </div>
    </div>
  );
}
