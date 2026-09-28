import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const parseDateString = (val?: string): Date | null => {
  if (!val) return null;
  const str = String(val).trim();
  if (!str || str === 'null' || str === 'undefined') return null;

  const cleanVal = str.split(' ')[0].split('T')[0];

  // Format: YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanVal)) {
    const parts = cleanVal.split(/[-/]/).map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  // Format: DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanVal)) {
    const parts = cleanVal.split(/[-/]/).map(Number);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  const parsed = new Date(cleanVal);
  return isNaN(parsed.getTime()) ? null : parsed;
};

type ViewMode = 'days' | 'months' | 'years';

export default function DatePicker({ value, onChange, className, placeholder = "Select Date", error }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(parseDateString(value));
  const [currentDate, setCurrentDate] = useState<Date>(parseDateString(value) || new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [yearStart, setYearStart] = useState<number>(Math.floor((parseDateString(value) || new Date()).getFullYear() / 12) * 12);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    const parsed = parseDateString(value);
    setSelectedDate(parsed);
    if (parsed) {
      setCurrentDate(parsed);
      setYearStart(Math.floor(parsed.getFullYear() / 12) * 12);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      setCurrentDate(prev);
      setYearStart(Math.floor(prev.getFullYear() / 12) * 12);
    } else if (viewMode === 'months') {
      const prevYear = currentDate.getFullYear() - 1;
      setCurrentDate(new Date(prevYear, currentDate.getMonth(), 1));
      setYearStart(Math.floor(prevYear / 12) * 12);
    } else if (viewMode === 'years') {
      setYearStart(prev => prev - 12);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      setCurrentDate(next);
      setYearStart(Math.floor(next.getFullYear() / 12) * 12);
    } else if (viewMode === 'months') {
      const nextYear = currentDate.getFullYear() + 1;
      setCurrentDate(new Date(nextYear, currentDate.getMonth(), 1));
      setYearStart(Math.floor(nextYear / 12) * 12);
    } else if (viewMode === 'years') {
      setYearStart(prev => prev + 12);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');

    if (onChange) {
      onChange(`${year}-${month}-${d}`);
    }
    setIsOpen(false);
    setViewMode('days');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearSelect = (selectedYear: number) => {
    setCurrentDate(new Date(selectedYear, currentDate.getMonth(), 1));
    setViewMode('months');
  };

  const renderDaysView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      const isToday = new Date().getDate() === i &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      days.push(
        <button
          key={i}
          onClick={(e) => { e.preventDefault(); handleDateClick(i); }}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium transition-all duration-200
            ${isSelected
              ? 'bg-[#2B4399] text-white shadow-md transform scale-110'
              : isToday
                ? 'bg-blue-50 text-[#2B4399] font-bold border border-[#2B4399]/30'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="w-8 flex items-center justify-center text-xs font-bold text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </>
    );
  };

  const renderMonthsView = () => {
    return (
      <div className="grid grid-cols-3 gap-2.5 py-1">
        {MONTHS_SHORT.map((month, idx) => {
          const isCurrentMonth = currentDate.getMonth() === idx;
          const isSelectedMonth = selectedDate &&
            selectedDate.getMonth() === idx &&
            selectedDate.getFullYear() === currentDate.getFullYear();

          return (
            <button
              key={month}
              type="button"
              onClick={(e) => { e.preventDefault(); handleMonthSelect(idx); }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${isSelectedMonth
                ? 'bg-[#2B4399] text-white shadow-md'
                : isCurrentMonth
                  ? 'bg-blue-50 text-[#2B4399] border border-[#2B4399]/30 font-extrabold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#2B4399]'
                }`}
            >
              {month}
            </button>
          );
        })}
      </div>
    );
  };

  const renderYearsView = () => {
    const years = Array.from({ length: 12 }, (_, i) => yearStart + i);

    return (
      <div className="grid grid-cols-3 gap-2.5 py-1">
        {years.map((y) => {
          const isCurrentYear = currentDate.getFullYear() === y;
          const isSelectedYear = selectedDate && selectedDate.getFullYear() === y;

          return (
            <button
              key={y}
              type="button"
              onClick={(e) => { e.preventDefault(); handleYearSelect(y); }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${isSelectedYear
                ? 'bg-[#2B4399] text-white shadow-md'
                : isCurrentYear
                  ? 'bg-blue-50 text-[#2B4399] border border-[#2B4399]/30 font-extrabold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#2B4399]'
                }`}
            >
              {y}
            </button>
          );
        })}
      </div>
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const getHeaderText = () => {
    if (viewMode === 'days') {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'months') {
      return `${currentDate.getFullYear()}`;
    }
    return `${yearStart} - ${yearStart + 11}`;
  };

  const handleHeaderClick = () => {
    if (viewMode === 'days') {
      setViewMode('months');
    } else if (viewMode === 'months') {
      setViewMode('years');
    } else {
      setViewMode('days');
    }
  };

  return (
    <div className="relative w-full text-[14px]" ref={dropdownRef}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setViewMode('days');
        }}
        className={`w-full h-[42px] px-3.5 py-2 bg-white border rounded-xl text-sm flex items-center justify-between cursor-pointer transition-all shadow-2xs ${error
          ? 'border-red-500 ring-2 ring-red-500/20'
          : isOpen
            ? 'border-[#2B4399] ring-2 ring-[#2B4399]/20'
            : 'border-gray-300 hover:border-gray-400'
          } ${className || ''}`}
      >
        <span className={selectedDate ? 'text-gray-900 ' : 'text-gray-400'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <CalendarIcon size={18} className={`transition-colors duration-200 ${isOpen ? 'text-[#2B4399]' : 'text-gray-500'}`} />
      </div>
      {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-[1] w-[280px] mt-2 bg-white border border-[#d2d6f0] rounded-2xl shadow-xl overflow-hidden flex flex-col p-4 right-0 lg:right-auto animate-in fade-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleHeaderClick}
              className="font-bold text-[#2B4399] text-sm px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Click to change view"
            >
              <span>{getHeaderText()}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dynamic Content View */}
          {viewMode === 'days' && renderDaysView()}
          {viewMode === 'months' && renderMonthsView()}
          {viewMode === 'years' && renderYearsView()}

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const today = new Date();
                setCurrentDate(today);
                setSelectedDate(today);
                setYearStart(Math.floor(today.getFullYear() / 12) * 12);
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                if (onChange) onChange(`${year}-${month}-${d}`);
                setIsOpen(false);
                setViewMode('days');
              }}
              className="w-full py-2 text-[13px] font-bold text-[#2B4399] hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
