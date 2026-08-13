import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, User, Eye } from 'lucide-react';

interface LifeInsuranceRecord {
  id: string;
  customerName: string;
  mobile: string;
  customerCode: string;
  addedBy: string;
  company: string;
  policyNumber: string;
  planName: string;
  totalPremium: string;
  gstAmount: string;
  maturityAmount: string;
  sumAssured: string;
  planType: string;
  paymentMode: string;
  overdueDays: string;
  loginDate: string;
  startDate: string;
  premiumEndDate: string;
  maturityDate: string;
  installmentDate: string;
  status: string;
}

const mockData: LifeInsuranceRecord[] = [
  {
    id: "1",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    company: "Bajaj Life Insurance Limited",
    policyNumber: "5555555555",
    planName: "Bajaj Life ETouch II",
    totalPremium: "1500",
    gstAmount: "₹500.00",
    maturityAmount: "₹0.00",
    sumAssured: "₹50,000.00",
    planType: "Fresh",
    paymentMode: "Monthly",
    overdueDays: "30 Days",
    loginDate: "29-06-2026",
    startDate: "29-06-2026",
    premiumEndDate: "29-05-2032",
    maturityDate: "29-06-2036",
    installmentDate: "29-07-2026",
    status: "Inforce",
  },
  {
    id: "2",
    customerName: "Amit Mehta",
    mobile: "9876543212",
    customerCode: "AM3212",
    addedBy: "Kavita Mehta",
    company: "Bajaj Life Insurance Limited",
    policyNumber: "LI-2024-003",
    planName: "Bajaj Life ETouch II",
    totalPremium: "51000",
    gstAmount: "₹0.00",
    maturityAmount: "₹2,500,000.00",
    sumAssured: "₹2,000,000.00",
    planType: "Fresh",
    paymentMode: "Quarterly",
    overdueDays: "45 Days",
    loginDate: "01-03-2024",
    startDate: "01-03-2024",
    premiumEndDate: "01-12-2048",
    maturityDate: "01-03-2059",
    installmentDate: "01-07-2024",
    status: "Lapsed",
  },
  {
    id: "3",
    customerName: "Ramesh Kumar Patel",
    mobile: "9876543210",
    customerCode: "RKP3210",
    addedBy: "Self",
    company: "Bajaj Life Insurance Limited",
    policyNumber: "LI-2024-001",
    planName: "Bajaj Life Smart Protect Goal",
    totalPremium: "30090",
    gstAmount: "₹4,509.00",
    maturityAmount: "₹1,200,000.00",
    sumAssured: "₹1,000,000.00",
    planType: "Fresh",
    paymentMode: "Monthly",
    overdueDays: "30 Days",
    loginDate: "01-01-2024",
    startDate: "01-01-2024",
    premiumEndDate: "31-12-2043",
    maturityDate: "31-12-2053",
    installmentDate: "01-01-2025",
    status: "Lapsed",
  },
  {
    id: "4",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    company: "Bajaj Life Insurance Limited",
    policyNumber: "5555555555",
    planName: "Bajaj Life ETouch II",
    totalPremium: "6500",
    gstAmount: "₹500.00",
    maturityAmount: "₹0.00",
    sumAssured: "₹5,000.00",
    planType: "Fresh",
    paymentMode: "Yearly",
    overdueDays: "30 Days",
    loginDate: "13-06-2026",
    startDate: "13-06-2026",
    premiumEndDate: "13-06-2030",
    maturityDate: "13-06-2036",
    installmentDate: "13-06-2030",
    status: "Inforce",
  }
];

export default function LifeInsuranceList() {
  const router = useRouter();

  const columns: Column<LifeInsuranceRecord>[] = [
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
            <User size={12} className="text-[#2B4399]" /> Added by {row.addedBy}
          </div>
        </div>
      )
    },
    {
      key: "policyNumber",
      label: "Policy Number",
      render: (row) => <span className="font-bold text-gray-900">{row.policyNumber}</span>
    },
    {
      key: "policyDate",
      label: "Policy Date",
      render: (row) => (
        <div className="flex flex-col gap-1.5 text-xs min-w-[190px]">
          <div className="flex items-center gap-3"><span className="text-gray-500 font-medium min-w-[105px]">Login Date:</span> <span className="font-bold text-gray-900">{row.loginDate}</span></div>
          <div className="flex items-center gap-3"><span className="text-gray-500 font-medium min-w-[105px]">Start Date:</span> <span className="font-bold text-gray-900">{row.startDate}</span></div>
          <div className="flex items-center gap-3"><span className="text-gray-500 font-medium min-w-[105px]">Premium End:</span> <span className="font-bold text-gray-900">{row.premiumEndDate}</span></div>
          <div className="flex items-center gap-3"><span className="text-gray-500 font-medium min-w-[105px]">Maturity Date:</span> <span className="font-bold text-gray-900">{row.maturityDate}</span></div>
          <div className="flex items-center gap-3"><span className="text-orange-500 font-medium min-w-[105px]">Installment Date:</span> <span className="font-bold text-orange-500">{row.installmentDate}</span></div>
        </div>
      )
    },
    {
      key: "company",
      label: "Companies",
      render: (row) => <div className="font-semibold text-gray-700 min-w-[140px] max-w-[200px] whitespace-normal">{row.company}</div>
    },
    {
      key: "planName",
      label: "Plan Name",
      render: (row) => <div className="text-gray-700 min-w-[120px] max-w-[160px] whitespace-normal">{row.planName}</div>
    },
    {
      key: "totalPremium",
      label: "Total Premium",
      render: (row) => <span className="text-gray-700 font-medium">{row.totalPremium}</span>
    },
    {
      key: "gstAmount",
      label: "GST Amount",
      render: (row) => <span className="font-bold text-gray-900">{row.gstAmount}</span>
    },
    {
      key: "maturityAmount",
      label: "Maturity Amount",
      render: (row) => <span className="font-bold text-gray-900">{row.maturityAmount}</span>
    },
    {
      key: "sumAssured",
      label: "Sum Assured",
      render: (row) => <span className="font-bold text-gray-900">{row.sumAssured}</span>
    },
    {
      key: "planType",
      label: "Plan Type",
      render: (row) => {
        let badgeColor = "bg-blue-50 text-blue-600"; // Fresh
        if (row.planType === 'Port') badgeColor = "bg-amber-50 text-amber-600";
        if (row.planType === 'Renewal') badgeColor = "bg-emerald-50 text-emerald-600";
        return <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${badgeColor}`}>{row.planType}</span>;
      }
    },
    {
      key: "paymentMode",
      label: "Payment Mode",
      render: (row) => <span className="text-gray-700 font-medium">{row.paymentMode}</span>
    },
    {
      key: "overdueDays",
      label: "Premium Overdue Days",
      render: (row) => <span className="text-gray-700 font-medium">{row.overdueDays}</span>
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        let badgeClass = "bg-gray-100 text-gray-700";
        if (row.status === 'Inforce') badgeClass = "bg-emerald-100 text-emerald-700";
        if (row.status === 'Lapsed') badgeClass = "bg-rose-100 text-rose-700";
        if (row.status === 'Pending') badgeClass = "bg-amber-100 text-amber-700";

        return <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${badgeClass}`}>{row.status}</span>;
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
        <title>Life Insurance - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Life Insurance Management"
          columns={columns}
          data={mockData}
          addLabel="Add Life Insurance"
          onAdd={() => router.push('/insurance/life/add')}
        />
      </div>
    </div>
  );
}
