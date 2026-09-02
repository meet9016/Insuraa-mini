import React, { useState, useRef, useEffect, Children, isValidElement } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function Select({ children, className, onChange, value, ...props }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to extract text from React children without comma-joining arrays
  const getLabelText = (node: any): string => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getLabelText).join('');
    if (isValidElement(node)) return getLabelText((node.props as any).children);
    return '';
  };

  // Parse standard <option> children into an array
  const options = React.useMemo(() => {
    const opts: any[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === 'option') {
        const props = child.props as any;
        const val = props.value !== undefined ? String(props.value) : getLabelText(props.children);
        const label = getLabelText(props.children);
        opts.push({ value: val, label });
      }
    });
    return opts;
  }, [children]);

  // Use the option that says "Select" as placeholder
  const placeholderOption = options.find(o => o.label.toLowerCase().includes('select'));
  const actualOptions = options.filter(o => o !== placeholderOption);

  const [internalValue, setInternalValue] = useState(value || "");

  // Sync with external value if it changes
  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const selectedOption = actualOptions.find(o => o.value === internalValue);
  const displayLabel = selectedOption ? selectedOption.label : (placeholderOption ? placeholderOption.label : 'Select...');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = actualOptions.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (val: string) => {
    setInternalValue(val);
    if (onChange) {
      onChange({ target: { value: val } });
    }
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full text-[14px]" ref={dropdownRef}>

      {/* Trigger Button (Identical height to standard inputs) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer ${className || 'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm'} ${isOpen ? '!border-[var(--primary)] ring-2 ring-[var(--primary)]/20' : ''
          }`}
      >
        <span className={selectedOption ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
          {displayLabel}
        </span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--primary)]' : 'text-gray-500'}`} />
      </div>

      {/* Dropdown Menu (Matches the reference image layout) */}
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-[#d2d6f0] rounded-xl shadow-lg overflow-hidden flex flex-col">

          {/* Search Box inside dropdown */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative flex items-center w-full">
              <Search size={16} className="absolute left-3 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#d2d6f0] rounded-lg text-[13.5px] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-[13.5px] ${internalValue === opt.value
                    ? 'bg-[var(--primary)]/5 text-[var(--primary)] font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {opt.label}
                  {internalValue === opt.value && <Check size={16} className="text-[var(--primary)]" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-gray-400 text-center">
                No options found
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
