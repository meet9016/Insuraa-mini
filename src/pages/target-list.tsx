import React, { useState } from 'react';
import Head from 'next/head';
import { Edit, Trash2, ChevronRight, Home } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import DatePicker from '@/components/ui/DatePicker';

const INITIAL_TARGETS = [
  { id: 1, year: '2026', policy: '100', sales: '10000000', renewal: '500000', client: '555', lead: '555555' },
  { id: 2, year: '2025', policy: '80', sales: '8000000', renewal: '400000', client: '450', lead: '450000' },
  { id: 3, year: '2024', policy: '60', sales: '6000000', renewal: '300000', client: '350', lead: '350000' },
];

export default function TargetList() {
  const [targets, setTargets] = useState(INITIAL_TARGETS);

  // Form State
  const [formData, setFormData] = useState({
    year: '',
    policy: '',
    sales: '',
    renewal: '',
    client: '',
    lead: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col">
      <Head>
        <title>Target List - Insuraa</title>
      </Head>

      <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">

        {/* Left Side: Form */}
        <div className="w-full md:w-[450px] shrink-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="bg-black rounded-full w-4 h-4 flex items-center justify-center text-white font-bold italic text-[10px]">i</div>
              <h2 className="text-[16px] font-bold text-gray-900">Add Target</h2>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Year <span className="text-[#e74c3c]">*</span></label>
                <DatePicker
                  value={formData.year}
                  onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                  placeholder="Select Year"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Policy <span className="text-[#e74c3c]">*</span></label>
                <input
                  type="text"
                  name="policy"
                  value={formData.policy}
                  onChange={handleChange}
                  placeholder="Enter Policy"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Sales <span className="text-[#e74c3c]">*</span></label>
                <input
                  type="text"
                  name="sales"
                  value={formData.sales}
                  onChange={handleChange}
                  placeholder="Enter Sales"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Renewal <span className="text-[#e74c3c]">*</span></label>
                <input
                  type="text"
                  name="renewal"
                  value={formData.renewal}
                  onChange={handleChange}
                  placeholder="Enter Renewal"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Client <span className="text-[#e74c3c]">*</span></label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Enter Client"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Lead <span className="text-[#e74c3c]">*</span></label>
                <input
                  type="text"
                  name="lead"
                  value={formData.lead}
                  onChange={handleChange}
                  placeholder="Enter Lead"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div className="pt-2">
                <button className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded text-sm font-bold transition-colors shadow-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Table */}
        <div className="flex-1 overflow-hidden w-full">
          {/* Breadcrumb Top Right */}
          <div className="flex justify-end items-center gap-1.5 text-sm text-[#2B4399] font-medium mb-4">
            <Home size={14} className="text-black" />
            <span className="text-black">Dashboard</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-500">Add Target</span>
          </div>

          <DataTable
            title=""
            data={targets}
            columns={[
              { key: 'year', label: 'Year' },
              { key: 'policy', label: 'Policy' },
              { key: 'sales', label: 'Sales' },
              { key: 'renewal', label: 'Renewal' },
              { key: 'client', label: 'Client' },
              { key: 'lead', label: 'Lead' },
              {
                key: 'action',
                label: 'Action',
                render: () => (
                  <div className="flex items-center gap-2">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded transition-colors shadow-sm" title="Edit">
                      <Edit size={14} strokeWidth={2.5} />
                    </button>
                    <button className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded transition-colors shadow-sm" title="Delete">
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </div>

      </div>
    </div>
  );
}
