import React from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title = "List View",
  onAdd,
  addLabel = "Add New"
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#2B4399]/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view your {title.toLowerCase()} records</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[260px] group">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] focus:bg-white group-hover:border-gray-300"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-[#2F439D]" />
          </div>
          <button className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm flex-shrink-0">
            <SlidersHorizontal size={18} />
          </button>
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0"
            >
              + {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-[#2F439D] border-b border-[#2F439D]/80">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className="px-5 py-4 text-[12px] font-bold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap group-hover:text-gray-900 transition-colors"
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-gray-500 font-medium">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{data.length}</span> of <span className="font-bold text-gray-900">{data.length}</span> entries
        </span>
        <div className="flex gap-1.5">
          <button className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-[#2F439D] text-white text-sm font-bold shadow-sm">
            1
          </button>
          <button className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
