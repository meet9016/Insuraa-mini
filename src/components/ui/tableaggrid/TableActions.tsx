import React from 'react';
import { Eye, Edit, FileEdit, Trash2, FileText, Bell } from 'lucide-react';

interface TableActionsProps {
  data?: any;
  onView?: (data: any) => void;
  onNotes?: (data: any) => void;
  onReminders?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  variant?: 'default' | 'light';
  editIcon?: 'edit' | 'file-edit';
}

const btnBase = "p-1.5 rounded-md border cursor-pointer transition-all duration-200 ease-out hover:scale-110 hover:-rotate-3 active:scale-95";

const btnStyles = {
  default: {
    view: `${btnBase} bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200 hover:text-blue-800 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.35)]`,
    notes: `${btnBase} bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200 hover:text-blue-800 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.35)]`,
    reminders: `${btnBase} bg-amber-100 text-amber-600 border-amber-300 hover:bg-amber-200 hover:text-amber-800 hover:border-amber-400 hover:shadow-[0_0_10px_rgba(245,158,11,0.35)]`,
    edit: `${btnBase} bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-200 hover:text-emerald-800 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.35)]`,
    delete: `${btnBase} bg-rose-100 text-rose-500 border-rose-300 hover:bg-rose-200 hover:text-rose-700 hover:border-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.35)]`,
  },
  light: {
    view: `${btnBase} bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200 hover:text-sky-800 hover:border-sky-400 hover:shadow-[0_0_10px_rgba(14,165,233,0.35)]`,
    notes: `${btnBase} bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200 hover:text-sky-800 hover:border-sky-400 hover:shadow-[0_0_10px_rgba(14,165,233,0.35)]`,
    reminders: `${btnBase} bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 hover:text-amber-800 hover:border-amber-400 hover:shadow-[0_0_10px_rgba(245,158,11,0.35)]`,
    edit: `${btnBase} bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 hover:text-emerald-800 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.35)]`,
    delete: `${btnBase} bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-200 hover:text-rose-700 hover:border-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.35)]`,
  },
};

export const TableActions: React.FC<TableActionsProps> = ({
  data,
  onView,
  onNotes,
  onReminders,
  onEdit,
  onDelete,
  variant = 'default',
  editIcon = 'edit'
}) => {
  const styles = btnStyles[variant];

  return (
    <div className="flex items-center gap-1.5 h-full py-1">
      {onNotes !== undefined && (
        <button onClick={() => onNotes(data)} className={styles.notes} title="Notes & Remarks">
          <FileText size={14} strokeWidth={2.5} />
        </button>
      )}
      {onReminders !== undefined && (
        <button onClick={() => onReminders(data)} className={styles.reminders} title="Reminders">
          <Bell size={14} strokeWidth={2.5} />
        </button>
      )}
      {onView !== undefined && (
        <button onClick={() => onView(data)} className={styles.view} title="View">
          <Eye size={14} strokeWidth={2.5} />
        </button>
      )}
      {onEdit !== undefined && (
        <button onClick={() => onEdit(data)} className={styles.edit} title="Edit">
          {editIcon === 'file-edit' ? <FileEdit size={14} strokeWidth={2.5} /> : <Edit size={14} strokeWidth={2.5} />}
        </button>
      )}
      {onDelete !== undefined && (
        <button onClick={() => onDelete(data)} className={styles.delete} title="Delete">
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};


