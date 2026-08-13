import React, { useState } from 'react';
import Head from 'next/head';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  List,
  X,
  Search
} from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: 'Care Health Insurance Company Limited',
    plans: [
      { id: 1, name: 'Care International Travel Insurance' },
      { id: 2, name: 'Care Personal Accident Insurance' },
      { id: 3, name: 'Care Arogya Sanjeevani Policy' },
      { id: 4, name: 'Care Critical Mediclaim' },
      { id: 5, name: 'Care Cancer Mediclaim' },
      { id: 6, name: 'Care Assure (Critical Illness)' },
      { id: 7, name: 'Care Enhance (Super Top-Up)' },
      { id: 8, name: 'Care Joy (Maternity Plan)' },
      { id: 9, name: 'Care Heart' },
      { id: 10, name: 'Care Senior' },
      { id: 11, name: 'Care Freedom' },
      { id: 12, name: 'Care Supreme Enhance (Top-Up)' },
    ]
  },
  { id: 2, name: 'Aditya Birla Health Insurance Company Limited', plans: Array.from({ length: 17 }).map((_, i) => ({ id: i + 1, name: `Birla Plan ${i + 1}` })) },
  { id: 3, name: 'Niva Bupa Health Insurance Company Limited', plans: Array.from({ length: 22 }).map((_, i) => ({ id: i + 1, name: `Niva Plan ${i + 1}` })) },
  { id: 4, name: 'Star Health And Allied Insurance Company Limited', plans: Array.from({ length: 21 }).map((_, i) => ({ id: i + 1, name: `Star Plan ${i + 1}` })) },
  { id: 5, name: 'Namo Bima Insurance', plans: Array.from({ length: 4 }).map((_, i) => ({ id: i + 1, name: `Namo Plan ${i + 1}` })) },
  { id: 6, name: 'Probus Insurance Broker Limited', plans: Array.from({ length: 5 }).map((_, i) => ({ id: i + 1, name: `Probus Plan ${i + 1}` })) },
  { id: 7, name: 'Insurance Dekho (Girnar Insurance Brokers Private Limited)', plans: Array.from({ length: 6 }).map((_, i) => ({ id: i + 1, name: `Dekho Plan ${i + 1}` })) },
  { id: 8, name: 'Policybazaar Insurance Brokers Private Limited', plans: Array.from({ length: 7 }).map((_, i) => ({ id: i + 1, name: `PB Plan ${i + 1}` })) },
];

export default function AddCompanies() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [activePlansCompany, setActivePlansCompany] = useState<any>(null);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col ">
      <Head>
        <title>Companies - Insuraa</title>
      </Head>

      <div className="w-full mx-auto">
        <DataTable
          title="Companies"
          addLabel="Add Company"
          onAdd={() => setIsAddCompanyOpen(true)}
          data={companies}
          columns={[
            { key: 'name', label: 'Company Name' },
            {
              key: 'plans',
              label: 'Plans',
              render: (row) => (
                <button
                  onClick={() => setActivePlansCompany(row)}
                  className="bg-[#2F439D] hover:bg-[#263784] text-white text-[12px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <List size={14} /> Total Plans {row.plans.length}
                </button>
              )
            },
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

      {/* 1. Add Company Modal */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddCompanyOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white">
              <h2 className="font-bold text-base">Add Company</h2>
              <button onClick={() => setIsAddCompanyOpen(false)} className="hover:text-gray-200 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Company Name"
                className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
              />
            </div>
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddCompanyOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddCompanyOpen(false)}
                className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded-md font-bold text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Plans Modal */}
      {activePlansCompany && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isAddPlanOpen && setActivePlansCompany(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white shrink-0">
              <h2 className="font-bold text-base">{activePlansCompany.name} — Plans</h2>
              <button onClick={() => !isAddPlanOpen && setActivePlansCompany(null)} className="hover:text-gray-200 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-white p-4">
              <DataTable
                title="Plans"
                addLabel="Add Plan"
                onAdd={() => setIsAddPlanOpen(true)}
                data={activePlansCompany.plans}
                columns={[
                  {
                    key: 'id',
                    label: '#',
                    render: (_, idx) => (
                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#2B4399] text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                    )
                  },
                  { key: 'name', label: 'PLAN NAME' },
                  {
                    key: 'action',
                    label: 'ACTION',
                    render: () => (
                      <div className="flex items-center gap-2">
                        <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 p-1.5 rounded transition-all" title="Edit">
                          <Edit size={14} strokeWidth={2.5} />
                        </button>
                        <button className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 p-1.5 rounded transition-all" title="Delete">
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
      )}

      {/* 3. Add Plan Modal (Nested on top of View Plans) */}
      {isAddPlanOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddPlanOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2B4399] px-5 py-3.5 flex justify-between items-center text-white">
              <h2 className="font-bold text-base">Add Plan</h2>
              <button onClick={() => setIsAddPlanOpen(false)} className="hover:text-gray-200 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Plan Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Term Life Gold"
                className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
              />
            </div>
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddPlanOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddPlanOpen(false)}
                className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded-md font-bold text-sm transition-colors"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
