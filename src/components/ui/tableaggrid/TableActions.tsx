import React from 'react';
import { Eye, Edit, FileEdit, Trash2 } from 'lucide-react';

interface TableActionsProps {
  data?: any;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  variant?: 'default' | 'light';
  editIcon?: 'edit' | 'file-edit';
}

export const TableActions: React.FC<TableActionsProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  variant = 'default',
  editIcon = 'edit'
}) => {
  const getBtnClass = (type: 'view' | 'edit' | 'delete') => {
    if (variant === 'light') {
      if (type === 'edit') return "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 p-1.5 rounded transition-all";
      if (type === 'delete') return "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 p-1.5 rounded transition-all";
      if (type === 'view') return "bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white border border-sky-200 hover:border-sky-500 p-1.5 rounded transition-all";
    }

    // Default
    if (type === 'view') return "p-1.5 bg-[#0ea5e9] text-white rounded hover:bg-[#0284c7] transition-colors shadow-sm";
    if (type === 'edit') return "bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded transition-colors shadow-sm";
    if (type === 'delete') return "bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded transition-colors shadow-sm";

    return "";
  };

  return (
    <div className="flex items-center gap-2 h-full py-1">
      {onView !== undefined && (
        <button onClick={() => onView(data)} className={getBtnClass('view')} title="View">
          <Eye size={14} strokeWidth={2.5} />
        </button>
      )}
      {onEdit !== undefined && (
        <button onClick={() => onEdit(data)} className={getBtnClass('edit')} title="Edit">
          {editIcon === 'file-edit' ? <FileEdit size={14} strokeWidth={2.5} /> : <Edit size={14} strokeWidth={2.5} />}
        </button>
      )}
      {onDelete !== undefined && (
        <button onClick={() => onDelete(data)} className={getBtnClass('delete')} title="Delete">
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
