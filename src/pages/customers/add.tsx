import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';

export default function AddCustomer() {
  const router = useRouter();
  const [documents, setDocuments] = useState([{ id: 1 }]);

  const addDocument = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex justify-between items-center mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>Add Customer - Insuraa</title>
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
            <h1 className="text-xl">Add Customer</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="button" className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm">
              Save Customer
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form className="space-y-8 bg-white">

          {/* Customer Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><UserIcon /> Customer Information</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Customer Type <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Individual" className={inputClass} />
              </div>
              <div className="hidden md:block md:col-span-2"></div> {/* Spacer to match layout */}

              <div>
                <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter First Name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Middle Name</label>
                <input type="text" placeholder="Enter Middle Name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Last Name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Phone Number" className={inputClass} />
              </div>

              {/* <div>
                <label className={labelClass}>Agent</label>
                <Select className={inputClass}><option>Select Agent</option></Select>
              </div> */}
              <div>
                <label className={labelClass}>Customer Image</label>
                <input type="file" className="border border-gray-300 rounded-lg text-sm px-4 py-1.5 w-full file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" placeholder="Enter Email" className={inputClass} />
              </div>
              {/* <div>
                <label className={labelClass}>Password</label>
                <input type="password" placeholder="Strong Password" className={inputClass} />
              </div> */}

              <div>
                <label className={labelClass}>Reference By</label>
                <Select className={inputClass}><option>Select Reference By</option></Select>
              </div>
              <div>
                <label className={labelClass}>Source Of Customer</label>
                <Select className={inputClass}><option>Select Source Of Customer By</option></Select>
              </div>
              <div>
                <label className={labelClass}>Date Of Birth</label>
                <DatePicker className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Year ( Age )</label>
                <input type="text" placeholder="Enter Year ( Age )" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <Select className={inputClass}><option>Select Gender</option></Select>
              </div>
              <div>
                <label className={labelClass}>Height</label>
                <Select className={inputClass}><option>Select Height</option></Select>
              </div>
              <div>
                <label className={labelClass}>Weight</label>
                <input type="text" placeholder="Enter Weight" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <Select className={inputClass}><option>Select Marital Status</option></Select>
              </div>

              <div>
                <label className={labelClass}>Education</label>
                <Select className={inputClass}><option>Select Education</option></Select>
              </div>
              <div>
                <label className={labelClass}>Adhar Card Number</label>
                <input type="text" placeholder="Enter Adhar Card Number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pancard Number</label>
                <input type="text" placeholder="Enter Pancard Number" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><MapPinIcon /> Address Information</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Pincode" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nationality</label>
                <input type="text" placeholder="Auto Fetch via Pincode" className={inputClass} readOnly />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" placeholder="Auto Fetch via Pincode" className={inputClass} readOnly />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input type="text" placeholder="Auto Fetch via Pincode" className={inputClass} readOnly />
              </div>
              <div>
                <label className={labelClass}>Home Address</label>
                <input type="text" placeholder="Enter Home Address" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div>
            <div className={sectionHeaderClass}>
              <div className="flex items-center gap-2"><FileIcon /> Document Information</div>
              <button
                type="button"
                onClick={addDocument}
                className="bg-[#2B4399] text-white p-1.5 rounded hover:bg-[#203378] transition-colors"
                title="Add Document"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1 w-full">
                    <input type="text" placeholder="Select Other Document Name" className={inputClass} />
                  </div>
                  <div className="flex-1 w-full">
                    <input type="file" className="border border-gray-300 rounded-lg text-sm px-4 py-2 w-full file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white" />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="bg-[#ff0000b3] text-white p-1.5 rounded-md hover:bg-[#E01E49] transition-colors mt-1 md:mt-0 shadow-sm shrink-0 flex items-center justify-center"
                    title="Remove"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer / Save Button removed and placed at top */}

        </form>
      </div>
    </div>
  );
}

// Minimal Icons for section headers
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function UsersIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function MapPinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
}
