import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
export default function AddHealthInsurance() {
  const router = useRouter();
  const [documents, setDocuments] = useState([{ id: 1 }]);

  const addDocument = () => setDocuments([...documents, { id: Date.now() }]);
  const removeDocument = (id: number) => setDocuments(documents.filter(d => d.id !== id));

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex items-center gap-2 mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>Add Health Insurance - Insuraa</title>
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
            <h1 className="text-xl">Add Health Insurance</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="button" className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm">
              Save Insurance
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
                  <button type="button" className="text-xs text-[#2B4399] font-bold hover:underline">Add Customer</button>
                </div>
                <Select className={inputClass}>
                  <option>Select Customer Name</option>
                </Select>
              </div>
              <div>
                <label className={labelClass}>Policy Holder</label>
                <input type="text" placeholder="Select Policy Holder" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Agent</label>
                <Select className={inputClass}>
                  <option>Select Agent</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Policy PDF Details */}
          <div>
            <div className={sectionHeaderClass}>
              <FileIcon /> Policy PDF Details
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Upload Policy</label>
                <div className="flex items-center gap-4">
                  <input type="file" className="h-[46px] border border-gray-300 rounded-lg text-sm px-4 py-2.5 w-full max-w-md file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm" />
                  <button type="button" className="h-[46px] bg-[var(--primary)] text-white px-10 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm flex items-center justify-center">AI</button>
                </div>
              </div>
              <div className="bg-red-50 text-[#cf3838] p-4 rounded-lg text-xs border border-red-100 font-semibold leading-relaxed">
                Note: After Uploading The Policy PDF And Clicking The AI Button, The Form Will Be Auto-Filled. Please Review And Verify All Details Carefully, As AI-Generated Data May Not Be Fully Accurate, Before Saving Or Submitting.
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <div className={sectionHeaderClass}>
              <ShieldIcon /> Insurance Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">

              <div>
                <label className={labelClass}>Insurance Company Name <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Insurance Company Name</option></Select>
              </div>
              <div>
                <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Company Plan Name</option></Select>
              </div>
              <div>
                <label className={labelClass}>Branch</label>
                <Select className={inputClass}><option>Select Branch</option></Select>
              </div>

              <div>
                <label className={labelClass}>Insurance Type <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Insurance Type</option></Select>
              </div>
              <div>
                <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                <Select className={inputClass}>
                  <option>Yearly</option>
                </Select>
              </div>
              <div>
                <label className={labelClass}>Policy Number <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Policy Number" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Policy Login Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Policy Start Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Policy End Date <span className="text-red-500">*</span></label>
                <DatePicker className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Policy Inspection Date</label>
                <DatePicker className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                <Select className={inputClass}><option>Select Plan Type</option></Select>
              </div>
              <div>
                <label className={labelClass}>Sum Assured <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Sum Assured" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Bonus</label>
                <input type="text" placeholder="Enter Bonus" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Health Check Up</label>
                <Select className={inputClass}><option>Select Health Check Up</option></Select>
              </div>
              <div>
                <label className={labelClass}>Health Check Up Amount</label>
                <input type="text" placeholder="Enter Health Check Up Amount" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Deductable</label>
                <input type="text" placeholder="Enter Deductable" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Claim</label>
                <input type="text" placeholder="Enter Claim" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Net Premium <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Net Premium" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>GST Amount</label>
                <input type="text" defaultValue="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Total Premium <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="0" className={inputClass} />
              </div>

            </div>
          </div>

          {/* Commission Information */}
          <div>
            <div className={sectionHeaderClass}>
              <BanknoteIcon /> Commission Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Company Expected Commission</label>
                <input type="text" placeholder="Enter Company Commission" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company TDS Amount</label>
                <input type="text" placeholder="Enter Company TDS Amount" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Note Details */}
          <div>
            <div className={sectionHeaderClass}>
              <NoteIcon /> Note Details
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <textarea rows={4} className={inputClass}></textarea>
            </div>
          </div>

          {/* Additional Document Information */}
          <div>
            <div className="flex items-center justify-between bg-[#EEF1FA] text-[#2B4399] px-5 py-3 rounded-lg mb-5">
              <div className="flex items-center gap-2 text-[15px] font-bold">
                <FileIcon /> Additional Document Information
              </div>
              <button type="button" onClick={addDocument} className="bg-[#2B4399] text-white p-1.5 rounded-md hover:bg-[#203378] transition-colors shadow-sm">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc.id} className="flex items-center gap-4">
                  <div className="flex-[2]">
                    <input type="text" placeholder="Select Other Document Name" className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <input type="file" className="border border-gray-300 rounded-lg text-sm px-4 py-1.5 w-full file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer shadow-sm bg-white" />
                  </div>
                  {index === 0 ? (
                    <button type="button" onClick={() => removeDocument(doc.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm invisible">
                      <Minus size={18} />
                    </button>
                  ) : (
                    <button type="button" onClick={() => removeDocument(doc.id)} className="bg-[#cf3838] text-white p-2.5 rounded-lg hover:bg-[#a12828] transition-colors shrink-0 shadow-sm">
                      <Minus size={18} />
                    </button>
                  )}
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

// Minimal Icons to match the screenshot section headers
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}
function BanknoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
}
function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
