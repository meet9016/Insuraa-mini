import React from 'react';
import { X, FileText, Calendar, CreditCard, Building2, UserCheck, ShieldCheck, Download, ExternalLink, Paperclip, Users, Layers, AlertCircle } from 'lucide-react';
import { useViewLifeInsurance } from '@/hooks/useLifeInsuranceApi';

interface LifeInsuranceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifeInsuranceId: string | number | null;
}

export default function LifeInsuranceViewModal({
  isOpen,
  onClose,
  lifeInsuranceId
}: LifeInsuranceViewModalProps) {
  const { data, isLoading } = useViewLifeInsurance(isOpen ? lifeInsuranceId : null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Life Insurance Details</h2>
                {data?.policy_number && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                    #{data.policy_number}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5">Comprehensive view of policy records & schedules</p>
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
                  <p className="text-base font-bold text-[#2B4399] mt-0.5">{data.company_name || data.companies_name || `Company #${data.companies_id}`}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Name</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.plan_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Type</span>
                  <div className="mt-1">
                    <span className="bg-blue-50 text-[#2B4399] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                      {data.plan_type === '1' ? 'Fresh' : data.plan_type === '3' ? 'Renewal' : data.plan_type || 'Fresh'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Cards */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2B4399]" /> Financial Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Sum Assured</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.sum_assured || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Net Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.net_premium || data.premium || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">GST ({data.fy_gst || '18'}%)</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.gst_amount || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 shadow-sm">
                    <span className="text-[11px] text-[#2B4399] font-bold block">Total Premium</span>
                    <span className="text-base font-extrabold text-[#2B4399] block mt-1">₹{data.total_premium || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Maturity Amount</span>
                    <span className="text-sm font-bold text-emerald-600 block mt-1">₹{data.maturity_amount || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Overdue Days</span>
                    <span className="text-sm font-bold text-amber-600 block mt-1">{data.premium_overdue_days || '30'} Days</span>
                  </div>
                </div>
              </div>

              {/* Policy Dates & Timeline */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2B4399]" /> Key Dates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium block">Login Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_login_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Start Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_start_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Premium End Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_end_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Term End Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_term_end_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Maturity Date</span>
                    <span className="font-bold text-emerald-600 text-sm mt-0.5 block">{data.maturity_date || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              {(data.bank_name || data.account_number || data.account_holder_name) && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2B4399]" /> Bank Details in Policy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium block">Bank Name</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.bank_name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium block">Account Type</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.account_type || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium block">Account Number</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.account_number || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium block">IFSC Code</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.ifsc_code || '-'}</span>
                    </div>
                  </div>
                  {data.account_holder_name && (
                    <div className="mt-3 text-xs pt-3 border-t border-gray-100">
                      <span className="text-gray-400 font-medium">Account Holder Name: </span>
                      <span className="font-bold text-gray-800">{data.account_holder_name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Riders Section */}
              {Array.isArray(data.riders) && data.riders.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2B4399]" /> Riders ({data.riders.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                          <th className="py-2.5 px-3">Rider Name</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.riders.map((r: any, idx: number) => (
                          <tr key={r.id || idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-bold text-gray-800">{r.rider_name || `Rider #${r.riders_id}`}</td>
                            <td className="py-2.5 px-3 font-semibold text-gray-900">₹{r.amount || r.riders_amount || '0'}</td>
                            <td className="py-2.5 px-3 text-gray-500">{r.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Nominees Section */}
              {Array.isArray(data.nominees) && data.nominees.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2B4399]" /> Nominee Details ({data.nominees.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                          <th className="py-2.5 px-3">Nominee Name</th>
                          <th className="py-2.5 px-3">Relationship</th>
                          <th className="py-2.5 px-3">Percentage (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.nominees.map((n: any, idx: number) => (
                          <tr key={n.id || idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-bold text-gray-800">{n.nomainee_name || 'N/A'}</td>
                            <td className="py-2.5 px-3 font-medium text-gray-700">{n.relationship_name || `Relationship #${n.nomainee_relationship}`}</td>
                            <td className="py-2.5 px-3 font-bold text-[#2B4399]">{n.nomainee_per || '100'}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Installments Schedule */}
              {Array.isArray(data.installments) && data.installments.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2B4399]" /> Installment Schedule ({data.installments.length})
                  </h3>
                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Due Date</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">GST</th>
                          <th className="py-2.5 px-3">Final Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.installments.map((inst: any, idx: number) => (
                          <tr key={inst.id || idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-medium text-gray-800">{inst.start_date || '-'}</td>
                            <td className="py-2.5 px-3 text-gray-700">₹{inst.amount || '0'}</td>
                            <td className="py-2.5 px-3 text-gray-700">₹{inst.gst_amount || '0'} ({inst.gst || '0'}%)</td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">₹{inst.final_amount || inst.amount || '0'}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${inst.payment_status === '1' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {inst.payment_status === '1' ? 'Paid' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Documents & Attachments */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#2B4399]" /> Attachments & Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.policy_pdf && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-[#2B4399] rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">Policy Document PDF</p>
                          <p className="text-[11px] text-gray-500">Official policy file attachment</p>
                        </div>
                      </div>
                      <a
                        href={data.policy_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-bold bg-[#2B4399] text-white px-3 py-1.5 rounded-lg hover:bg-[#203378] transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {Array.isArray(data.documents) && data.documents.map((doc: any, idx: number) => (
                    <div key={doc.id || idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 text-gray-700 rounded-lg">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{doc.other_document_name ? `Document #${doc.other_document_name}` : `Other Document ${idx + 1}`}</p>
                          <p className="text-[11px] text-gray-500">Attached file</p>
                        </div>
                      </div>
                      {doc.other_document_image && (
                        <a
                          href={doc.other_document_image}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Details */}
              {data.note && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Policy Note / Remarks</h3>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono whitespace-pre-wrap">
                    {data.note}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
