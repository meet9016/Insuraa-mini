import React from 'react';
import { X, FileText, Calendar, CreditCard, ShieldCheck, Download, ExternalLink, Paperclip, AlertCircle, Car, Settings, Hash, Barcode, UserCheck } from 'lucide-react';
import { useViewMotorInsurance } from '@/hooks/useMotorInsuranceApi';

interface MotorInsuranceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  motorInsuranceId: string | number | null;
}

export default function MotorInsuranceViewModal({
  isOpen,
  onClose,
  motorInsuranceId
}: MotorInsuranceViewModalProps) {
  const { data, isLoading } = useViewMotorInsurance(isOpen ? motorInsuranceId : null);

  if (!isOpen) return null;

  const planTypeDisplay = () => {
    if (!data) return 'Fresh';
    const raw = String(data.plan_type_name || data.plan_type || '').trim();
    if (raw === '1') return 'Fresh';
    if (raw === '2') return 'Port';
    if (raw === '3') return 'Renewal';
    return raw || 'Fresh';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Motor Insurance Details</h2>
                {data?.policy_number && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                    #{String(data.policy_number).trim()}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5">Comprehensive view of motor policy details</p>
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
              <p className="text-sm font-semibold text-gray-600">Loading motor policy details...</p>
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
                  <p className="text-base font-bold text-[#2B4399] mt-0.5">{data.companies_name || data.company_name || `Company #${data.companies_id}`}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Name</span>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">{data.plan_name_text || data.plan_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan Type</span>
                  <div className="mt-1">
                    <span className="bg-blue-50 text-[#2B4399] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                      {planTypeDisplay()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insurance & Agency Overview */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2B4399]" /> Policy & Agency Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium block">Vehicle Type</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{data.vehicle_type_name || data.vehicle_type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Class of Vehicle</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{data.class_of_vehicle_name || data.class_of_vehicle || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Insurance Type</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{data.insurance_type_name || data.insurance_type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Agency Code</span>
                    <span className="font-bold text-gray-800 block mt-0.5">
                      {data.companies_agency_code_name ? `${data.companies_agency_code_name} (${data.companies_agency_code_val || ''})` : (data.companies_agency_code || 'N/A')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#2B4399]" /> Vehicle Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium flex items-center gap-1"><Hash size={12} /> Registration (RTO)</span>
                    <span className="font-bold text-gray-900 block mt-0.5">{String(data.registration_number_rto || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium flex items-center gap-1"><Settings size={12} /> Engine Number</span>
                    <span className="font-bold text-gray-900 block mt-0.5">{String(data.engine_number || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium flex items-center gap-1"><Barcode size={12} /> Chassis Number</span>
                    <span className="font-bold text-gray-900 block mt-0.5">{String(data.chasis_no || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Make / Model / Variant</span>
                    <span className="font-bold text-gray-900 block mt-0.5">{String(data.make_model_variant || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">MFY (Year)</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{String(data.mfy_year_of_manufacture || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">NCB %</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{String(data.ncb || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">CNG Value</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{String(data.cng_value || 'N/A').trim()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Vehicle Value (IDV)</span>
                    <span className="font-bold text-gray-900 block mt-0.5">₹{String(data.vehicle_value || '0').trim()}</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Cards */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2B4399]" /> Financial Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">OD Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.own_damage_premimum || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">TP Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.tp_premium || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">Net Premium</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.net_premium || '0'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-[11px] text-gray-400 font-semibold block">GST Amount</span>
                    <span className="text-sm font-bold text-gray-900 block mt-1">₹{data.gst_amount || '0'}</span>
                  </div>
                  <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-sm col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-emerald-600 font-bold block">Total Premium</span>
                    <span className="text-sm font-extrabold text-emerald-700 block mt-1">₹{data.total_premium || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Policy Schedule / Dates */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2B4399]" /> Policy Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-medium block">Policy Login Date</span>
                    <span className="font-bold text-gray-900 block mt-1">{data.policy_login_date || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-medium block">Policy Start Date</span>
                    <span className="font-bold text-gray-900 block mt-1">{data.policy_start_date || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-medium block">Policy End Date</span>
                    <span className="font-bold text-gray-900 block mt-1">{data.policy_end_date || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Note Details */}
              {data.note && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Note</h3>
                  <p className="text-xs text-gray-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap leading-relaxed">
                    {data.note}
                  </p>
                </div>
              )}

              {/* Policy Documents */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#2B4399]" /> Documents & Attachments
                </h3>
                
                <div className="space-y-3">
                  {/* Primary Policy PDF */}
                  {data.policy_pdf ? (
                    <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#2B4399]" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Main Policy PDF Document</p>
                          <p className="text-[11px] text-gray-500">Official issued policy document</p>
                        </div>
                      </div>
                      <a
                        href={data.policy_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B4399] text-white text-xs font-bold rounded-lg hover:bg-[#203378] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View PDF
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No main policy PDF attached.</p>
                  )}

                  {/* Additional Documents */}
                  {Array.isArray(data.documents) && data.documents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <p className="text-xs font-bold text-gray-700">Additional Attached Documents</p>
                      {data.documents.map((doc: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-xs font-medium text-gray-800">{doc.other_document_name || `Document #${idx + 1}`}</span>
                          {doc.other_document_image && (
                            <a
                              href={doc.other_document_image}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#2B4399] font-bold hover:underline flex items-center gap-1"
                            >
                              <Download size={13} /> View File
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
