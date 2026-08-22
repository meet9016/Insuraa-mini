import React from 'react';
import { Search, Plus } from 'lucide-react';

interface TableHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  buttonText?: string;
  onButtonClick?: () => void;
  showSearch?: boolean;
}

export default function TableHeader({
  title,
  subtitle,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  buttonText,
  onButtonClick,
  showSearch = true,
}: TableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {showSearch && onSearchChange && (
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-[240px] pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all"
            />
          </div>
        )}
        {buttonText && onButtonClick && (
          <button
            type="button"
            onClick={onButtonClick}
            className="px-5 py-2.5 bg-[#2B4399] text-white text-sm font-semibold rounded-md shadow-md transition-all hover:bg-[#203378] flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
