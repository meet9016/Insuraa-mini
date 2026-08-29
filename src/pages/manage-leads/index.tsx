import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, Download, Upload, Filter, Search, LayoutGrid, List } from 'lucide-react';
import KanbanView from '@/components/leads/KanbanView';
import TableView from '@/components/leads/TableView';
import AddLeadModal from '@/components/leads/AddLeadModal';

export default function ManageLeads() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editLeadData, setEditLeadData] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');

  const handleOpenAddLead = () => {
    setEditLeadData(null);
    setIsAddLeadOpen(true);
  };

  const handleOpenEditLead = (lead: any) => {
    setEditLeadData(lead);
    setIsAddLeadOpen(true);
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col min-h-[calc(100vh-72px)]">
      <Head>
        <title>Manage Leads - Insuraa</title>
      </Head>

      <div className="flex-1 w-full flex flex-col overflow-hidden mx-auto p-6">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-[320px] relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-[#2B4399] transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name or ID..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#2D3591]/10 focus:border-[#2D3591] transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-gray-200 p-1 rounded-md flex items-center shadow-sm">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-[#2B4399] shadow-sm text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Kanban View"
              >
                <LayoutGrid size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#2B4399] shadow-sm text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Table View"
              >
                <List size={16} strokeWidth={2.5} />
              </button>
            </div>
            <button
              onClick={handleOpenAddLead}
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
          <KanbanView search={search} onEditLead={handleOpenEditLead} />
        ) : (
          <TableView search={search} onEditLead={handleOpenEditLead} />
        )}
      </div>

      {/* Centered Add / Edit Lead Popup Modal */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        editData={editLeadData}
      />
    </div>
  );
}
