import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';

export default function AddMotorQuotation() {
  const router = useRouter();
  const [details, setDetails] = useState([{ id: 1 }]);

  const addDetail = () => setDetails([...details, { id: Date.now() }]);
  const removeDetail = (id: number) => {
    if (details.length > 1) setDetails(details.filter(d => d.id !== id));
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex justify-between items-center mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";
  const smallInputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>Add Motor Quotation - Insuraa</title>
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
            <h1 className="text-xl">Add Motor Quotation</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="button" className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#203378] transition-colors shadow-sm">
              Save Quotation
            </button>
          </div>
        </div>

        <form className="space-y-8 bg-white">
          
          {/* Motor Information */}
          <div>
            <div className={sectionHeaderClass}>
              Motor Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>Insured Person Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>MobileNo</label>
                <input type="text" placeholder="MobileNo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" placeholder="Email" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>House / Flat No</label>
                <input type="text" placeholder="House / Flat No" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Street</label>
                <input type="text" placeholder="Street" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Area</label>
                <input type="text" placeholder="Area" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" placeholder="City" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input type="text" placeholder="Pincode" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" placeholder="State" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Vehicle Type <span className="text-red-500">*</span></label>
                <input type="text" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Make</label>
                <input type="text" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input type="text" placeholder="Model" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Registration No</label>
                <input type="text" placeholder="Registration No" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <div className={sectionHeaderClass}>
              Vehicle Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>Year Of Manufacture</label>
                <input type="text" placeholder="Year Of Manufacture" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CC/GVW</label>
                <input type="text" placeholder="CC/Gross Vehicle Weight" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Zone</label>
                <input type="text" placeholder="A" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Seating Capacity</label>
                <input type="text" placeholder="Seating Capacity" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Total IDV</label>
                <input type="text" placeholder="Total IDV" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>NCB %</label>
                <input type="text" placeholder="NCB %" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Comparison Details */}
          <div>
            <div className={sectionHeaderClass}>
              Comparison Details
              <button 
                type="button" 
                onClick={addDetail}
                className="bg-[#2B4399] text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 hover:bg-[#203378] transition-colors"
              >
                <Plus size={16} strokeWidth={3} /> Add Detail
              </button>
            </div>
            
            <div className="space-y-4">
              {details.map((detail) => (
                <div key={detail.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Company Name</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Add On</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>IDV</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Premium</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-1">
                    <label className={labelClass}>Discount</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-1">
                    <label className={labelClass}>Remarks</label>
                    <input type="text" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-1 flex flex-col items-center">
                    <label className="text-[10px] font-bold text-gray-700 mb-2">Recommended</label>
                    <input type="radio" name="recommendedMotor" className="w-4 h-4 text-[#2B4399] focus:ring-[#2D3591]" />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => removeDetail(detail.id)}
                      className="bg-[#da3f49] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#c9303a] transition-colors w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Details */}
          <div>
            <div className={sectionHeaderClass}>
              Other Details
            </div>
            <div>
              <label className={labelClass}>Remarks</label>
              <textarea rows={2} className={inputClass}></textarea>
            </div>
          </div>

          {/* Footer / Save Button removed and placed at top */}

        </form>
      </div>
    </div>
  );
}
