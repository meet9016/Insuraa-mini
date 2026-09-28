import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Search, Plus, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import ActionButtons from '@/components/ui/ActionButtons';
import {
  InsertLeadParams,
  useLeadActions,
  useBusinessGroupsDropdown,
  useLeadProductDropdown,
} from '@/hooks/useLeadApi';
import { useSourceOfLeadActions } from '@/hooks/useSourceOfLeadApi';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any | null;
}

function ProductSelectWithAdd({
  productList,
  selectedId,
  onChange,
  error,
}: {
  productList: Array<{ lead_product_id: string | number; name: string }>;
  selectedId: string | number;
  onChange: (id: string) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProductInput, setNewProductInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { insertLeadProduct } = useSourceOfLeadActions();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProduct = productList.find((p: any) => String(p.lead_product_id) === String(selectedId));

  const filteredProducts = productList.filter((p: any) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newProductInput.trim() || isAdding) return;
    setIsAdding(true);
    const newName = newProductInput.trim();
    try {
      const success = await insertLeadProduct(newName);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['leadProductDropdown'] });
        setNewProductInput('');
        setSearchQuery('');
      }
    } catch (err: any) {
      // handled inside hook
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full h-[42px] bg-white border ${error ? '!border-red-500 ring-2 ring-red-500/20' : isOpen ? 'border-[#2B4399] ring-2 ring-[#2B4399]/15' : 'border-gray-300 hover:border-gray-400'
          } rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer transition-all shadow-2xs`}
      >
        <span className={`text-sm ${selectedProduct ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {selectedProduct ? selectedProduct.name : 'Select Product'}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2B4399]' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#d2d6f0] rounded-2xl shadow-2xl p-3 z-[9999] space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div>
            <Input
              name="product_search_query"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              placeholder="Search product..."
              icon={<Search size={16} className="text-gray-400" />}
              className="!h-[38px] text-xs sm:text-sm border-gray-200 focus:border-[#2B4399]"
            />
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p: any) => {
                const isSelected = String(p.lead_product_id) === String(selectedId);
                return (
                  <div
                    key={p.lead_product_id}
                    onClick={() => {
                      onChange(String(p.lead_product_id));
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between cursor-pointer ${isSelected
                      ? 'bg-[#EEF2FF] text-[#2B4399] font-bold'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                      }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {isSelected && <Check size={16} className="text-[#2B4399] shrink-0 ml-2" />}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 py-3 text-center">No product found</div>
            )}
          </div>

          <div className="bg-[#F3F4FF] border border-[#E0E7FF] p-2 rounded-2xl flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#2B4399] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Plus size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <Input
                name="new_product_name"
                value={newProductInput}
                onChange={(e: any) => setNewProductInput(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="Enter new product name..."
                disabled={isAdding}
                className="!h-[36px] text-xs sm:text-sm border-[#C7D2FE] focus:border-[#2B4399]"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding || !newProductInput.trim()}
              className="px-3 py-1.5 bg-[#2B4399] hover:bg-[#1E3170] text-white text-xs font-bold rounded-xl transition-all shadow-2xs disabled:opacity-50 shrink-0"
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddLeadModal({ isOpen, onClose, editData }: AddLeadModalProps) {
  const [formData, setFormData] = useState<InsertLeadParams>({
    full_name: '',
    number: '',
    whatsapp_number: '',
    reference: '',
    business_group_id: '',
    product_id: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { insertLead } = useLeadActions();
  const { data: businessGroups = [] } = useBusinessGroupsDropdown(isOpen);
  const { data: leadProducts = [] } = useLeadProductDropdown(isOpen);

  useEffect(() => {
    if (isOpen && editData) {
      setFormData({
        lead_id: editData.lead_id || editData.id,
        full_name: editData.full_name || editData.name || '',
        number: editData.number || editData.phone || '',
        whatsapp_number: editData.whatsapp_number || editData.whatsapp || '',
        reference: editData.reference || '',
        business_group_id: editData.business_group_id || editData.business_group?.id || '',
        product_id: editData.product_id || editData.lead_product_id || '',
        date: editData.date || new Date().toISOString().split('T')[0],
      });
      setErrors({});
    } else if (isOpen && !editData) {
      setFormData({
        lead_id: undefined,
        full_name: '',
        number: '',
        whatsapp_number: '',
        reference: '',
        business_group_id: '',
        product_id: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const isEdit = Boolean(formData.lead_id);

  const handleChange = (field: keyof InsertLeadParams, value: any) => {
    let sanitizedValue = value;
    if (field === 'number' || field === 'whatsapp_number') {
      sanitizedValue = String(value).replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Customer Full Name is required';
    }
    if (!formData.number.trim()) {
      newErrors.number = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.number.trim())) {
      newErrors.number = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const success = await insertLead(formData);
      if (success) {
        setFormData({
          lead_id: undefined,
          full_name: '',
          number: '',
          whatsapp_number: '',
          reference: '',
          business_group_id: '',
          product_id: '',
          date: new Date().toISOString().split('T')[0],
        });
        setErrors({});
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Centered Modal Box */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">

        {/* Header */}
        <div className="bg-[#2B4399] px-6 py-4 flex justify-between items-center text-white shrink-0 rounded-t-2xl">
          <h2 className="font-bold text-lg tracking-tight">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10"
            title="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto md:overflow-visible space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Full Name"
              name="full_name"
              required
              placeholder="Enter Customer Full Name"
              value={formData.full_name}
              onChange={(e: any) => handleChange('full_name', e.target.value)}
              error={errors.full_name}
            />

            <Input
              label="Phone Number"
              name="number"
              required
              maxLength={10}
              placeholder="Enter Phone Number"
              value={formData.number}
              onChange={(e: any) => handleChange('number', e.target.value)}
              error={errors.number}
            />

            <Input
              label="Whatsapp Number"
              name="whatsapp_number"
              maxLength={10}
              placeholder="Enter Whatsapp Number"
              value={formData.whatsapp_number}
              onChange={(e: any) => handleChange('whatsapp_number', e.target.value)}
            />

            <Input
              label="Reference"
              name="reference"
              placeholder="Enter Reference"
              value={formData.reference}
              onChange={(e: any) => handleChange('reference', e.target.value)}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Group
              </label>
              <Select
                value={String(formData.business_group_id)}
                onChange={(e: any) => handleChange('business_group_id', e.target.value)}
              >
                <option value="">Select Business Group</option>
                {businessGroups.map((bg) => (
                  <option key={bg.business_group_id} value={String(bg.business_group_id)}>
                    {bg.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product
              </label>
              <ProductSelectWithAdd
                productList={leadProducts}
                selectedId={formData.product_id}
                onChange={(id: string) => handleChange('product_id', id)}
                error={errors.product_id}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                value={formData.date}
                onChange={(dateStr: string) => handleChange('date', dateStr)}
                placeholder="Select Date"
              />
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="shrink-0">
          <ActionButtons
            onCancel={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitText={isEdit ? 'Update Lead' : 'Save Lead'}
            cancelText="Cancel"
          />
        </div>

      </div>
    </div>
  );
}
