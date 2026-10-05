import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, UserCheck, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useInsertStaff, useViewStaff } from '@/hooks/useStaffApi';
import { validateStaff } from '@/utils/validation';

export default function AddStaffPage() {
  const router = useRouter();
  const { id } = router.query;
  const editStaffId = id ? String(id) : null;

  const insertStaffMutation = useInsertStaff();
  const { data: existingStaff, isLoading: isFetchingStaff } = useViewStaff(editStaffId);

  const [formData, setFormData] = useState({
    full_name: '',
    number: '',
    email: '',
    address: '',
    data_access: '2',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingStaff) {
      setFormData({
        full_name: existingStaff.full_name || '',
        number: existingStaff.number || '',
        email: existingStaff.email || '',
        address: existingStaff.address || '',
        data_access: String(existingStaff.data_access || '2'),
      });
    }
  }, [existingStaff]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Only allow digits (0-9) for mobile number and cap at 10 digits
  const handleNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    handleChange('number', digitsOnly);
  };

  const validateForm = () => {
    const { isValid, errors: validationErrors } = validateStaff(formData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = editStaffId
      ? { ...formData, staff_id: editStaffId }
      : formData;

    insertStaffMutation.mutate(payload, {
      onSuccess: (resData) => {
        if (resData && (resData.status === 200 || resData.status === '200' || resData.success)) {
          router.push('/staff');
        }
      },
    });
  };

  const sectionHeaderClass =
    'bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-xl flex items-center justify-between gap-2 mb-6 border-l-4 border-[#2B4399]';
  const labelClass = 'text-[13px] font-bold text-gray-700 mb-1.5 block';
  const selectClass =
    'w-full h-[42px] px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4399]/20 focus:border-[#2B4399] transition-all bg-white shadow-2xs cursor-pointer';

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-0">
      <Head>
        <title>{editStaffId ? 'Edit Staff' : 'Add Staff'} - Insuraa</title>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 font-bold text-gray-900">
          <button
            onClick={() => router.back()}
            type="button"
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            {editStaffId ? 'Edit Staff' : 'Add New Staff'}
          </h1>
        </div>

        {/* Form Container Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
          {isFetchingStaff && editStaffId ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2B4399] mb-3" />
              <p className="text-sm font-medium">Loading staff details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Section Header */}
              <div>
                <div className={sectionHeaderClass}>
                  <div className="flex items-center gap-2">
                    <UserCheck size={18} />
                    <span>Staff Information</span>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <div>
                    <label className={labelClass}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="full_name"
                      placeholder="Enter Full Name (e.g. Rahul Patel)"
                      value={formData.full_name}
                      onChange={(e: any) => handleChange('full_name', e.target.value)}
                      error={errors.full_name}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="number"
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={formData.number}
                      onChange={(e: any) => handleNumberChange(e.target.value)}
                      error={errors.number}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <Input
                      name="email"
                      type="text"
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={(e: any) => handleChange('email', e.target.value)}
                      error={errors.email}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <Input
                      name="address"
                      placeholder="Enter Complete Address"
                      value={formData.address}
                      onChange={(e: any) => handleChange('address', e.target.value)}
                      error={errors.address}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Data Access <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      value={formData.data_access}
                      onChange={(e: any) => handleChange('data_access', e.target.value)}
                    >
                      <option value="1">1 All Added By</option>
                      <option value="2">2 Only Added By Staff</option>
                    </Select>
                    {errors.data_access && (
                      <p className="text-xs text-red-500 font-semibold mt-1">{errors.data_access}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.push('/staff')}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={insertStaffMutation.isPending}
                  className="px-6 py-2.5 bg-[#2B4399] hover:bg-[#203378] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {insertStaffMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                  <span>{editStaffId ? 'Update Staff' : 'Save Staff'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
