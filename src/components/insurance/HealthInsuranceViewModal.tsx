import React from 'react';
import { X, FileText, Calendar, CreditCard, Building2, ShieldCheck, ExternalLink, Paperclip, Users, Layers, AlertCircle, HeartPulse } from 'lucide-react';
import { useViewHealthInsurance } from '@/hooks/useHealthInsuranceApi';

interface HealthInsuranceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthInsuranceId: string | number | null;
}

export default function HealthInsuranceViewModal({
  isOpen,
  onClose,
  healthInsuranceId
}: HealthInsuranceViewModalProps) {
  const { data, isLoading } = useViewHealthInsurance(isOpen ? healthInsuranceId : null);

  if (!isOpen) return null;

  const relationshipMap: { [key: string]: string } = {
    '1': 'Self',
    '2': 'Spouse / Husband / Wife',
    '3': 'Father',
    '4': 'Mother',
    '5': 'Son',
    '6': 'Daughter',
    '7': 'Brother',
    '8': 'Sister',
  };

  const getRelationshipName = (rel: any) => {
    const key = String(rel || '').trim();
    return relationshipMap[key] || (key ? `Relationship #${key}` : 'N/A');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Health Insurance Details</h2>
                {data?.policy_number && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                    #{String(data.policy_number).trim()}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5">Comprehensive view of health policy records & members</p>
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
              <p className="text-sm font-semibold text-gray-600">Loading health policy details...</p>
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
                  <p className="text-base font-bold text-gray-900 mt-0.5">{String(data.policy_number || 'N/A').trim()}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Company</span>
                  <p className="text-base font-bold text-[#2B4399] mt-0.5">{data.company_name || data.companies_name || `Company #${data.companies_id}`}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Name</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.plan_name_text || data.plan_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Type</span>
                  <div className="mt-1">
                    <span className="bg-blue-50 text-[#2B4399] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                      {String(data.plan_type) === '1' ? 'Fresh' : String(data.plan_type) === '2' ? 'Port' : String(data.plan_type) === '3' ? 'Renewal' : (data.plan_type || 'Fresh')}
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
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{String(data.sum_assured || '0').trim()}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Net Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{String(data.net_premium || '0').trim()}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">GST Amount</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{String(data.gst_amount || '0').trim()}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 shadow-sm">
                    <span className="text-[11px] text-[#2B4399] font-bold block">Total Premium</span>
                    <span className="text-base font-extrabold text-[#2B4399] block mt-1">₹{String(data.total_premium || '0').trim()}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Deductible</span>
                    <span className="text-sm font-bold text-amber-600 block mt-1">₹{String(data.deductable || '0').trim()}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Bonus</span>
                    <span className="text-sm font-bold text-emerald-600 block mt-1">₹{String(data.bonus || '0').trim()}</span>
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
                    <span className="text-gray-400 font-medium block">End Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_end_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Term End Date</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{data.policy_term_end_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Inspection Date</span>
                    <span className="font-bold text-indigo-600 text-sm mt-0.5 block">{data.policy_inspection_date || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Insured Members Section */}
              {Array.isArray(data.members) && data.members.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2B4399]" /> Insured Members ({data.members.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                          <th className="py-2.5 px-3">Member Name</th>
                          <th className="py-2.5 px-3">Relationship</th>
                          <th className="py-2.5 px-3">DOB</th>
                          <th className="py-2.5 px-3">Age</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.members.map((m: any, idx: number) => (
                          <tr key={m.id || idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-bold text-gray-800">{m.full_name || m.member_name || m.name || 'N/A'}</td>
                            <td className="py-2.5 px-3 font-medium text-gray-700">{getRelationshipName(m.relationship || m.member_relationship)}</td>
                            <td className="py-2.5 px-3 text-gray-700">{m.birth_date || m.member_dob || m.dob || '-'}</td>
                            <td className="py-2.5 px-3 font-bold text-[#2B4399]">{m.age || m.member_age || '-'} Yrs</td>
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
                          <th className="py-2.5 px-3">Start Date</th>
                          <th className="py-2.5 px-3">End Date</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">GST Amount</th>
                          <th className="py-2.5 px-3">Final Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.installments.map((inst: any, idx: number) => (
                          <tr key={inst.id || idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-medium text-gray-800">{inst.start_date || '-'}</td>
                            <td className="py-2.5 px-3 font-medium text-gray-800">{inst.end_date || '-'}</td>
                            <td className="py-2.5 px-3 text-gray-700">₹{inst.amount || '0'}</td>
                            <td className="py-2.5 px-3 text-gray-700">₹{inst.gst_amount || '0'}</td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">₹{inst.final_amount || inst.amount || '0'}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${String(inst.payment_status) === '1' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {String(inst.payment_status) === '1' ? 'Paid' : 'Pending'}
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
                          <p className="text-[11px] text-gray-500">Official health policy document file</p>
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
                          <p className="text-xs font-bold text-gray-800">{doc.other_document_name || `Other Document ${idx + 1}`}</p>
                          <p className="text-[11px] text-gray-500">Attached document</p>
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
              {data.note && String(data.note).trim() && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Policy Note / Remarks</h3>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono whitespace-pre-wrap">
                    {String(data.note).trim()}
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
