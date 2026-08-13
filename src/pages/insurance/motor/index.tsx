import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DataTable, { Column } from '@/components/ui/DataTable';
import { FileEdit, Trash2, Send, User, Car, Settings, Hash, Barcode, Eye } from 'lucide-react';

interface MotorInsuranceRecord {
  id: string;
  customerName: string;
  mobile: string;
  customerCode: string;
  addedBy: string;
  agent: string;
  agentAddedBy: string;
  company: string;
  planName: string;
  planType: string;
  policyNumber: string;
  vehicleType: string;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
  mfy: string;
  ncb: string;
  odPremium: string;
  tpPremium: string;
  netPremium: string;
  gstAmount: string;
  totalPremium: string;
  loginDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

const mockData: MotorInsuranceRecord[] = [
  {
    id: "1",
    customerName: "Shopno",
    mobile: "1234567899",
    customerCode: "S7899",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Insuraa",
    company: "Bajaj Life Insurance Limited",
    planName: "Bajaj Life iSecure",
    planType: "Port",
    policyNumber: "369852",
    vehicleType: "Motorcycle",
    registrationNumber: "MH-12-AB-1234",
    engineNumber: "123654",
    chassisNumber: "1252",
    mfy: "2010",
    ncb: "18%",
    odPremium: "₹1,233.00",
    tpPremium: "₹12.00",
    netPremium: "₹1,245.00",
    gstAmount: "₹0.00",
    totalPremium: "₹1,245.00",
    loginDate: "28-07-2026",
    startDate: "28-07-2026",
    endDate: "28-07-2027",
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
    company: "Bajaj Life Insurance Limited",
    planName: "Bajaj Life ETouch II",
    planType: "Fresh",
    policyNumber: "369852",
    vehicleType: "Scooter",
    registrationNumber: "MH-14-CD-5678",
    engineNumber: "123654",
    chassisNumber: "1252",
    mfy: "2010",
    ncb: "15%",
    odPremium: "₹1,233.00",
    tpPremium: "₹12.00",
    netPremium: "₹1,245.00",
    gstAmount: "₹18.00",
    totalPremium: "₹1,263.00",
    loginDate: "28-07-2026",
    startDate: "28-07-2026",
    endDate: "28-07-2027",
    status: "Active"
  },
  {
    id: "3",
    customerName: "PANKAJ MURLIDHAR POREDDIWAR",
    mobile: "9850185241",
    customerCode: "PMP5241",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Junaid Shaikh",
    company: "Royal Sundaram General Insurance Company Limited",
    planName: "Royal Sundaram Car Insurance",
    planType: "Fresh",
    policyNumber: "VPT1117200000100",
    vehicleType: "Private Car",
    registrationNumber: "MH-20-CH-6939",
    engineNumber: "JHD4C37946",
    chassisNumber: "MA1YA2JHKD2C34212",
    mfy: "2013",
    ncb: "-",
    odPremium: "₹0.00",
    tpPremium: "₹7,947.00",
    netPremium: "₹7,947.00",
    gstAmount: "₹715.23",
    totalPremium: "₹9,377.46",
    loginDate: "20-07-2026",
    startDate: "04-04-2026",
    endDate: "03-04-2027",
    status: "Active"
  },
  {
    id: "4",
    customerName: "TEST Test",
    mobile: "9441901190",
    customerCode: "TT1190",
    addedBy: "Self",
    agent: "Self",
    agentAddedBy: "Bhavesh Bhai",
    company: "Bajaj General Insurance Limited",
    planName: "Bajaj Allianz Two Wheeler Insurance",
    planType: "Fresh",
    policyNumber: "12-1806-0010374635-00",
    vehicleType: "Two Wheeler",
    registrationNumber: "GJ-32-P-4543",
    engineNumber: "ME4JCBS2GLD033515",
    chassisNumber: "JC8SED0056140",
    mfy: "2020",
    ncb: "-",
    odPremium: "₹0.00",
    tpPremium: "₹714.00",
    netPremium: "₹714.00",
    gstAmount: "₹129.00",
    totalPremium: "₹843.00",
    loginDate: "16-07-2026",
    startDate: "18-07-2026",
    endDate: "17-07-2026",
    status: "Lapsed"
  }
];

export default function MotorInsuranceList() {
  const router = useRouter();

  const columns: Column<MotorInsuranceRecord>[] = [
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
      key: "policyNumber",
      label: "Policy Number",
      render: (row) => <span className="text-[#2B4399] font-mono text-[11px] font-bold bg-[#2B4399]/5 px-2 py-1 rounded block max-w-28 break-all">{row.policyNumber}</span>
    },
    {
      key: "vehicleDetails",
      label: "Vehicle Details",
      render: (row) => (
        <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-bold min-w-[160px]">
          <div className="flex items-center gap-2"><Car size={14} className="text-gray-400" /> {row.vehicleType}</div>
          <div className="flex items-center gap-2"><Hash size={14} className="text-gray-400" /> {row.registrationNumber}</div>
          <div className="flex items-center gap-2"><Settings size={14} className="text-gray-400" /> {row.engineNumber}</div>
          <div className="flex items-center gap-2"><Barcode size={14} className="text-gray-400" /> {row.chassisNumber}</div>
        </div>
      )
    },
    {
      key: "mfy",
      label: "MFY",
      render: (row) => <span className="text-gray-900 text-sm font-bold">{row.mfy}</span>
    },
    {
      key: "ncb",
      label: "NCB %",
      render: (row) => <span className="text-gray-900 text-sm font-bold">{row.ncb}</span>
    },
    {
      key: "premiumDetails",
      label: "Premium Details",
      render: (row) => (
        <div className="flex flex-col gap-1.5 text-xs min-w-[180px]">
          <div className="flex justify-between items-center gap-2"><span className="text-gray-500 font-medium flex items-center gap-1.5"><FileEdit size={12} className="text-gray-400" /> OD Premium</span> <span className="font-bold text-gray-900">{row.odPremium}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="text-gray-500 font-medium flex items-center gap-1.5"><FileEdit size={12} className="text-gray-400" /> TP Premium</span> <span className="font-bold text-gray-900">{row.tpPremium}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="text-gray-500 font-medium flex items-center gap-1.5"><FileEdit size={12} className="text-gray-400" /> Net Premium</span> <span className="font-bold text-gray-900">{row.netPremium}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="text-gray-500 font-medium flex items-center gap-1.5"><FileEdit size={12} className="text-gray-400" /> GST Amount</span> <span className="font-bold text-gray-900">{row.gstAmount}</span></div>
          <div className="flex justify-between items-center gap-2 pt-1 mt-0.5"><span className="text-[#059669] font-bold flex items-center gap-1.5"><FileEdit size={12} className="text-[#059669]" /> Total</span> <span className="font-bold text-[#059669]">{row.totalPremium}</span></div>
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
        <title>Motor Insurance - Insuraa</title>
      </Head>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DataTable
          title="Motor Insurance Management"
          columns={columns}
          data={mockData}
          addLabel="Add Motor Insurance"
          onAdd={() => router.push('/insurance/motor/add')}
        />
      </div>
    </div>
  );
}
