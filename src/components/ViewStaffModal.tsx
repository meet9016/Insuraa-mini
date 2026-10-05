import React from 'react';
import { X, UserCheck, Phone, Mail, MapPin, Shield, Calendar, Loader2, FileText, Users, PhoneCall, HeartPulse, Stethoscope, Car, Umbrella } from 'lucide-react';
import { useViewStaff } from '@/hooks/useStaffApi';

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string | number | null;
}

export default function ViewStaffModal({ isOpen, onClose, staffId }: ViewStaffModalProps) {
  const { data: staff, isLoading } = useViewStaff(isOpen ? staffId : null);

  if (!isOpen) return null;

  const accessName = staff?.data_access_name || (String(staff?.data_access) === '2' ? 'Only Added By Staff' : 'All Added By');
  const policyCounts = staff?.policy_counts || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Staff Details</h2>
               
              </div>
              <p className="text-xs text-blue-100 mt-0.5">Comprehensive view of staff member profile & stats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2B4399] mb-3" />
              <p className="text-sm font-medium">Loading staff details...</p>
            </div>
          ) : !staff ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No staff details found.</p>
            </div>
          ) : (
            <>
              {/* Profile Card Header */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2B4399]/10 text-[#2B4399] font-bold text-lg flex items-center justify-center">
                    {staff.full_name ? String(staff.full_name).charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{staff.full_name || 'N/A'}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Shield size={13} className="text-[#2B4399]" />
                      <span>{accessName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    Number(staff.status) === 1 || String(staff.status_name).toLowerCase() === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {staff.status_name || (Number(staff.status) === 1 ? 'Active' : 'Inactive')}
                  </span>
                </div>
              </div>

              {/* Personal Information Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <Phone size={16} className="text-[#2B4399] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Mobile Number</span>
                      <a href={`tel:${staff.number}`} className="text-xs font-semibold text-gray-900 hover:text-[#2B4399]">
                        {staff.number || 'N/A'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail size={16} className="text-[#2B4399] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Email Address</span>
                      <a href={`mailto:${staff.email}`} className="text-xs font-semibold text-gray-900 hover:text-[#2B4399] truncate block">
                        {staff.email || 'N/A'}
                      </a>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-gray-100">
                    <MapPin size={16} className="text-[#2B4399] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Complete Address</span>
                      <span className="text-xs font-medium text-gray-800">{staff.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance / Statistics Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Policy & Activity Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-center">
                    <HeartPulse size={18} className="text-red-500 mx-auto mb-1" />
                    <span className="text-[11px] text-gray-500 font-medium block">Life Policies</span>
                    <span className="text-base font-bold text-gray-900">{policyCounts.life ?? 0}</span>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-center">
                    <Stethoscope size={18} className="text-emerald-600 mx-auto mb-1" />
                    <span className="text-[11px] text-gray-500 font-medium block">Health Policies</span>
                    <span className="text-base font-bold text-gray-900">{policyCounts.health ?? 0}</span>
                  </div>

                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-center">
                    <Car size={18} className="text-[#2B4399] mx-auto mb-1" />
                    <span className="text-[11px] text-gray-500 font-medium block">Motor Policies</span>
                    <span className="text-base font-bold text-gray-900">{policyCounts.motor ?? 0}</span>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-center">
                    <Umbrella size={18} className="text-amber-600 mx-auto mb-1" />
                    <span className="text-[11px] text-gray-500 font-medium block">Other Policies</span>
                    <span className="text-base font-bold text-gray-900">{policyCounts.other ?? 0}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-center">
                    <span className="text-xs text-gray-500 font-medium block">Total Policies</span>
                    <span className="text-lg font-extrabold text-[#2B4399]">{policyCounts.total ?? 0}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-center">
                    <span className="text-xs text-gray-500 font-medium block">Customers Added</span>
                    <span className="text-lg font-extrabold text-[#2B4399]">{staff.customer_count ?? 0}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-center">
                    <span className="text-xs text-gray-500 font-medium block">Leads Managed</span>
                    <span className="text-lg font-extrabold text-[#2B4399]">{staff.lead_count ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Additional Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Created Date: <strong className="text-gray-600">{staff.created_at || 'N/A'}</strong></span>
                {staff.last_login_at && (
                  <span>Last Login: <strong className="text-gray-600">{staff.last_login_at}</strong></span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#2B4399] hover:bg-[#203378] text-[#2B4399] text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
