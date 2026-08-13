import React from 'react';
import Head from 'next/head';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';

export default function AddClaim() {
  const router = useRouter();
  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex items-center gap-2 mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>Add Claim - Insuraa</title>
        <style>{`
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          body::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </Head>

      <div className="w-full mx-auto animate-in fade-in duration-500 bg-white p-6 rounded-xl shadow-sm border border-gray-100">

        {/* Page Header */}
        <div className="sticky top-0 z-40 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-8 pt-6 -mt-6 -mx-6 px-6 rounded-t-xl">
          <div className="flex items-center gap-3 font-bold text-gray-900">
            <button onClick={() => router.back()} type="button" className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" title="Go Back">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl">Add Claim</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="button" className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm">
              Save Claim
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form className="space-y-8 bg-white">

          {/* Customer Information */}
          <div>
            <div className={sectionHeaderClass}>
              <UserIcon /> Customer Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                  <button type="button" className="text-xs text-[#cf3838] font-bold hover:underline">Add Customer</button>
                </div>
                <Select className={inputClass}>
                  <option>Select Customer Name</option>
                </Select>
              </div>
              <div>
                <label className={labelClass}>Insurance Type <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Insurance Type</option></Select>
              </div>
              <div>
                <label className={labelClass}>Customer Policy <span className="text-red-500">*</span></label>
                <Select className={inputClass}>
                  <option>Select Customer Policy</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div>
            <div className={sectionHeaderClass}>
              <InfoIcon /> Other Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>Admitted Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>Discharge Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>Claim Amount <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Claim Amount" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Deducted Amount <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Deducted Amount" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Settled Amount <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Settled Amount" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Claim Number <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Claim Number" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div>
            <div className={sectionHeaderClass}>
              <CalendarIcon /> Important Dates
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>File At Office <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>File At Company <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>Next Followup Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>

              <div>
                <label className={labelClass}>Query <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>Claim Settled Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} value="2026-08-11"  />
              </div>
              <div>
                <label className={labelClass}>Diagnosis <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Diagnosis" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Claim Status <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Claim Status</option></Select>
              </div>
            </div>
          </div>

          {/* Doctor & Hospital Information */}
          <div>
            <div className={sectionHeaderClass}>
              <HospitalIcon /> Doctor & Hospital Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>Name Of Doctor <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Name Of Doctor" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Name Of Hospital <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Name Of Hospital" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location Of Hospital <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Location Of Hospital" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Hospital Type <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Hospital Type" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Rating Of Hospital <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Rating Of Hospital</option></Select>
              </div>
            </div>
          </div>

          {/* Note Details */}
          <div>
            <div className={sectionHeaderClass}>
              <NoteIcon /> Note Details
            </div>
            <div>
              <label className={labelClass}>Note <span className="text-red-500">*</span></label>
              <textarea rows={4} className={inputClass}></textarea>
            </div>
          </div>

          {/* Footer / Save Button removed and placed at top */}

        </form>
      </div>
    </div>
  );
}

// Minimal Icons to match the screenshot section headers
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function InfoIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.86 8.753 5.482-4.349C10.853 3.204 13.147 3.204 14.658 4.404l5.482 4.349C21.328 9.695 22 11.114 22 12.639v5.861C22 20.433 20.433 22 18.5 22H5.5C3.567 22 2 20.433 2 18.5v-5.861c0-1.525.672-2.944 1.86-3.886Z" /><path d="M12 17v-6" /><circle cx="12" cy="7.5" r="1" fill="currentColor" /></svg>
}
function CalendarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
}
function HospitalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v4" /><path d="M14 8h-4" /><path d="M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4" /><path d="M22 22H2" /><path d="M20 22v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /></svg>
}
function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
