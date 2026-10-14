import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Hash,
  Calendar,
  CreditCard,
  Shield,
  HeartPulse,
  Car,
  Umbrella,
  FileText,
  FileCheck,
  AlertCircle,
  Download,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Scale,
  Ruler,
  Users,
  Eye
} from 'lucide-react';
import { useViewCustomer } from '@/hooks/useCustomerApi';
import LifeInsuranceViewModal from '@/components/insurance/LifeInsuranceViewModal';
import HealthInsuranceViewModal from '@/components/insurance/HealthInsuranceViewModal';
import MotorInsuranceViewModal from '@/components/insurance/MotorInsuranceViewModal';
import ViewOtherInsuranceModal from '@/pages/insurance/other/components/ViewOtherInsuranceModal';

export interface CustomerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string | number | null;
  customer?: any | null;
}

export default function CustomerViewModal({
  isOpen,
  onClose,
  customerId,
  customer: initialCustomer
}: CustomerViewModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'policies' | 'claims'>('profile');

  // Policy view sub-modal states
  const [viewLifeId, setViewLifeId] = useState<string | number | null>(null);
  const [viewHealthId, setViewHealthId] = useState<string | number | null>(null);
  const [viewMotorId, setViewMotorId] = useState<string | number | null>(null);
  const [viewOtherId, setViewOtherId] = useState<string | null>(null);

  const targetCustomerId = customerId || initialCustomer?.customer_id || initialCustomer?.id;
  const { data: viewData, isLoading } = useViewCustomer(isOpen && targetCustomerId ? targetCustomerId : null);

  if (!isOpen) return null;

  const customer = viewData?.customer || viewData?.data?.customer || initialCustomer || {};
  const counts = viewData?.counts || viewData?.data?.counts || {
    life_insurance: 0,
    health_insurance: 0,
    motor_insurance: 0,
    other_insurance: 0,
    total_policy: 0,
    claim: 0,
    health_quotation: 0,
    motor_quotation: 0,
    total_quotation: 0
  };

  const lifePolicies = viewData?.life_insurance || viewData?.data?.life_insurance || [];
  const healthPolicies = viewData?.health_insurance || viewData?.data?.health_insurance || [];
  const motorPolicies = viewData?.motor_insurance || viewData?.data?.motor_insurance || [];
  const otherPolicies = viewData?.other_insurance || viewData?.data?.other_insurance || [];
  const claims = viewData?.claims || viewData?.data?.claims || [];
  const healthQuotations = viewData?.health_quotations || viewData?.data?.health_quotations || [];
  const motorQuotations = viewData?.motor_quotations || viewData?.data?.motor_quotations || [];
  const otherDocuments = customer?.customer_other_document || [];

  const totalPolicies = counts?.total_policy ?? (lifePolicies.length + healthPolicies.length + motorPolicies.length + otherPolicies.length);
  const totalClaimsAndQuotes = (counts?.claim ?? claims.length) + (counts?.total_quotation ?? (healthQuotations.length + motorQuotations.length));

  const firstLetter = (customer?.full_name || customer?.first_name || 'C').trim().charAt(0).toUpperCase();

  const handleEdit = () => {
    onClose();
    const editId = customer?.customer_id || customer?.id || targetCustomerId;
    if (editId) {
      router.push(`/customers/add?id=${editId}`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="bg-[#2B4399] text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold">Customer View</h2>
                </div>
                <p className="text-xs text-blue-100 mt-0.5">Comprehensive profile, policies, claims & quotations records</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {isLoading && !initialCustomer ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#2B4399] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-gray-600">Loading customer details...</p>
              </div>
            ) : !customer?.customer_id && !customer?.full_name ? (
              <div className="py-16 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold">No customer details found</p>
              </div>
            ) : (
              <>
                {/* Profile Top Banner */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {customer?.image ? (
                      <img
                        src={customer.image}
                        alt={customer.full_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#2B4399]/20 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2B4399] to-[#435EC7] text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
                        {firstLetter}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{customer.full_name || 'Customer'}</h3>
                        {customer.customer_type_name && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-[#2B4399] border border-blue-200">
                            {customer.customer_type_name}
                          </span>
                        )}
                        {customer.group_code && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                            {customer.group_code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-600 flex-wrap">
                        {customer.number && (
                          <a
                            href={`tel:${customer.number}`}
                            className="flex items-center gap-1.5 hover:text-[#2B4399] font-medium transition-colors"
                          >
                            <Phone size={13} className="text-[#2B4399]" />
                            <span>{customer.number}</span>
                          </a>
                        )}
                        {customer.email && (
                          <a
                            href={`mailto:${customer.email}`}
                            className="flex items-center gap-1.5 hover:text-[#2B4399] font-medium transition-colors"
                          >
                            <Mail size={13} className="text-[#2B4399]" />
                            <span>{customer.email}</span>
                          </a>
                        )}
                        {(customer.city || customer.state) && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <MapPin size={13} className="text-gray-400" />
                            <span>{[customer.city, customer.state].filter(Boolean).join(', ')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#2B4399] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit size={13} />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* Statistics & Counts Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Total Policies</span>
                      <Shield size={14} className="text-[#2B4399]" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{totalPolicies}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Life</span>
                      <HeartPulse size={14} className="text-rose-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.life_insurance ?? lifePolicies.length}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Health</span>
                      <Shield size={14} className="text-emerald-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.health_insurance ?? healthPolicies.length}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Motor</span>
                      <Car size={14} className="text-blue-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.motor_insurance ?? motorPolicies.length}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Other</span>
                      <Umbrella size={14} className="text-purple-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.other_insurance ?? otherPolicies.length}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Claims</span>
                      <FileCheck size={14} className="text-amber-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.claim ?? claims.length}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span className="text-xs font-medium">Quotations</span>
                      <FileText size={14} className="text-cyan-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{counts?.total_quotation ?? (healthQuotations.length + motorQuotations.length)}</span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`pb-2.5 px-3.5 text-xs font-bold transition-all relative cursor-pointer ${activeTab === 'profile'
                        ? 'text-[#2B4399] border-b-2 border-[#2B4399]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Profile & KYC Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('policies')}
                    className={`pb-2.5 px-3.5 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${activeTab === 'policies'
                        ? 'text-[#2B4399] border-b-2 border-[#2B4399]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <span>Policies & Coverages</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeTab === 'policies' ? 'bg-[#2B4399] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                      {totalPolicies}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('claims')}
                    className={`pb-2.5 px-3.5 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${activeTab === 'claims'
                        ? 'text-[#2B4399] border-b-2 border-[#2B4399]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <span>Claims & Quotations</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeTab === 'claims' ? 'bg-[#2B4399] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                      {totalClaimsAndQuotes}
                    </span>
                  </button>
                </div>

                {/* TAB 1: Profile & KYC Details */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Personal & Demographics */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User size={15} className="text-[#2B4399]" /> Personal Demographics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Date of Birth</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.dob || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Age</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.age ? `${customer.age} Yrs` : '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Gender</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.gender_name || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Marital Status</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.marital_status_name || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Anniversary Date</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.anniversary_date || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Education</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.education_name || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Height</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.height ? `${customer.height} ft` : '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Weight</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.weight ? `${customer.weight} kg` : '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Reference By</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.reference_by || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <span className="text-xs font-medium text-gray-500 block">Registered On</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.created_at || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* KYC & Identity Proofs */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard size={15} className="text-[#2B4399]" /> Identification & KYC
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-gray-200/80">
                          <span className="text-xs font-medium text-gray-500 block">PAN Card Number</span>
                          <p className="font-mono font-bold text-gray-900 mt-1 tracking-wider text-sm">
                            {customer.pancard_no || 'Not Provided'}
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-gray-200/80">
                          <span className="text-xs font-medium text-gray-500 block">Aadhaar Card Number</span>
                          <p className="font-mono font-bold text-gray-900 mt-1 tracking-wider text-sm">
                            {customer.adhar_card_no || 'Not Provided'}
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-gray-200/80">
                          <span className="text-xs font-medium text-gray-500 block">Nationality</span>
                          <p className="font-semibold text-gray-900 mt-1 text-sm">
                            {customer.nationality || 'India'}
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-gray-200/80">
                          <span className="text-xs font-medium text-gray-500 block">Group Code</span>
                          <p className="font-mono font-bold text-[#2B4399] mt-1 text-sm">
                            {customer.group_code || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={15} className="text-[#2B4399]" /> Communication Address
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100 col-span-2">
                          <span className="text-xs font-medium text-gray-500 block">Street Address</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.address || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100">
                          <span className="text-xs font-medium text-gray-500 block">City</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.city || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100">
                          <span className="text-xs font-medium text-gray-500 block">State</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.state || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100">
                          <span className="text-xs font-medium text-gray-500 block">Pincode</span>
                          <p className="text-sm font-mono font-semibold text-gray-900 mt-1">{customer.pincode || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 rounded-lg border border-gray-100">
                          <span className="text-xs font-medium text-gray-500 block">Country</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customer.nationality || 'India'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Documents */}
                    {Array.isArray(otherDocuments) && otherDocuments.length > 0 && (
                      <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Paperclip size={15} className="text-[#2B4399]" /> KYC & Other Documents ({otherDocuments.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {otherDocuments.map((doc: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50/80 rounded-lg border border-gray-200/70 flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-800 truncate">{doc.name || `Document #${i + 1}`}</span>
                              {doc.file_url && (
                                <a
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#2B4399] hover:underline inline-flex items-center gap-1 font-bold ml-2"
                                >
                                  <ExternalLink size={12} /> View
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Policies & Coverages */}
                {activeTab === 'policies' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {totalPolicies === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-700">No Policies Found</p>
                        <p className="text-xs text-gray-500 mt-1">This customer does not have any active or recorded insurance policies.</p>
                      </div>
                    ) : (
                      <>
                        {/* Life Insurance */}
                        {lifePolicies.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <HeartPulse size={15} className="text-rose-500" /> Life Insurance ({lifePolicies.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Policy Number</th>
                                    <th className="py-2.5 px-3">Company</th>
                                    <th className="py-2.5 px-3">Plan Type</th>
                                    <th className="py-2.5 px-3">Period</th>
                                    <th className="py-2.5 px-3">Sum Assured</th>
                                    <th className="py-2.5 px-3">Premium</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {lifePolicies.map((p: any, i: number) => {
                                    const lifeId = p.life_insurance_id || p.policy_id;
                                    return (
                                      <tr key={lifeId || i} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="py-2.5 px-3">
                                          <button
                                            type="button"
                                            onClick={() => setViewLifeId(lifeId)}
                                            className="font-mono font-bold text-[#2B4399] hover:underline cursor-pointer flex items-center gap-1.5"
                                            title="Click to view details"
                                          >
                                            <span>{p.policy_number || `Policy #${lifeId}`}</span>
                                          </button>
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-800 font-medium">{p.company_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.plan_type_name || p.plan_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.policy_start_date || '-'} to {p.policy_end_date || '-'}</td>
                                        <td className="py-2.5 px-3 font-semibold text-gray-800">₹{p.sum_assured || '0'}</td>
                                        <td className="py-2.5 px-3 font-bold text-gray-900">₹{p.total_premium || '0'}</td>
                                        <td className="py-2.5 px-3">
                                          {p.expired === 1 ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                              Expired
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                              Active
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setViewLifeId(lifeId)}
                                              className="p-1 rounded-md text-[#2B4399] hover:bg-blue-100 transition-colors cursor-pointer"
                                              title="View Life Insurance Policy"
                                            >
                                              <Eye size={14} />
                                            </button>
                                            {p.policy_pdf && (
                                              <a
                                                href={p.policy_pdf}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center"
                                                title="Download PDF"
                                              >
                                                <Download size={14} />
                                              </a>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Health Insurance */}
                        {healthPolicies.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Shield size={15} className="text-emerald-500" /> Health Insurance ({healthPolicies.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Policy Number</th>
                                    <th className="py-2.5 px-3">Company</th>
                                    <th className="py-2.5 px-3">Plan Type</th>
                                    <th className="py-2.5 px-3">Period</th>
                                    <th className="py-2.5 px-3">Sum Insured</th>
                                    <th className="py-2.5 px-3">Premium</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {healthPolicies.map((p: any, i: number) => {
                                    const healthId = p.health_insurance_id || p.policy_id;
                                    return (
                                      <tr key={healthId || i} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="py-2.5 px-3">
                                          <button
                                            type="button"
                                            onClick={() => setViewHealthId(healthId)}
                                            className="font-mono font-bold text-[#2B4399] hover:underline cursor-pointer flex items-center gap-1.5"
                                            title="Click to view details"
                                          >
                                            <span>{p.policy_number || `Policy #${healthId}`}</span>
                                          </button>
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-800 font-medium">{p.company_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.plan_type_name || p.plan_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.policy_start_date || '-'} to {p.policy_end_date || '-'}</td>
                                        <td className="py-2.5 px-3 font-semibold text-gray-800">₹{p.sum_assured || p.sum_insured || '0'}</td>
                                        <td className="py-2.5 px-3 font-bold text-gray-900">₹{p.total_premium || '0'}</td>
                                        <td className="py-2.5 px-3">
                                          {p.expired === 1 ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                              Expired
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                              Active
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setViewHealthId(healthId)}
                                              className="p-1 rounded-md text-[#2B4399] hover:bg-blue-100 transition-colors cursor-pointer"
                                              title="View Health Insurance Policy"
                                            >
                                              <Eye size={14} />
                                            </button>
                                            {p.policy_pdf && (
                                              <a
                                                href={p.policy_pdf}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center"
                                                title="Download PDF"
                                              >
                                                <Download size={14} />
                                              </a>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Motor Insurance */}
                        {motorPolicies.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Car size={15} className="text-blue-500" /> Motor Insurance ({motorPolicies.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Policy Number</th>
                                    <th className="py-2.5 px-3">Vehicle / Company</th>
                                    <th className="py-2.5 px-3">Plan Type</th>
                                    <th className="py-2.5 px-3">Period</th>
                                    <th className="py-2.5 px-3">Premium</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {motorPolicies.map((p: any, i: number) => {
                                    const motorId = p.motor_insurance_id || p.policy_id;
                                    return (
                                      <tr key={motorId || i} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="py-2.5 px-3">
                                          <button
                                            type="button"
                                            onClick={() => setViewMotorId(motorId)}
                                            className="font-mono font-bold text-[#2B4399] hover:underline cursor-pointer flex items-center gap-1.5"
                                            title="Click to view details"
                                          >
                                            <span>{p.policy_number || `Policy #${motorId}`}</span>
                                          </button>
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-800 font-medium">{p.vehicle_number || p.company_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.plan_type_name || p.insurance_type_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.policy_start_date || '-'} to {p.policy_end_date || '-'}</td>
                                        <td className="py-2.5 px-3 font-bold text-gray-900">₹{p.total_premium || '0'}</td>
                                        <td className="py-2.5 px-3">
                                          {p.expired === 1 ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                              Expired
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                              Active
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setViewMotorId(motorId)}
                                              className="p-1 rounded-md text-[#2B4399] hover:bg-blue-100 transition-colors cursor-pointer"
                                              title="View Motor Insurance Policy"
                                            >
                                              <Eye size={14} />
                                            </button>
                                            {p.policy_pdf && (
                                              <a
                                                href={p.policy_pdf}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center"
                                                title="Download PDF"
                                              >
                                                <Download size={14} />
                                              </a>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Other Insurance */}
                        {otherPolicies.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Umbrella size={15} className="text-purple-500" /> Other Insurance ({otherPolicies.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Policy Number</th>
                                    <th className="py-2.5 px-3">Type / Company</th>
                                    <th className="py-2.5 px-3">Plan Name</th>
                                    <th className="py-2.5 px-3">Period</th>
                                    <th className="py-2.5 px-3">Sum Assured</th>
                                    <th className="py-2.5 px-3">Premium</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {otherPolicies.map((p: any, i: number) => {
                                    const otherId = String(p.other_insurance_id || p.policy_id);
                                    return (
                                      <tr key={otherId || i} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="py-2.5 px-3">
                                          <button
                                            type="button"
                                            onClick={() => setViewOtherId(otherId)}
                                            className="font-mono font-bold text-[#2B4399] hover:underline cursor-pointer flex items-center gap-1.5"
                                            title="Click to view details"
                                          >
                                            <span>{p.policy_number || `Policy #${otherId}`}</span>
                                          </button>
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-800 font-medium">
                                          <span>{p.insurance_type_name || 'Other Insurance'}</span>
                                          {p.company_name && <span className="block text-[11px] text-gray-500">{p.company_name}</span>}
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.plan_name || p.plan_type_name || '-'}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{p.policy_start_date || '-'} to {p.policy_end_date || '-'}</td>
                                        <td className="py-2.5 px-3 font-semibold text-gray-800">₹{p.sum_assured || '0'}</td>
                                        <td className="py-2.5 px-3 font-bold text-gray-900">₹{p.total_premium || '0'}</td>
                                        <td className="py-2.5 px-3">
                                          {p.expired === 1 ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                              Expired
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                              Active
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setViewOtherId(otherId)}
                                              className="p-1 rounded-md text-[#2B4399] hover:bg-blue-100 transition-colors cursor-pointer"
                                              title="View Other Insurance Policy"
                                            >
                                              <Eye size={14} />
                                            </button>
                                            {p.policy_pdf && (
                                              <a
                                                href={p.policy_pdf}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center"
                                                title="Download PDF"
                                              >
                                                <Download size={14} />
                                              </a>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* TAB 3: Claims & Quotations */}
                {activeTab === 'claims' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {totalClaimsAndQuotes === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                        <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-700">No Claims or Quotations Found</p>
                        <p className="text-xs text-gray-500 mt-1">This customer does not have any recorded claims or quotations.</p>
                      </div>
                    ) : (
                      <>
                        {/* Claims Table */}
                        {claims.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <FileCheck size={15} className="text-amber-500" /> Claims ({claims.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Claim ID / No</th>
                                    <th className="py-2.5 px-3">Policy Number</th>
                                    <th className="py-2.5 px-3">Claim Amount</th>
                                    <th className="py-2.5 px-3">Date</th>
                                    <th className="py-2.5 px-3">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {claims.map((c: any, i: number) => (
                                    <tr key={c.claim_id || i} className="hover:bg-gray-50/50">
                                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{c.claim_number || `#${c.claim_id || i + 1}`}</td>
                                      <td className="py-2.5 px-3 text-[#2B4399] font-medium">{c.policy_number || '-'}</td>
                                      <td className="py-2.5 px-3 font-bold text-gray-900">₹{c.claim_amount || '0'}</td>
                                      <td className="py-2.5 px-3 text-gray-600">{c.claim_date || c.created_at || '-'}</td>
                                      <td className="py-2.5 px-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                          {c.status_name || c.status || 'Pending'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Quotations (Health + Motor) */}
                        {(healthQuotations.length > 0 || motorQuotations.length > 0) && (
                          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <FileText size={15} className="text-cyan-500" /> Quotations ({healthQuotations.length + motorQuotations.length})
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    <th className="py-2.5 px-3">Quotation ID</th>
                                    <th className="py-2.5 px-3">Type</th>
                                    <th className="py-2.5 px-3">Company / Plan</th>
                                    <th className="py-2.5 px-3">Premium</th>
                                    <th className="py-2.5 px-3">Created Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {healthQuotations.map((q: any, i: number) => (
                                    <tr key={`hq-${q.id || i}`} className="hover:bg-gray-50/50">
                                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">#{q.id || q.quotation_id || i + 1}</td>
                                      <td className="py-2.5 px-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          Health Quotation
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-gray-700">{q.company_name || q.plan_name || '-'}</td>
                                      <td className="py-2.5 px-3 font-bold text-gray-900">₹{q.premium || q.total_premium || '0'}</td>
                                      <td className="py-2.5 px-3 text-gray-600">{q.created_at || '-'}</td>
                                    </tr>
                                  ))}
                                  {motorQuotations.map((q: any, i: number) => (
                                    <tr key={`mq-${q.id || i}`} className="hover:bg-gray-50/50">
                                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">#{q.id || q.quotation_id || i + 1}</td>
                                      <td className="py-2.5 px-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                          Motor Quotation
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-gray-700">{q.company_name || q.vehicle_number || '-'}</td>
                                      <td className="py-2.5 px-3 font-bold text-gray-900">₹{q.premium || q.total_premium || '0'}</td>
                                      <td className="py-2.5 px-3 text-gray-600">{q.created_at || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-white border-t border-gray-200 px-6 py-3.5 flex items-center justify-end shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#2B4399] bg-white border border-[#2B4399] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2B4399] hover:bg-[#233880] rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Edit size={13} />
                <span>Edit Customer</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Insurance Details Pop-up View Modals */}
      <LifeInsuranceViewModal
        isOpen={Boolean(viewLifeId)}
        onClose={() => setViewLifeId(null)}
        lifeInsuranceId={viewLifeId}
      />

      <HealthInsuranceViewModal
        isOpen={Boolean(viewHealthId)}
        onClose={() => setViewHealthId(null)}
        healthInsuranceId={viewHealthId}
      />

      <MotorInsuranceViewModal
        isOpen={Boolean(viewMotorId)}
        onClose={() => setViewMotorId(null)}
        motorInsuranceId={viewMotorId}
      />

      <ViewOtherInsuranceModal
        isOpen={Boolean(viewOtherId)}
        onClose={() => setViewOtherId(null)}
        id={viewOtherId}
      />
    </>
  );
}
