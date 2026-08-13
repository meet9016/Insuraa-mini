import React, { useState } from 'react';
import Head from 'next/head';
import { Eye, Edit, Trash2, UserCog, Users as UsersIcon, Plus, Filter, FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';

const CUSTOMERS_DATA = [
  { id: 1, name: 'PANKAJ MURLIDHAR POREDDIWAR', family: 'No Family', groupCode: 'PMP5241', number: '9850185241', email: '', agent: '', type: 'Software' },
  { id: 2, name: 'Bhvcgg Vgg Vbvvv', family: 'No Family', groupCode: 'BW0596', number: '9586410596', email: '', agent: '', type: 'Software' },
  { id: 3, name: 'Pramod Kumar Sharma', family: 'No Family', groupCode: 'PKS1500', number: '9303571500', email: 'Rakeshmrn@Gmail.Com', agent: '', type: 'Software' },
  { id: 4, name: 'Nitin Ananda Hidekar', family: 'No Family', groupCode: 'NAH5353', number: '9156765353', email: 'Work.Nitinhudekar@Gmail.Com', agent: '', type: 'Software' },
  { id: 5, name: 'Sagar Test', family: 'No Family', groupCode: 'ST1893', number: '7990881893', email: '', agent: '', type: 'Software' },
  { id: 6, name: 'Hemantbhai MADHAVBHAI Jagani', family: 'No Family', groupCode: 'HMJ8790_1', number: '9825318790', email: '', agent: '', type: 'Software' },
  { id: 7, name: 'Krish Sharama', family: '1 Member', familyColor: 'bg-orange-100 text-orange-600', groupCode: 'KS6699', number: '6262336699', email: 'Krish@Gmail.Com', agent: 'Demo', subAgent: 'BHAVIK THAKKAR', agentBadge: '3 Agents', type: 'Software' },
  { id: 8, name: 'Ramesh Lalabhai', family: 'No Family', groupCode: 'RL4123', number: '4444444123', email: '', agent: 'Demo', subAgent: 'BHAVIK THAKKAR', type: 'Software' },
  { id: 9, name: 'Devang Sharama', family: 'No Family', groupCode: 'DS4566', number: '7532584566', email: '', agent: 'Kiran Mayee Naik', subAgent: 'Satya Prakash', type: 'Software' },
  { id: 10, name: 'Shopno Demo', family: 'No Family', groupCode: 'SD4444', number: '4444444444', email: 'Pp.Shopno@Gmail.Com', agent: 'Demo', type: 'Software' },
];

export default function Customers() {
  const [entries, setEntries] = useState('10');

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Customer Management - Insuraa</title>
      </Head>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <UsersIcon size={24} className="text-gray-800" />
            Customer Management
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="bg-[#2F439D] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Plus size={16} /> Add Customer
            </button>
            <button className="bg-[#2F439D] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="bg-[#2F439D] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
              <FileSpreadsheet size={16} /> Excel
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-gray-100">
          
          {/* Table Controls */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Show 
              <select 
                className="border border-gray-300 rounded px-2 py-1 w-16 focus:outline-none focus:border-[#2D3591]"
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select> 
              Entries
            </div>
            <div className="flex items-center gap-2 text-sm">
              Search: 
              <input type="text" className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-[#2D3591] w-[200px]" />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[1000px]">
              <thead className="bg-[#2F439D] text-white font-medium uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 cursor-pointer">Name <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3 cursor-pointer">Group Code <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3 cursor-pointer">Number <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3 cursor-pointer">Email <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3 cursor-pointer">Agent <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3 cursor-pointer">Type <span className="text-[10px] text-white/50 ml-1">⇅</span></th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CUSTOMERS_DATA.map((customer, idx) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                         <ChevronRight size={14} className="text-gray-400" />
                         <div>
                            <div className="font-semibold text-gray-800">{customer.name}</div>
                            <div className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium ${customer.familyColor || 'bg-gray-100 text-gray-500'}`}>
                                <UsersIcon size={10} className="inline mr-1" />{customer.family}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer.groupCode}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.number}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.email ? (
                        <span>{customer.email}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.agent && (
                        <div>
                          <div className="font-medium text-gray-800">
                            {customer.agent}
                            {customer.agentBadge && (
                              <span className="ml-1 bg-orange-100 text-orange-600 text-[9px] px-1 py-0.5 rounded-sm font-bold">
                                {customer.agentBadge}
                              </span>
                            )}
                          </div>
                          {customer.subAgent && (
                            <div className="text-xs">Sub: {customer.subAgent}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[#e7f0fa] text-[#2F439D] font-medium text-xs px-2.5 py-1 rounded-full">
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-1.5 rounded"><Eye size={14} /></button>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded"><Edit size={14} /></button>
                        <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded"><Trash2 size={14} /></button>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded"><UserCog size={14} /></button>
                        <button className="bg-[#2F439D] hover:bg-blue-800 text-white p-1.5 rounded"><UsersIcon size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
             <div className="text-sm text-gray-600">
               Showing 1 To 10 Of 53 Entries
             </div>
             <div className="flex items-center gap-1">
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 bg-white"><ChevronLeft size={16} /></button>
               <button className="w-8 h-8 rounded-full bg-[#2F439D] text-white flex items-center justify-center text-sm font-medium">1</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm">2</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm">3</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm">4</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm">5</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm">6</button>
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 bg-white"><ChevronRight size={16} /></button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
