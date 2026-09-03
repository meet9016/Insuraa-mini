import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, FileText, Edit, Trash2, Calendar, Pause, X, Check, LayoutGrid, List, Download } from 'lucide-react';
import TableHeader from '@/components/ui/TableHeader';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import ReminderNotesModal from '@/components/leads/ReminderNotesModal';
import {
  useLeadKanbanList,
  useLeadActions,
  loadMoreKanbanLeads,
  KanbanStatusGroup,
  LeadItem,
} from '@/hooks/useLeadApi';

interface KanbanViewProps {
  search: string;
  onSearchChange?: (val: string) => void;
  onEditLead?: (lead: LeadItem) => void;
  onOpenNotes?: (lead: LeadItem) => void;
  onOpenReminders?: (lead: LeadItem) => void;
  onAddLead?: () => void;
  onExport?: () => void;
  viewMode?: 'kanban' | 'table';
  onViewModeChange?: (mode: 'kanban' | 'table') => void;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
}

export default function KanbanView({
  search,
  onSearchChange,
  onEditLead,
  onOpenNotes,
  onOpenReminders,
  onAddLead,
  onExport,
  viewMode = 'kanban',
  onViewModeChange,
  title = 'Leads Board',
  subtitle,
  searchPlaceholder = 'Search leads by name or ID...',
}: KanbanViewProps) {
  const { data: apiKanbanGroups = [], isLoading: isKanbanLoading } = useLeadKanbanList();
  const { deleteLead } = useLeadActions();

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    lead_id: string | number | null;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    lead_id: null,
    name: '',
    isDeleting: false,
  });

  // Notes / Reminders modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    leadName?: string;
    leadId?: string | number;
    tab: 'notes' | 'reminders';
  }>({
    isOpen: false,
    leadName: '',
    leadId: '',
    tab: 'notes',
  });

  const handleOpenNotesTab = (lead: LeadItem) => {
    if (onOpenNotes) {
      onOpenNotes(lead);
    } else {
      setModalState({
        isOpen: true,
        leadName: lead.full_name,
        leadId: lead.lead_id,
        tab: 'notes',
      });
    }
  };

  const handleOpenRemindersTab = (lead: LeadItem) => {
    if (onOpenReminders) {
      onOpenReminders(lead);
    } else {
      setModalState({
        isOpen: true,
        leadName: lead.full_name,
        leadId: lead.lead_id,
        tab: 'reminders',
      });
    }
  };

  const handleDeleteClick = (lead: LeadItem) => {
    setDeleteModalState({
      isOpen: true,
      lead_id: lead.lead_id,
      name: lead.full_name || 'Lead',
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.lead_id) return;
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
    try {
      const success = await deleteLead(deleteModalState.lead_id);
      if (success) {
        setDeleteModalState({ isOpen: false, lead_id: null, name: '', isDeleting: false });
      } else {
        setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
      }
    } catch {
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Filter Kanban leads based on search string
  const kanbanGroups: KanbanStatusGroup[] = apiKanbanGroups.map((group) => {
    const filteredLeads = (group.leads || []).filter((lead: LeadItem) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase().trim();
      return (
        String(lead.lead_id).toLowerCase().includes(term) ||
        (lead.full_name && lead.full_name.toLowerCase().includes(term)) ||
        (lead.number && lead.number.includes(term)) ||
        (lead.reference && lead.reference.toLowerCase().includes(term))
      );
    });
    return {
      ...group,
      total_count: group.total_count ?? filteredLeads.length,
      leads: filteredLeads,
    };
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col p-0 h-[calc(100vh-210px)]">
      <TableHeader
        title={title}
        subtitle={subtitle}
        searchPlaceholder={searchPlaceholder}
        searchValue={search}
        onSearchChange={onSearchChange}
        showSearch={!!onSearchChange}
        extraActions={
          <>
            {onViewModeChange && (
              <div className="bg-white border border-gray-200 p-1 rounded-md flex items-center shadow-sm">
                <button
                  type="button"
                  onClick={() => onViewModeChange('kanban')}
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${viewMode === 'kanban'
                      ? 'bg-[#2B4399] shadow-sm text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  title="Kanban View"
                >
                  <LayoutGrid size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('table')}
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-all ${viewMode === 'table'
                      ? 'bg-[#2B4399] shadow-sm text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  title="Table View"
                >
                  <List size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow whitespace-nowrap"
              >
                <Download size={16} className="text-gray-500" /> Export
              </button>
            )}
          </>
        }
        buttonText={onAddLead ? 'Add Lead' : undefined}
        onButtonClick={onAddLead}
      />

      {isKanbanLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B4399]"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 custom-scrollbar">
          <div className="flex gap-4 h-full min-w-[1200px]">
            {kanbanGroups.map((group) => (
              <div key={group.status_id} className="flex-1 min-w-[240px] h-full">
                <KanbanColumn
                  statusId={group.status_id}
                  title={group.status_name}
                  count={group.total_count ?? group.leads?.length ?? 0}
                  color={group.color}
                  initialLeads={group.leads || []}
                  onEdit={onEditLead}
                  onDelete={handleDeleteClick}
                  onOpenNotes={handleOpenNotesTab}
                  onOpenReminders={handleOpenRemindersTab}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        itemName={deleteModalState.name}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Reminder & Notes Modal */}
      <ReminderNotesModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        leadName={modalState.leadName}
        leadId={modalState.leadId}
        initialTab={modalState.tab}
      />
    </div>
  );
}

interface KanbanColumnProps {
  statusId: string | number;
  title: string;
  count: number;
  color?: string;
  initialLeads: LeadItem[];
  onEdit?: (lead: LeadItem) => void;
  onDelete: (lead: LeadItem) => void;
  onOpenNotes: (lead: LeadItem) => void;
  onOpenReminders: (lead: LeadItem) => void;
}

function getEmptyColumnConfig(title: string) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('call') || lower.includes('later') || lower.includes('follow')) {
    return {
      bgColor: 'bg-emerald-100/90 text-emerald-600',
      icon: <PhoneCall size={28} className="text-emerald-600" />,
      subtext: 'Leads marked for follow up will appear here.',
    };
  }
  if (lower.includes('schedul') || lower.includes('meeting')) {
    return {
      bgColor: 'bg-blue-100/90 text-blue-600',
      icon: <Calendar size={28} className="text-blue-600" />,
      subtext: 'Scheduled meetings will appear here.',
    };
  }
  if (lower.includes('hold')) {
    return {
      bgColor: 'bg-amber-100/90 text-amber-500',
      icon: <Pause size={28} className="text-amber-500" strokeWidth={2.5} />,
      subtext: 'Leads on hold will appear here.',
    };
  }
  if (lower.includes('reject')) {
    return {
      bgColor: 'bg-rose-100/90 text-rose-500',
      icon: <X size={28} className="text-rose-500" strokeWidth={2.5} />,
      subtext: 'Rejected leads will appear here.',
    };
  }
  if (lower.includes('done') || lower.includes('convert') || lower.includes('win') || lower.includes('success')) {
    return {
      bgColor: 'bg-emerald-100/90 text-emerald-600',
      icon: <Check size={28} className="text-emerald-600" strokeWidth={2.5} />,
      subtext: 'Converted leads will appear here.',
    };
  }
  return {
    bgColor: 'bg-[#2B4399]/10 text-[#2B4399]',
    icon: <FileText size={28} className="text-[#2B4399]" />,
    subtext: 'Leads in this stage will appear here.',
  };
}

function KanbanColumn({
  statusId,
  title,
  count,
  color,
  initialLeads,
  onEdit,
  onDelete,
  onOpenNotes,
  onOpenReminders,
}: KanbanColumnProps) {
  const [columnLeads, setColumnLeads] = useState<LeadItem[]>(initialLeads);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const pageRef = useRef<number>(1);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);

  // Sync initialLeads when prop updates
  useEffect(() => {
    setColumnLeads(initialLeads);
    pageRef.current = 1;
    hasMoreRef.current = true;
    loadingRef.current = false;
  }, [initialLeads]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (loadingRef.current || !hasMoreRef.current) return;

    if (target.scrollHeight - target.scrollTop - target.clientHeight <= 80) {
      loadingRef.current = true;
      setIsLoadingMore(true);
      const nextPage = pageRef.current + 1;

      try {
        const newLeads = await loadMoreKanbanLeads(statusId, nextPage);

        if (Array.isArray(newLeads) && newLeads.length > 0) {
          setColumnLeads(prev => {
            const existingIds = new Set(prev.map(l => String(l.lead_id || (l as any).id)));
            const uniqueNew = newLeads.filter(l => !existingIds.has(String(l.lead_id || (l as any).id)));
            return [...prev, ...uniqueNew];
          });
          pageRef.current = nextPage;
        } else {
          hasMoreRef.current = false;
        }
      } catch (err) {
        console.error('Error loading more kanban leads:', err);
      } finally {
        loadingRef.current = false;
        setIsLoadingMore(false);
      }
    }
  };

  const emptyConfig = getEmptyColumnConfig(title);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
      {/* Column Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-[#2B4399] text-white rounded-t-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-xs"
            style={{ backgroundColor: color || '#FFC107' }}
          ></span>
          <h3 className="font-bold text-sm text-white tracking-tight">{title}</h3>
        </div>
        <span className="bg-white text-[#2B4399] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          {count}
        </span>
      </div>

      {/* Scrollable Body / Empty State */}
      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar flex flex-col"
      >
        {columnLeads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 my-auto">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-xs ${emptyConfig.bgColor}`}>
              {emptyConfig.icon}
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">No leads here</h4>
            <p className="text-xs text-slate-400 font-medium max-w-[170px] leading-relaxed text-center">
              {emptyConfig.subtext}
            </p>
          </div>
        ) : (
          columnLeads.map((lead) => (
            <div
              key={lead.lead_id}
              className="bg-white p-3 rounded-xl shadow-xs border border-[#2B4399]/40 hover:border-[#2B4399]/40 transition-all duration-200 hover:shadow-md flex flex-col gap-2.5"
            >
              {/* Header: Lead ID & Date */}
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded-md">
                  #lead-{lead.lead_id}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{lead.date || ''}</span>
              </div>

              {/* Lead Name */}
              <h4 className="font-bold text-slate-900 text-base leading-tight truncate">
                {lead.full_name}
              </h4>

              {/* Phone & Product Row */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                  <PhoneCall size={13} className="text-slate-400" />
                  <span>{lead.number}</span>
                </div>
                <span className="bg-indigo-50 text-indigo-700 font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-indigo-100/60 truncate max-w-[120px]">
                  {lead.product_name || 'Insurance'}
                </span>
              </div>

              {/* Footer: Source & Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1">
                {lead.business_group_name ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0 bg-purple-600">
                      {lead.business_group_name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 truncate">
                      {lead.business_group_name}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] font-semibold text-slate-500 truncate">
                    {lead.reference ? `Ref: ${lead.reference}` : 'Direct'}
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenNotes(lead)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-[#2B4399]/20 bg-[#2B4399]/10 text-[#2B4399] hover:bg-[#2B4399] hover:text-white transition-all shadow-xs"
                    title="Reminder & Notes"
                  >
                    <FileText size={12} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(lead)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-emerald-500/30 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-xs"
                    title="Edit"
                  >
                    <Edit size={12} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(lead)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-rose-500/30 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all shadow-xs"
                    title="Delete"
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Spinner for Load More */}
        {isLoadingMore && (
          <div className="text-center py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-[#2B4399]">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#2B4399]"></div>
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
}
