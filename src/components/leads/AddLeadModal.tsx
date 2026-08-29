import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any | null;
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
  const { data: businessGroups = [] } = useBusinessGroupsDropdown();
  const { data: leadProducts = [] } = useLeadProductDropdown();

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
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">

        {/* Header */}
        <div className="bg-[#2B4399] px-6 py-4 flex justify-between items-center text-white shrink-0">
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
        <div className="p-6 overflow-y-auto space-y-4">
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
              placeholder="Enter Phone Number"
              value={formData.number}
              onChange={(e: any) => handleChange('number', e.target.value)}
              error={errors.number}
            />

            <Input
              label="Whatsapp Number"
              name="whatsapp_number"
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
              <Select
                value={String(formData.product_id)}
                onChange={(e: any) => handleChange('product_id', e.target.value)}
              >
                <option value="">Select Product</option>
                {leadProducts.map((prod) => (
                  <option key={prod.lead_product_id} value={String(prod.lead_product_id)}>
                    {prod.name}
                  </option>
                ))}
              </Select>
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
