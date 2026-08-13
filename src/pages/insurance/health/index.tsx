import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, Send, User, Eye } from 'lucide-react';

interface HealthInsuranceRecord {
  id: string;
  customerName: string;
  mobile: string;
  customerCode: string;
  addedBy: string; // e.g. Self
  agent: string;
  agentAddedBy: string; // e.g. Insuraa
  insuranceType: string; // e.g. Single, Floater, Group
  company: string;
  planName: string;
  planType: string; // e.g. Fresh, Port, Renewal
  policyNumber: string;
  sumAssured: string;
  netPremium: string;
  gstAmount: string;
  totalPremium: string;
  loginDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

const mockData: HealthInsuranceRecord[] = [
  {
    id: "1",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Single",
    company: "Care Health Insurance Company Limited",
    planName: "Care",
    planType: "Fresh",
    policyNumber: "58460089",
    sumAssured: "₹1,000,000.00",
    netPremium: "₹29,759.57",
    gstAmount: "₹5,356.72",
    totalPremium: "₹35,116.00",
    loginDate: "05-09-2025",
    startDate: "05-09-2025",
    endDate: "04-09-2026",
    status: "Active"
  },
  {
    id: "2",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Floater",
    company: "Bajaj Life Insurance Limited",
    planName: "Bajaj Life ETouch II",
    planType: "Port",
    policyNumber: "369852",
    sumAssured: "₹12,222.00",
    netPremium: "₹1,245.00",
    gstAmount: "₹120,000.00",
    totalPremium: "₹121,245.00",
    loginDate: "09-07-2026",
    startDate: "26-07-2026",
    endDate: "25-07-2027",
    status: "Active"
  },
  {
    id: "3",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Bhavesh Bhai",
    insuranceType: "Floater",
    company: "HDFC ERGO General Insurance Company Limited",
    planName: "HDFC ERGO Optima Secure",
    planType: "Fresh",
    policyNumber: "23030161252400000010",
    sumAssured: "₹5,000.00",
    netPremium: "₹23,950.00",
    gstAmount: "₹0.00",
    totalPremium: "₹23,950.00",
    loginDate: "15-07-2026",
    startDate: "27-03-2026",
    endDate: "26-03-2027",
    status: "Active"
  },
  {
    id: "4",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Floater",
    company: "Bajaj Life Insurance Limited",
    planName: "Bajaj Life iSecure",
    planType: "Port",
    policyNumber: "66264646",
    sumAssured: "₹50,000.00",
    netPremium: "₹50,000.00",
    gstAmount: "₹18.00",
    totalPremium: "₹50,018.00",
    loginDate: "02-07-2026",
    startDate: "02-07-2026",
    endDate: "01-07-2027",
    status: "Active"
  },
  {
    id: "5",
    customerName: "Sharad Test Demo",
    mobile: "8989898989",
    customerCode: "STD8989",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Floater",
    company: "Niva Bupa Health Insurance Company Limited",
    planName: "Niva Bupa ReAssure 3.0",
    planType: "Fresh",
    policyNumber: "35089958202500",
    sumAssured: "₹94,848.00",
    netPremium: "₹3,941.01",
    gstAmount: "₹0.00",
    totalPremium: "₹3,941.01",
    loginDate: "09-06-2026",
    startDate: "28-07-2023",
    endDate: "27-07-2024",
    status: "Lapsed"
  },
  {
    id: "6",
    customerName: "Amit Mehta",
    mobile: "9876543212",
    customerCode: "AM3212",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Group",
    company: "Bajaj Life Insurance Limited",
    planName: "Bajaj Life ETouch II",
    planType: "Renewal",
    policyNumber: "1234569633",
    sumAssured: "₹100,000.00",
    netPremium: "₹5,000.00",
    gstAmount: "₹0.00",
    totalPremium: "₹5,000.00",
    loginDate: "15-08-2026",
    startDate: "15-08-2026",
    endDate: "14-06-2027",
    status: "Active"
  },
  {
    id: "7",
    customerName: "Amit Mehta",
    mobile: "9876543212",
    customerCode: "AM3212",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    insuranceType: "Group",
    company: "Star Health And Allied Insurance Company Limited",
    planName: "Oriental Two Wheeler Insurance",
    planType: "Fresh",
    policyNumber: "HI-2024-003",
    sumAssured: "₹1,000,000.00",
    netPremium: "₹22,000.00",
    gstAmount: "₹0.00",
    totalPremium: "₹22,000.00",
    loginDate: "20-02-2024",
    startDate: "20-02-2024",
    endDate: "19-02-2025",
    status: "Renewed"
  }
];

export default function HealthInsuranceList() {
  const router = useRouter();

  const columns: Column<HealthInsuranceRecord>[] = [
    {
      key: "select",
      label: "",
      render: () => (
        <input type="checkbox" className="rounded border-gray-300 text-[#2B4399] focus:ring-[#2D3591]" />
      )
    },
    {
      key: "customerName",
      label: "Customer Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.customerName}</span>
          <span className="text-xs text-gray-500">Mo: {row.mobile}</span>
          <span className="text-[10px] bg-blue-50 text-[#2B4399] px-1.5 py-0.5 rounded w-fit mt-0.5">Code: {row.customerCode}</span>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <User size={12} className="text-[#2B4399]"/> Added by {row.addedBy}
          </div>
        </div>
      )
    },
    {
      key: "agent",
      label: "Agent",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">{row.agent}</span>
          <span className="text-[10px] bg-blue-50 text-[#2B4399] px-1.5 py-0.5 rounded w-fit mt-0.5">Added: {row.agentAddedBy}</span>
        </div>
      )
    },
    {
      key: "insuranceType",
      label: "Insurance Type",
      render: (row) => <span className="text-gray-700">{row.insuranceType}</span>
    },
    { 
      key: "company", 
      label: "Companies", 
      render: (row) => <span className="font-semibold text-gray-700">{row.company}</span> 
    },
    { 
      key: "planName", 
      label: "Plan Name",
      render: (row) => <span className="text-gray-700">{row.planName}</span>
    },
    { 
      key: "planType", 
      label: "Plan Type", 
      render: (row) => {
        let badgeColor = "bg-blue-50 text-blue-600"; // Fresh
        if (row.planType === 'Port') badgeColor = "bg-amber-50 text-amber-600";
        if (row.planType === 'Renewal') badgeColor = "bg-emerald-50 text-emerald-600";
        return <span className={`text-xs font-semibold px-2 py-1 rounded-md ${badgeColor}`}>{row.planType}</span>;
      }
    },
    { 
      key: "policyNumber", 
      label: "Policy Number", 
      render: (row) => <span className="text-[#2B4399] font-mono text-xs font-bold bg-[#2B4399]/5 px-2 py-1 rounded">{row.policyNumber}</span> 
    },
    { 
      key: "sumAssured", 
      label: "Sum Assured", 
      render: (row) => <span className="font-bold">{row.sumAssured}</span> 
    },
    { 
      key: "totalPremium", 
      label: "Total Premium", 
      render: (row) => (
        <div className="flex flex-col gap-1 text-[11px] min-w-[140px]">
          <div className="flex justify-between gap-2"><span className="text-gray-500 font-medium flex items-center gap-1"><FileEdit size={12} className="text-gray-400"/> Net Premium</span> <span className="font-bold text-gray-900">{row.netPremium}</span></div>
          <div className="flex justify-between gap-2"><span className="text-gray-500 font-medium flex items-center gap-1"><FileEdit size={12} className="text-gray-400"/> GST Amount</span> <span className="font-bold text-gray-900">{row.gstAmount}</span></div>
          <div className="flex justify-between gap-2 pt-1 mt-0.5"><span className="text-[#059669] font-bold flex items-center gap-1"><FileEdit size={12} className="text-[#059669]"/> Total</span> <span className="font-bold text-[#059669]">{row.totalPremium}</span></div>
        </div>
      ) 
    },
    {
      key: "policyDate",
      label: "Policy Date",
      render: (row) => (
        <div className="flex flex-col gap-1.5 text-xs min-w-[160px]">
          <div className="flex justify-between items-center gap-3"><span className="text-gray-500 font-medium">Login Date:</span> <span className="font-bold text-gray-900">{row.loginDate}</span></div>
          <div className="flex justify-between items-center gap-3"><span className="text-gray-500 font-medium">Start Date:</span> <span className="font-bold text-gray-900">{row.startDate}</span></div>
          <div className="flex justify-between items-center gap-3"><span className="text-gray-500 font-medium">End Date:</span> <span className="font-bold text-gray-900">{row.endDate}</span></div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        let badgeClass = "bg-gray-100 text-gray-700";
        if (row.status === 'Active') badgeClass = "bg-emerald-100 text-emerald-700";
        if (row.status === 'Lapsed') badgeClass = "bg-rose-100 text-rose-700";
        if (row.status === 'Renewed') badgeClass = "bg-blue-100 text-blue-700";

        return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>{row.status}</span>;
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
        <title>Health Insurance - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Health Insurance Management"
          columns={columns}
          data={mockData}
          addLabel="Add Health Insurance"
          onAdd={() => router.push('/insurance/health/add')}
        />
      </div>
    </div>
  );
}
