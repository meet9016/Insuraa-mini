import React, { useState } from 'react';
import Head from 'next/head';
import { Minus, Plus, Building2 } from 'lucide-react';

const INITIAL_BRANCHES = [
  { id: 1, agent: '', code: '' },
];

export default function BranchList() {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);

  const handleAddRow = () => {
    setBranches([...branches, { id: Date.now(), agent: '', code: '' }]);
  };

  const handleRemoveRow = (id: number) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleChange = (id: number, field: 'agent' | 'code', value: string) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
  };

  const handleSave = () => {
    console.log('Saved branches:', branches);
    // Add toast or alert here in a real app
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col">
      <Head>
        <title>Branch List - Insuraa</title>
      </Head>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden flex-1 flex flex-col w-full mx-auto">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-gray-800">
            <Building2 size={20} className="text-gray-900" />
            <h1 className="text-[17px] font-bold text-gray-900">Branch List</h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          <div className="w-full mx-auto">
            {/* Table Headers */}
            <div className="flex items-center mb-4">
              <div className="flex-1 px-4 text-[13px] font-medium text-gray-600">Agent</div>
              <div className="flex-1 px-4 text-[13px] font-medium text-gray-600">Code</div>
              <div className="w-12 flex justify-center">
                <button 
                  onClick={handleAddRow}
                  className="w-8 h-8 flex items-center justify-center bg-[#2B4399] hover:bg-[#203378] text-white rounded-md transition-colors shadow-sm"
                  title="Add Row"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={branch.agent}
                      onChange={(e) => handleChange(branch.id, 'agent', e.target.value)}
                      placeholder="Enter Agent"
                      className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={branch.code}
                      onChange={(e) => handleChange(branch.id, 'code', e.target.value)}
                      placeholder="Enter Code"
                      className="w-full border border-gray-300 rounded text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"
                    />
                  </div>
                  <div className="w-12 flex justify-center shrink-0">
                    <button 
                      onClick={() => handleRemoveRow(branch.id)}
                      className="w-8 h-8 flex items-center justify-center bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-md transition-colors shadow-sm"
                      title="Remove Row"
                    >
                      <Minus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button 
                onClick={handleSave}
                className="bg-[#2B4399] hover:bg-[#203378] text-white px-8 py-2.5 rounded-md font-bold text-sm transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
