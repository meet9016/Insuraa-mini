import React, { useState, useMemo } from 'react';
import { X, FileText, Bell, Check, Trash2, Calendar, Clock, Pencil } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input';
import { ColDef } from 'ag-grid-community';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useLeadNoteList, useLeadNoteActions } from '@/hooks/useLeadNoteApi';
import { useLeadReminderList, useLeadReminderActions } from '@/hooks/useLeadReminderApi';
import { getNoteColumns, getReminderColumns } from '@/utils/tableColumns';

export interface NoteItem {
  id: string | number;
  date: string;
  remark: string;
}

export interface ReminderItem {
  id: string | number;
  date: string;
  time: string;
  message: string;
}

interface ReminderNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName?: string;
  leadId?: string | number;
  initialTab?: 'notes' | 'reminders';
}

export default function ReminderNotesModal({
  isOpen,
  onClose,
  leadName,
  leadId,
  initialTab = 'notes',
}: ReminderNotesModalProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'reminders'>(initialTab);

  // Fetch Notes from API for this leadId
  const { data: apiNoteList = [], isLoading: isLoadingNotes } = useLeadNoteList(leadId, isOpen);
  const { insertLeadNote, deleteLeadNote } = useLeadNoteActions();

  // Fetch Reminders from API for this leadId
  const { data: apiReminderList = [], isLoading: isLoadingReminders } = useLeadReminderList(leadId, isOpen);
  const { insertLeadReminder, deleteLeadReminder } = useLeadReminderActions();

  const [noteInput, setNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | number | null>(null);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Reminders state
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [editingReminderId, setEditingReminderId] = useState<string | number | null>(null);
  const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'note' | 'reminder' | null;
    id: string | number | null;
    itemName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: null,
    id: null,
    itemName: '',
    isDeleting: false,
  });

  // Format today's date DD-MM-YYYY
  const getFormattedDate = (dateObj: Date = new Date()) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const notes = useMemo(() => {
    if (Array.isArray(apiNoteList) && apiNoteList.length > 0) {
      return apiNoteList.map((item: any) => ({
        id: item.lead_note_id || item.id || item.note_id,
        lead_note_id: item.lead_note_id || item.id || item.note_id,
        date: item.date || item.cdate || item.created_at || getFormattedDate(),
        remark: item.remark || '',
      }));
    }
    return [];
  }, [apiNoteList]);

  const reminders = useMemo(() => {
    if (Array.isArray(apiReminderList) && apiReminderList.length > 0) {
      return apiReminderList.map((item: any) => ({
        id: item.reminder_id || item.id,
        date: item.date || getFormattedDate(),
        time: item.time || '10:00 AM',
        message: item.message || '',
      }));
    }
    return [];
  }, [apiReminderList]);

  const handleSaveNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteInput.trim()) return;

    if (leadId) {
      setIsSubmittingNote(true);
      const success = await insertLeadNote({
        lead_id: leadId,
        remark: noteInput.trim(),
        ...(editingNoteId ? { lead_note_id: editingNoteId } : {}),
      });
      setIsSubmittingNote(false);

      if (success) {
        setNoteInput('');
        setEditingNoteId(null);
      }
    }
  };

  const handleSaveReminder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reminderMessage.trim()) return;

    if (leadId) {
      setIsSubmittingReminder(true);
      let saveDate = reminderDate;
      if (reminderDate) {
        const parts = reminderDate.split(/[-/]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            saveDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else if (parts[2].length === 4) {
            saveDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      } else {
        const d = new Date();
        saveDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      const success = await insertLeadReminder({
        lead_id: leadId,
        date: saveDate,
        time: reminderTime || '10:00:00',
        message: reminderMessage.trim(),
        ...(editingReminderId ? { reminder_id: editingReminderId } : {}),
      });
      setIsSubmittingReminder(false);

      if (success) {
        setReminderDate('');
        setReminderTime('');
        setReminderMessage('');
        setEditingReminderId(null);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id || !deleteModalState.type) return;

    setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));

    if (deleteModalState.type === 'note') {
      if (leadId) {
        await deleteLeadNote(deleteModalState.id, leadId);
      }
    } else if (deleteModalState.type === 'reminder') {
      if (leadId) {
        await deleteLeadReminder(deleteModalState.id, leadId);
      }
    }

    setDeleteModalState({
      isOpen: false,
      type: null,
      id: null,
      itemName: '',
      isDeleting: false,
    });
  };

  const noteColumnDefs: any[] = useMemo(
    () =>
      getNoteColumns({
        onEdit: (data: any) => {
          const targetId = data.lead_note_id || data.id;
          setEditingNoteId(targetId);
          setNoteInput(data.remark || '');
        },
        onDelete: (data: any) => {
          const targetId = data.lead_note_id || data.id;
          setDeleteModalState({
            isOpen: true,
            type: 'note',
            id: targetId,
            itemName: data.remark ? `"${data.remark}"` : 'this note',
            isDeleting: false,
          });
        },
      }),
    [leadId]
  );

  const reminderColumnDefs: any[] = useMemo(
    () =>
      getReminderColumns({
        onEdit: (data: ReminderItem) => {
          setEditingReminderId(data.id);
          setReminderDate(data.date || '');
          setReminderTime(data.time || '');
          setReminderMessage(data.message || '');
        },
        onDelete: (data: ReminderItem) => {
          setDeleteModalState({
            isOpen: true,
            type: 'reminder',
            id: data.id,
            itemName: data.message ? `"${data.message}"` : 'this reminder',
            isDeleting: false,
          });
        },
      }),
    [leadId]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 flex flex-col transition-all transform animate-scaleUp">

        {/* Modal Header */}
        <div className="bg-[#2B4399] px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Reminder &amp; Notes
            </h2>
            {leadName && (
              <span className="bg-white/15 text-white/90 text-xs px-3 py-1 rounded-full font-medium border border-white/20">
                {leadName} {leadId ? `(#LEAD-${leadId})` : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all focus:outline-none"
            title="Close"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Tabs Header */}
        <div className="bg-white border-b border-gray-200/80 px-6 flex items-center gap-8">
          {/* Notes Tab */}
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3.5 flex items-center gap-2.5 relative font-bold text-sm transition-all focus:outline-none ${activeTab === 'notes' ? 'text-[#2B4399]' : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${activeTab === 'notes'
                ? 'bg-[#2B4399] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              <FileText size={15} strokeWidth={2.5} />
            </div>
            <span>Notes</span>
            <span
              className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-extrabold transition-all ${activeTab === 'notes'
                ? 'bg-[#2B4399] text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              {notes.length}
            </span>
            {activeTab === 'notes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B4399] rounded-t-full" />
            )}
          </button>

          {/* Reminders Tab */}
          <button
            onClick={() => setActiveTab('reminders')}
            className={`py-3.5 flex items-center gap-2.5 relative font-bold text-sm transition-all focus:outline-none ${activeTab === 'reminders' ? 'text-[#2B4399]' : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${activeTab === 'reminders'
                ? 'bg-[#2B4399] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              <Bell size={15} strokeWidth={2.5} className={activeTab === 'reminders' ? 'text-amber-300' : ''} />
            </div>
            <span>Reminders</span>
            <span
              className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-extrabold transition-all ${activeTab === 'reminders'
                ? 'bg-[#2B4399] text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              {reminders.length}
            </span>
            {activeTab === 'reminders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B4399] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 bg-slate-50/50 min-h-[380px] flex flex-col justify-between">
          {activeTab === 'notes' ? (
            /* ================= NOTES TAB ================= */
            <div className="flex flex-col gap-6">
              {/* Note Input Form (Single Line Layout) */}
              <form onSubmit={handleSaveNote} className="bg-[#F0F4FA] border border-[#DCE4EC] rounded-xl p-4 shadow-2xs">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label="Note / Remark"
                      name="noteInput"
                      value={noteInput}
                      onChange={(e: any) => setNoteInput(e.target.value)}
                      placeholder="Enter note..."
                      className="!bg-white"
                    />
                  </div>
                  <div className="mb-4">
                    <button
                      type="submit"
                      disabled={!noteInput.trim()}
                      className="bg-[#2B4399] hover:bg-[#203378] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 min-w-[90px] h-[42px]"
                    >
                      <Check size={16} strokeWidth={3} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Notes Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <AgGridTable
                  rowData={notes}
                  columnDefs={noteColumnDefs}
                  loading={isLoadingNotes}
                  pagination={false}
                  height="320px"
                />
              </div>
            </div>
          ) : (
            /* ================= REMINDERS TAB ================= */
            <div className="flex flex-col gap-6">
              {/* Reminder Inputs Form (Single Line Layout) */}
              <form onSubmit={handleSaveReminder} className="bg-[#F0F4FA] border border-[#DCE4EC] rounded-xl p-4 shadow-2xs">
                <div className="flex items-end gap-3">
                  {/* Date Input */}
                  <div className="w-44 shrink-0 mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date
                    </label>
                    <DatePicker
                      value={reminderDate}
                      onChange={(dateStr: string) => setReminderDate(dateStr)}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>

                  {/* Time Input */}
                  <div className="w-36 shrink-0">
                    <Input
                      label="Time"
                      name="reminderTime"
                      type="time"
                      value={reminderTime}
                      onChange={(e: any) => setReminderTime(e.target.value)}
                      className="!bg-white"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="flex-1">
                    <Input
                      label="Message"
                      name="reminderMessage"
                      value={reminderMessage}
                      onChange={(e: any) => setReminderMessage(e.target.value)}
                      placeholder="Enter message..."
                      className="!bg-white"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="mb-4">
                    <button
                      type="submit"
                      disabled={!reminderMessage.trim()}
                      className="bg-[#2B4399] hover:bg-[#203378] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 min-w-[90px] h-[42px]"
                    >
                      <Check size={16} strokeWidth={3} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Reminders Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <AgGridTable
                  rowData={reminders}
                  columnDefs={reminderColumnDefs}
                  loading={isLoadingReminders}
                  pagination={false}
                  height="320px"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModalState.type === 'note' ? 'Delete Note' : 'Delete Reminder'}
        itemName={deleteModalState.itemName}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  );
}
