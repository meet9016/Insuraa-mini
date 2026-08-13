import React, { useState } from 'react';
import Head from 'next/head';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';

export default function AddHealthQuotation() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([{ id: 1 }]);
  const [members, setMembers] = useState([{ id: 1 }]);

  const addQuote = () => setQuotes([...quotes, { id: Date.now() }]);
  const removeQuote = (id: number) => {
    if (quotes.length > 1) setQuotes(quotes.filter(q => q.id !== id));
  };

  const addMember = () => setMembers([...members, { id: Date.now() }]);
  const removeMember = (id: number) => {
    if (members.length > 1) setMembers(members.filter(m => m.id !== id));
  };

  const sectionHeaderClass = "bg-[#EEF1FA] text-[#2B4399] px-5 py-3 text-[15px] font-bold rounded-lg flex justify-between items-center mb-5";
  const labelClass = "text-[13px] font-bold text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";
  const smallInputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all bg-white shadow-sm placeholder:text-gray-400";

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)] p-6">
      <Head>
        <title>Add Health Quotation - Insuraa</title>
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
            <h1 className="text-xl">Add Health Quotation</h1>
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

          {/* Proposal Information */}
          <div>
            <div className={sectionHeaderClass}>
              Proposal Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <label className={labelClass}>Proposal Type</label>
                <Select className={inputClass}><option>-Select-</option></Select>
              </div>
              <div>
                <label className={labelClass}>Plan Opted</label>
                <Select className={inputClass}><option>-Select-</option></Select>
              </div>
              <div>
                <label className={labelClass}>Family Size</label>
                <Select className={inputClass}><option>-Select-</option></Select>
              </div>
              <div>
                <label className={labelClass}>Policy Tenure</label>
                <input type="text" defaultValue="1" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Client Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Client Name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" placeholder="Email" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>MobileNo</label>
                <input type="text" placeholder="MobileNo" className={inputClass} />
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
            </div>
          </div>

          {/* Quotation Details */}
          <div>
            <div className={sectionHeaderClass}>
              Quotation Details
              <button
                type="button"
                onClick={addQuote}
                className="bg-[#2B4399] text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 hover:bg-[#203378] transition-colors"
              >
                <Plus size={16} strokeWidth={3} /> Add Quote
              </button>
            </div>

            <div className="space-y-6">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                      <label className={labelClass}>Company <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Company name" className={smallInputClass} />
                    </div>
                    <div className="md:col-span-3">
                      <label className={labelClass}>Product <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Product name" className={smallInputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Zone</label>
                      <input type="text" placeholder="A" className={smallInputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>SA</label>
                      <input type="text" placeholder="Sum assured" className={smallInputClass} />
                    </div>
                    <div className="md:col-span-1 flex flex-col items-center">
                      <label className="text-[12px] font-bold text-gray-700 mb-2">Recommended</label>
                      <input type="radio" name="recommendedQuote" className="w-4 h-4 text-[#2B4399] focus:ring-[#2D3591]" />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeQuote(quote.id)}
                        className="bg-[#da3f49] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c9303a] transition-colors w-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}>Addon</label>
                      <input type="text" placeholder="Addon details" className={smallInputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Premium 1Y <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="0" className={smallInputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Premium 2Y</label>
                      <input type="text" placeholder="0" className={smallInputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Premium 3Y</label>
                      <input type="text" placeholder="0" className={smallInputClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Details */}
          <div>
            <div className={sectionHeaderClass}>
              Member Details
              <button
                type="button"
                onClick={addMember}
                className="bg-[#2B4399] text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 hover:bg-[#203378] transition-colors"
              >
                <Plus size={16} strokeWidth={3} /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="md:col-span-3">
                    <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Member name" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Relation <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Self" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>DOB <span className="text-red-500">*</span></label>
                    <DatePicker className={smallInputClass}  />
                  </div>
                  <div className="md:col-span-1">
                    <label className={labelClass}>Age</label>
                    <input type="text" placeholder="0" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Male" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-1">
                    <label className={labelClass}>Medical History</label>
                    <input type="text" placeholder="No" className={smallInputClass} />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="bg-[#da3f49] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c9303a] transition-colors w-full"
                    >
                      Delete
                    </button>
                  </div>
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
