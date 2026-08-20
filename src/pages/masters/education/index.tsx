import React, { useState } from 'react';
import Head from 'next/head';
import { Edit, Trash2, ChevronRight, Home } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';

const INITIAL_EDUCATION = [
  { id: 1, name: 'B.Com' },
  { id: 2, name: 'B.A.' },
  { id: 3, name: 'Secondary' },
];

export default function EducationList() {
  const [education, setEducation] = useState(INITIAL_EDUCATION);
  const [newName, setNewName] = useState('');

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col">
      <Head>
        <title>Education List - Insuraa</title>
      </Head>

      <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-[450px] shrink-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="bg-black rounded-full w-4 h-4 flex items-center justify-center text-white font-bold italic text-[10px]">i</div>
              <h2 className="text-[16px] font-bold text-gray-900">Add Education</h2>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Education Name <span className="text-[#e74c3c]">*</span></label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter Education Name"
                  className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                />
              </div>
              <button className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded text-sm font-bold transition-colors shadow-sm">
                Save
              </button>
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
            <span className="text-gray-500">Add Education</span>
          </div>

          <DataTable
            title=""
            data={education}
            columns={[
              { key: 'name', label: 'Education' },
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
