import React, { useState } from 'react';
import Head from 'next/head';
import KanbanView from '@/components/leads/KanbanView';
import TableView from '@/components/leads/TableView';
import AddLeadModal from '@/components/leads/AddLeadModal';

export default function ManageLeads() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editLeadData, setEditLeadData] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input (500ms delay) to prevent API calls on every character keypress
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAddLead = () => {
    setEditLeadData(null);
    setIsAddLeadOpen(true);
  };

  const handleOpenEditLead = (lead: any) => {
    setEditLeadData(lead);
    setIsAddLeadOpen(true);
  };

  const handleExport = () => {
    // Export functionality
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col ">
      <Head>
        <title>Manage Leads - Insuraa</title>
      </Head>

      <div className="flex-1 w-full flex flex-col overflow-hidden mx-auto p-0">
        {/* View Container */}
        {viewMode === 'kanban' ? (
          <KanbanView
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddLead={handleOpenAddLead}
            onExport={handleExport}
            onEditLead={handleOpenEditLead}
          />
        ) : (
          <TableView
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddLead={handleOpenAddLead}
            onExport={handleExport}
            onEditLead={handleOpenEditLead}
          />
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

