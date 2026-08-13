import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, Eye, User, Users } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  familyMembers: string; // e.g., "No Family", "1 Member"
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
    familyMembers: "No Family",
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
    familyMembers: "No Family",
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
    familyMembers: "1 Member",
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
    familyMembers: "No Family",
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
    familyMembers: "No Family",
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
            <span className="text-gray-400 font-normal">&gt;</span> {row.name}
          </span>
          <span className={`text-[10px] flex items-center gap-1 mt-0.5 ml-4 ${row.familyMembers === 'No Family' ? 'text-gray-400' : 'bg-amber-100 text-amber-700 px-1.5 rounded font-bold w-fit'}`}>
            <User size={10} /> {row.familyMembers}
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
      key: "agent",
      label: "Agent",
      render: (row) => (
        <div className="flex flex-col text-[13px]">
          {row.agentName && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{row.agentName}</span>
              {row.agentCount && (
                <span className="text-[10px] bg-orange-400 text-white font-bold px-1.5 rounded-full flex items-center gap-1">
                  <Users size={8} /> {row.agentCount} Agents
                </span>
              )}
            </div>
          )}
          {row.subAgent && (
            <span className="text-gray-500">Sub: {row.subAgent}</span>
          )}
        </div>
      )
    },
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <span className="bg-blue-100/50 text-[#2B4399] text-xs font-bold px-3 py-1 rounded-full">
          {row.type}
        </span>
      )
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
          <button className="p-1.5 bg-[#0d9488] text-white rounded hover:bg-[#0f766e] transition-colors" title="Profile">
            <User size={14} />
          </button>
          <button className="p-1.5 bg-[#3730a3] text-white rounded hover:bg-[#312e81] transition-colors" title="Family">
            <Users size={14} />
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
