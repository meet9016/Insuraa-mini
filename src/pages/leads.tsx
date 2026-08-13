import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, Download, Upload, Filter, Edit, Trash2, FileText, CheckCircle, Search, PhoneCall, LayoutGrid, List } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import DatePicker from '@/components/ui/DatePicker';

const LEAD_COLUMNS = [
  { key: 'id', label: 'ID', render: (row: any) => <span className="text-gray-500 font-bold">#LEAD-{row.id}</span> },
  { key: 'name', label: 'Name', render: (row: any) => <span className="font-bold text-[#2B4399]">{row.name}</span> },
  { key: 'phone', label: 'Phone', render: (row: any) => <span className="font-bold text-gray-600">{row.phone}</span> },
  { key: 'type', label: 'Type', render: (row: any) => <span className="bg-[#eef2ff] text-[#2B4399] font-bold text-[10px] px-2.5 py-1 rounded-full">{row.type}</span> },
  { key: 'date', label: 'Date', render: (row: any) => <span className="text-gray-500 font-bold">{row.date}</span> },
  { key: 'agent', label: 'Agent', render: (row: any) => <span className="font-bold text-gray-600">{row.agent || 'No Agent'}</span> },
  { key: 'status', label: 'Status', render: (row: any) => <span className="font-bold text-gray-600 capitalize">{row.status.replace(/([A-Z])/g, ' $1').trim()}</span> },
  {
    key: 'action', label: 'Action', render: (row: any) => (
      <div className="flex items-center gap-1.5">
        <button className="w-7 h-7 flex items-center justify-center rounded border border-[#2B4399]/20 bg-[#2B4399]/5 text-[#2B4399] hover:bg-[#2B4399] hover:text-white transition-all"><FileText size={14} strokeWidth={2.5} /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded border border-emerald-500/30 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"><Edit size={14} strokeWidth={2.5} /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded border border-rose-500/30 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} strokeWidth={2.5} /></button>
      </div>
    )
  }
];

const INITIAL_LEADS_DATA = {
  pending: [
    { id: 1, name: 'Ramesh', initial: 'R', initialBg: 'bg-indigo-500', phone: '9876543200', type: 'Life Insurance', date: '04/08/2026', agent: 'Manmath Kamole', agentColor: 'bg-purple-500' },
    { id: 2, name: 'ANKUR', initial: 'A', initialBg: 'bg-purple-500', phone: '9825947488', type: 'Life Insurance', date: '10/13/2025', agent: 'Manmath Kamole', agentColor: 'bg-purple-500' },
    { id: 3, name: 'GOD BLESS YOU', initial: 'G', initialBg: 'bg-indigo-500', phone: '9737975794', type: 'Life Insurance', date: '10/13/2025', agent: 'Manmath Kamole', agentColor: 'bg-purple-500' },
    { id: 4, name: 'A', initial: 'A', initialBg: 'bg-purple-500', phone: '9586829304', type: 'Life Insurance', date: '10/13/2025', agent: 'Manmath Kamole', agentColor: 'bg-purple-500' },
    { id: 5, name: 'KALPESH JANI', initial: 'K', initialBg: 'bg-indigo-500', phone: '8141113584', type: 'Life Insurance', date: '10/13/2025', agent: 'Manmath Kamole', agentColor: 'bg-purple-500' },
    { id: 6, name: 'SANJAY DOBARIA', initial: 'S', initialBg: 'bg-purple-500', phone: '9724533635', type: 'Life Insurance', date: '10/13/2025' }
  ],
  callLater: [
    { id: 7, name: 'VAIBHAV', initial: 'V', initialBg: 'bg-indigo-500', phone: '9729728818', type: 'Life Insurance', date: '04/22/2026', agent: 'SHEETAL', agentColor: 'bg-purple-500' },
    { id: 8, name: 'Sagar', initial: 'S', initialBg: 'bg-purple-500', phone: '6555555555', type: 'Other Insurance', date: '04/10/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 9, name: 'Kano', initial: 'K', initialBg: 'bg-indigo-500', phone: '7418529634', type: 'Wc Insurance', date: '04/08/2026' },
    { id: 10, name: 'Rajesh', initial: 'R', initialBg: 'bg-purple-500', phone: '9876543223', type: 'Motor Insurance', date: '04/08/2026' },
    { id: 11, name: 'Suresh', initial: 'S', initialBg: 'bg-indigo-500', phone: '9876543222', type: 'Health Insurance', date: '04/08/2026' },
    { id: 12, name: 'Kano', initial: 'K', initialBg: 'bg-purple-500', phone: '7418529633', type: 'Wc Insurance', date: '01/01/1970' }
  ],
  scheduleMeeting: [
    { id: 13, name: 'Bhavin Mukeshchandra Shah', initial: 'B', initialBg: 'bg-indigo-500', phone: '9979508737', type: 'Life Insurance', date: '04/17/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 14, name: 'Demo', initial: 'D', initialBg: 'bg-purple-500', phone: '9876544444', type: 'Wc Insurance', date: '04/09/2026' },
    { id: 15, name: 'Sample Name 1', initial: 'S', initialBg: 'bg-indigo-500', phone: '9876543220', type: 'Life Insurance', date: '04/08/2026' },
    { id: 16, name: 'Sintu', initial: 'S', initialBg: 'bg-purple-500', phone: '8910882849', type: 'Motor Insurance', date: 'Invalid Date' },
    { id: 17, name: 'Kishan Chavda', initial: 'K', initialBg: 'bg-indigo-500', phone: '8401967626', type: 'Motor Insurance', date: '03/15/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 18, name: 'Mahesh Kumar', initial: 'M', initialBg: 'bg-purple-500', phone: '9123456789', type: 'Motor Insurance', date: '02/28/2026' }
  ],
  hold: [
    { id: 19, name: 'Bishal Narayan Naik', initial: 'B', initialBg: 'bg-indigo-500', phone: '9585864846', type: 'Health Insurance', date: 'Invalid Date', agent: 'Kiran Mayee Naik', agentColor: 'bg-purple-500' },
    { id: 20, name: 'Kabhir', initial: 'K', initialBg: 'bg-purple-500', phone: '9729728818', type: 'Life Insurance', date: '04/22/2026', agent: 'Bhawana', agentColor: 'bg-purple-500' },
    { id: 21, name: 'RAMAN NAGPAL', initial: 'R', initialBg: 'bg-indigo-500', phone: '9729728818', type: 'Health Insurance', date: '04/22/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 22, name: 'Karma', initial: 'K', initialBg: 'bg-purple-500', phone: '8980789260', type: 'Life Insurance', date: '10/16/2025', agent: 'Santosh Shamrao Kedar', agentColor: 'bg-indigo-500' },
    { id: 23, name: 'Prakash Hirpara', initial: 'P', initialBg: 'bg-indigo-500', phone: '9825833630', type: 'Life Insurance', date: '10/16/2025', agent: 'San', agentColor: 'bg-purple-500' },
    { id: 24, name: 'Muksh Vaidya', initial: 'M', initialBg: 'bg-purple-500', phone: '9081819460', type: 'Life Insurance', date: '10/16/2025' }
  ],
  done: [
    { id: 25, name: 'Aniket', initial: 'A', initialBg: 'bg-indigo-500', phone: '9999999999', type: 'Life Insurance', date: '07/16/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 26, name: 'Shopno Tested', initial: 'S', initialBg: 'bg-purple-500', phone: '9729728818', type: 'Life Insurance', date: '05/18/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 27, name: 'Ramesh', initial: 'R', initialBg: 'bg-indigo-500', phone: '9876543221', type: 'Life Insurance', date: '04/08/2026' },
    { id: 28, name: 'Kishan Chavda', initial: 'K', initialBg: 'bg-purple-500', phone: '8401967626', type: 'Motor Insurance', date: '03/15/2026' },
    { id: 29, name: 'Mohit Soni', initial: 'M', initialBg: 'bg-indigo-500', phone: '6262336699', type: 'Life Insurance', date: '02/17/2026', agent: 'Demo', agentColor: 'bg-purple-500' },
    { id: 30, name: 'Yash', initial: 'Y', initialBg: 'bg-purple-500', phone: '9653256852', type: 'Life Insurance', date: '02/06/2026', agent: 'Demo', agentColor: 'bg-purple-500' }
  ]
};

export default function ManageLeads() {
  const [leadsData, setLeadsData] = useState(INITIAL_LEADS_DATA);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const allLeads = Object.entries(leadsData).flatMap(([status, leads]) =>
    leads.map(lead => ({ ...lead, status }))
  );

  const handleDragStart = (e: React.DragEvent, leadId: number, sourceCol: string) => {
    e.dataTransfer.setData('leadId', leadId.toString());
    e.dataTransfer.setData('sourceCol', sourceCol);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCol: keyof typeof INITIAL_LEADS_DATA) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData('leadId'));
    const sourceCol = e.dataTransfer.getData('sourceCol') as keyof typeof INITIAL_LEADS_DATA;

    if (!sourceCol || !leadId || sourceCol === targetCol) return;

    setLeadsData((prev) => {
      const sourceItems = [...prev[sourceCol]];
      const targetItems = [...prev[targetCol]];

      const leadIndex = sourceItems.findIndex((l) => l.id === leadId);
      if (leadIndex === -1) return prev;

      const [movedLead] = sourceItems.splice(leadIndex, 1);
      targetItems.push(movedLead);

      return {
        ...prev,
        [sourceCol]: sourceItems,
        [targetCol]: targetItems
      };
    });
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col">
      <Head>
        <title>Manage Leads - Insuraa</title>
      </Head>

      <div className="flex-1 w-full flex flex-col overflow-hidden mx-auto p-6">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-[320px] relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-[#2B4399] transition-colors" />
            <input type="text" placeholder="Search leads by name or ID..." className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2D3591]/10 focus:border-[#2D3591] transition-all shadow-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-gray-200 p-1 rounded-md flex items-center shadow-sm">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${viewMode === 'kanban' ? 'bg-[#2B4399] shadow-sm text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                title="Kanban View"
              >
                <LayoutGrid size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${viewMode === 'table' ? 'bg-[#2B4399] shadow-sm text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                title="Table View"
              >
                <List size={16} strokeWidth={2.5} />
              </button>
            </div>
            <button
              onClick={() => setIsAddLeadOpen(true)}
              className="bg-[#2B4399] hover:bg-[#203378] text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <Plus size={16} strokeWidth={3} /> Add Lead
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow">
              <Download size={16} className="text-gray-500" /> Export
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow">
              <Upload size={16} className="text-gray-500" /> Import
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow">
              <Filter size={16} className="text-gray-500" /> Filters
            </button>
          </div>
        </div>

        {/* View Container */}
        {viewMode === 'kanban' ? (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 h-full min-w-[1200px]">

              {/* Pending Column */}
              <KanbanColumn
                columnKey="pending" title="Pending" count={leadsData.pending.length.toString()} leads={leadsData.pending}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
              />
              {/* Call Later Column */}
              <KanbanColumn
                columnKey="callLater" title="Call Later" count={leadsData.callLater.length.toString()} leads={leadsData.callLater}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
              />
              {/* Schedule Meeting Column */}
              <KanbanColumn
                columnKey="scheduleMeeting" title="Shedule Meeting" count={leadsData.scheduleMeeting.length.toString()} leads={leadsData.scheduleMeeting}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
              />
              {/* Hold Column */}
              <KanbanColumn
                columnKey="hold" title="Hold" count={leadsData.hold.length.toString()} leads={leadsData.hold}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
              />
              {/* Done Column */}
              <KanbanColumn
                columnKey="done" title="Done" count={leadsData.done.length.toString()} leads={leadsData.done}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
              />

            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto pb-4 custom-scrollbar">
            <DataTable
              title="Leads List"
              columns={LEAD_COLUMNS}
              data={allLeads}
            />
          </div>
        )}

      </div>

      {/* Add Lead Side Drawer */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddLeadOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-full md:w-[600px] lg:w-[700px] bg-white h-full shadow-2xl flex flex-col transform translate-x-0 transition-transform duration-300">
            {/* Header */}
            <div className="bg-[#2B4399] px-6 py-4 flex justify-between items-center text-white shrink-0">
              <h2 className="text-lg font-bold">Add New Lead</h2>
              <button
                onClick={() => setIsAddLeadOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Customer Full Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter Customer Full Name" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter Phone Number" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400" />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Whatsapp Number</label>
                  <input type="text" placeholder="Enter Whatsapp" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Reference Customer</label>
                  <select className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow bg-white text-gray-500">
                    <option>Select Reference Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Lead Source</label>
                  <select className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow bg-white text-gray-500">
                    <option>Select Lead Source</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Assign Team <span className="text-red-500">*</span></label>
                  <select className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow bg-white text-gray-500">
                    <option>Select Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Products <span className="text-red-500">*</span></label>
                  <select className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow bg-white text-gray-500">
                    <option>Select Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Date</label>
                  <DatePicker value="2026-08-11" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow text-gray-700" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Remarks</label>
                  <textarea rows={3} placeholder="Enter Remarks" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400"></textarea>
                </div>

                <div className="md:col-span-2 mt-1 mb-0">
                  <h3 className="text-sm font-bold text-[#2B4399] border-b border-gray-100 pb-2">Reminder Settings</h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Reminder Title</label>
                  <input type="text" placeholder="Enter Reminder Title" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow placeholder:text-gray-400" />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Reminder Date</label>
                  <DatePicker className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow text-gray-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Reminder Time</label>
                  <input type="time" className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3591] focus:border-[#2D3591] transition-shadow text-gray-400" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center shrink-0">
              <button
                onClick={() => setIsAddLeadOpen(false)}
                className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <CheckCircle size={16} strokeWidth={2.5} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  count: string;
  leads: any[];
  columnKey: string;
  onDragStart: (e: React.DragEvent, id: number, col: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, col: any) => void;
}

function KanbanColumn({ title, count, leads, columnKey, onDragStart, onDragOver, onDrop }: KanbanColumnProps) {
  // Use a subtle dot color based on column
  const dotColor =
    columnKey === 'pending' ? 'bg-amber-400' :
      columnKey === 'callLater' ? 'bg-blue-400' :
        columnKey === 'scheduleMeeting' ? 'bg-purple-400' :
          columnKey === 'hold' ? 'bg-rose-400' :
            'bg-emerald-400';

  return (
    <div
      className="flex flex-col h-full bg-gray-100/60 rounded-2xl border border-gray-200/50 overflow-hidden shadow-sm"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnKey)}
    >
      {/* Column Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200/50 bg-[#2B4399] backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm`}></span>
          <h3 className="font-bold text-[15px] text-white tracking-tight">{title}</h3>
        </div>
        <span className="bg-white text-gray-600 border border-gray-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">{count}</span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
        {leads.map((lead) => (
          <div
            key={lead.id}
            draggable
            onDragStart={(e) => onDragStart(e, lead.id, columnKey)}
            className="bg-white p-3 rounded-xl shadow-sm border border-[#2B4399]/30 transition-all duration-300 hover:shadow-md hover:border-[#2B4399]/50 hover:-translate-y-1 group cursor-grab active:cursor-grabbing relative"
          >
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-[10px] text-gray-400 font-bold bg-gray-100/80 px-2 py-0.5 rounded-md">#LEAD-{lead.id}</div>
              <div className="text-[10px] font-bold text-gray-500">{lead.date}</div>
            </div>

            <h4 className="font-bold text-[#2B4399] text-[15px] mb-1.5 leading-tight">{lead.name}</h4>

            <div className="flex items-center mb-2.5">
              <div className="flex items-center gap-1.5 text-gray-600 font-bold text-[11px] bg-gray-50/80 px-2 py-1 rounded-md border border-gray-100">
                <PhoneCall size={12} className="text-gray-400" /> {lead.phone}
              </div>
            </div>

            {/* Type and Actions on the same row to save vertical space */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block bg-[#eef2ff] text-[#2B4399] font-bold text-[10px] px-2.5 py-1 rounded-full">{lead.type}</span>

              <div className="flex items-center gap-1.5">
                <button className="w-6 h-6 flex items-center justify-center rounded border border-[#2B4399]/20 bg-[#2B4399]/5 text-[#2B4399] hover:bg-[#2B4399] hover:text-white transition-all shadow-sm" title="View"><FileText size={12} strokeWidth={2.5} /></button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-emerald-500/30 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-sm" title="Edit"><Edit size={12} strokeWidth={2.5} /></button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-rose-500/30 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all shadow-sm" title="Delete"><Trash2 size={12} strokeWidth={2.5} /></button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-indigo-500/30 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all shadow-sm" title="Complete"><CheckCircle size={12} strokeWidth={2.5} /></button>
              </div>
            </div>

            {/* Footer containing agent */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              {lead.agent ? (
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm ${lead.agentColor}`}>
                    {lead.agent.charAt(0)}
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{lead.agent}</span>
                </div>
              ) : (
                <div className="text-[11px] font-bold text-gray-400 italic">No Agent</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
