import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  className?: string;
  placeholder?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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

export default function DatePicker({ value, onChange, className, placeholder = "Select Date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(parseDateString(value));
  const [currentDate, setCurrentDate] = useState<Date>(parseDateString(value) || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    const parsed = parseDateString(value);
    setSelectedDate(parsed);
    if (parsed) {
      setCurrentDate(parsed);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);

    // Format as YYYY-MM-DD for standard input values if needed, or however preferred
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');

    if (onChange) {
      onChange(`${year}-${month}-${d}`);
    }
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
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
              ? 'bg-[var(--primary)] text-white shadow-md transform scale-110'
              : isToday
                ? 'bg-blue-50 text-[var(--primary)] font-bold border border-[var(--primary)]/30'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`; // DD-MM-YYYY format
  };

  return (
    <div className="relative w-full text-[14px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer ${className || 'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm'} ${isOpen ? '!border-[var(--primary)] ring-2 ring-[var(--primary)]/20' : ''
          }`}
      >
        <span className={selectedDate ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <CalendarIcon size={18} className={`transition-colors duration-200 ${isOpen ? 'text-[var(--primary)]' : 'text-gray-500'}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[9999] w-[280px] mt-2 bg-white border border-[#d2d6f0] rounded-2xl shadow-xl overflow-hidden flex flex-col p-4 right-0 lg:right-auto animate-in fade-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="font-bold text-[var(--primary)] text-sm">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="w-8 flex items-center justify-center text-xs font-bold text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentDate(new Date());
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                setSelectedDate(today);
                if (onChange) onChange(`${year}-${month}-${d}`);
                setIsOpen(false);
              }}
              className="w-full py-2 text-[13px] font-bold text-[var(--primary)] hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
