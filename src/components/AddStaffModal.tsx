import React, { useState } from 'react';
import { X, UserCheck, Loader2 } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    number: '',
    email: '',
    address: '',
    data_access: '2',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast.error('Please enter full name');
      return;
    }
    if (!formData.number.trim()) {
      toast.error('Please enter mobile number');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('full_name', formData.full_name.trim());
      data.append('number', formData.number.trim());
      data.append('email', formData.email.trim());
      data.append('address', formData.address.trim());
      data.append('data_access', formData.data_access);

      const res = await api.post(endPointApi.STAFF.INSERT_STAFF, data);
      const resData = res?.data;

      if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
        toast.success(resData.message || 'Staff Added Successfully');
        setFormData({
          full_name: '',
          number: '',
          email: '',
          address: '',
          data_access: '2',
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(resData?.message || 'Failed to add staff');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2F439D]/10 text-[#2F439D] rounded-lg">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add New Staff</h3>
              <p className="text-xs text-gray-500">Fill in staff details to create a new staff record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Rahul Patel"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="e.g. 7859993936"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Surat, Gujarat"
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Data Access <span className="text-red-500">*</span>
            </label>
            <select
              name="data_access"
              value={formData.data_access}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] transition-all cursor-pointer"
            >
              <option value="1">1 All Added By</option>
              <option value="2">2 Only Added By Staff</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#2F439D] hover:bg-[#253680] text-white text-sm font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>Save Staff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
