import React from 'react';
import { useOtherInsuranceView } from '@/hooks/useOtherInsuranceApi';
import { X, FileText, Calendar, CreditCard, UserCheck, AlertCircle, ExternalLink } from 'lucide-react';

interface ViewOtherInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
}

export default function ViewOtherInsuranceModal({ isOpen, onClose, id }: ViewOtherInsuranceModalProps) {
  const { data, isLoading } = useOtherInsuranceView(id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Other Insurance Details</h2>
                {data?.policy_number && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                    #{data.policy_number}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5">Comprehensive view of policy records & documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#2B4399] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-gray-600">Loading policy details...</p>
            </div>
          ) : !data ? (
            <div className="py-16 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold">No policy details found</p>
            </div>
          ) : (
            <>
              {/* Top Banner Overview */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Policy Number</span>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{data.policy_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Company</span>
                  <p className="text-base font-bold text-[#2B4399] mt-0.5">{data.companies_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Name</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.plan_name_text || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Type</span>
                  <div className="mt-1">
                    <span className="bg-blue-50 text-[#2B4399] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                      {data.plan_type_name || 'Fresh'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Insurance Type</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.insurance_type_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.policy_status_name || 'N/A'}</p>
                </div>
              </div>

              {/* Financial Breakdown Cards */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2B4399]" /> Financial Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Sum Assured</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.sum_assured || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Net Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.net_premium || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">GST ({data.fy_gst || '18'}%)</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.gst_amount || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 shadow-sm">
                    <span className="text-[11px] text-[#2B4399] font-bold block">Total Premium</span>
                    <span className="text-base font-extrabold text-[#2B4399] block mt-1">₹{data.total_premium || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Policy Dates & Timeline */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2B4399]" /> Key Dates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium block">Login Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_login_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Start Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_start_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">End Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_end_date || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#2B4399]" />
                  <h3 className="text-sm font-bold text-gray-800">Customer Details</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Customer Name</th>
                        <th className="px-5 py-3 font-semibold">Phone Number</th>
                        <th className="px-5 py-3 font-semibold">Email</th>
                        <th className="px-5 py-3 font-semibold">Group Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-gray-900 font-semibold">{data.customer_name || '-'}</td>
                        <td className="px-5 py-4 text-gray-600">{data.customer_number || '-'}</td>
                        <td className="px-5 py-4 text-gray-600">{data.customer_email || '-'}</td>
                        <td className="px-5 py-4 font-mono text-sm text-gray-500">{data.customer_group_code || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note (if available) */}
              {data.note && (
                <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" /> Notes & Remarks
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">{data.note}</p>
                </div>
              )}

              {/* Documents Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2B4399]" />
                  <h3 className="text-sm font-bold text-gray-800">Attached Documents</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3 font-semibold w-2/3">Document Name</th>
                        <th className="px-5 py-3 font-semibold text-right w-1/3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* Policy PDF */}
                      {data.policy_pdf && (
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-gray-800 font-medium flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </span>
                            Policy PDF
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <a 
                              href={data.policy_pdf} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-[#2B4399] hover:text-[#1a2963] font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View File
                            </a>
                          </td>
                        </tr>
                      )}
                      
                      {/* Other Documents */}
                      {data.documents && data.documents.map((doc: any, index: number) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-gray-800 font-medium flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </span>
                            {doc.document_name || `Document ${index + 1}`}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <a 
                              href={doc.document_image} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-[#2B4399] hover:text-[#1a2963] font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View File
                            </a>
                          </td>
                        </tr>
                      ))}

                      {/* No documents empty state */}
                      {!data.policy_pdf && (!data.documents || data.documents.length === 0) && (
                        <tr>
                          <td colSpan={2} className="px-5 py-8 text-center text-gray-400">
                            No documents attached.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Footer Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
                >
                  Close
                </button>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
