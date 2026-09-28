import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSelectPlan }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | '6month' | '12month'>('6month');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedPlan === 'free') {
        toast.info('You are currently on the Free Trial Plan');
      } else {
        const planName = selectedPlan === '6month' ? '6 Months Pro' : '12 Months Annual';
        toast.success(`Redirecting to payment for ${planName}...`);
      }
      if (onSelectPlan) onSelectPlan(selectedPlan);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Light Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Clean White Modal Box */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200 z-10 text-slate-800">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all z-20"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Clean Header */}
        <div className="pt-8 pb-4 px-6 sm:px-8 text-center border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#2E3192] text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles size={14} className="text-[#2E3192]" />
            Insuraa Membership
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 font-medium">
            Choose the right plan to manage leads, policies & quotes effortlessly.
          </p>
        </div>

        {/* 3 Simple Professional Cards */}
        <div className="p-6 sm:p-8 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

            {/* CARD 1: FREE TRIAL */}
            <div
              onClick={() => setSelectedPlan('free')}
              className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between border transition-all cursor-pointer relative ${selectedPlan === 'free'
                ? 'border-[#2E3192] ring-2 ring-[#2E3192]/20 shadow-lg'
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic</span>
                  {selectedPlan === 'free' && <CheckCircle2 size={18} className="text-[#2E3192]" />}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">Free Trial</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-medium"> / forever</span>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check size={15} className="text-emerald-500 shrink-0" />
                    <span>Up to 10 Leads & Clients</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check size={15} className="text-emerald-500 shrink-0" />
                    <span>Basic Policy Records</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check size={15} className="text-emerald-500 shrink-0" />
                    <span>Standard Quotes</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedPlan('free'); }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${selectedPlan === 'free'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {selectedPlan === 'free' ? 'Selected' : 'Select Free'}
              </button>
            </div>

            {/* CARD 2: 6 MONTHS PRO */}
            <div
              onClick={() => setSelectedPlan('6month')}
              className={`bg-[#F7F8FF] rounded-2xl p-5 sm:p-6 flex flex-col justify-between border-2 transition-all cursor-pointer relative ${selectedPlan === '6month'
                ? 'border-[#2E3192] ring-2 ring-[#2E3192]/20 shadow-xl scale-[1.02]'
                : 'border-[#2E3192]/40 hover:border-[#2E3192] shadow-md'
                }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2E3192] text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                MOST POPULAR
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-xs font-bold text-[#2E3192] uppercase tracking-wider">6 Months</span>
                  {selectedPlan === '6month' && <CheckCircle2 size={18} className="text-[#2E3192]" />}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">Pro Plan</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[#2E3192]">₹2,999</span>
                  <span className="text-xs text-slate-500 font-medium"> / 6 Months</span>
                  <p className="text-[11px] font-bold text-emerald-600 mt-0.5">₹499/mo (Save 25%)</p>
                </div>

                <div className="border-t border-indigo-100 pt-4 mb-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-[#2E3192] shrink-0" />
                    <span>Unlimited Leads & Clients</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-[#2E3192] shrink-0" />
                    <span>Auto Policy Renewal Alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-[#2E3192] shrink-0" />
                    <span>Health, Motor & Life Quotes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-[#2E3192] shrink-0" />
                    <span>WhatsApp Alert Support</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedPlan('6month'); }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${selectedPlan === '6month'
                  ? 'bg-[#2E3192] hover:bg-[#232569] text-white'
                  : 'bg-indigo-100 text-[#2E3192] hover:bg-indigo-200'
                  }`}
              >
                {selectedPlan === '6month' ? 'Selected Pro' : 'Select Pro Plan'}
              </button>
            </div>

            {/* CARD 3: 12 MONTHS ANNUAL */}
            <div
              onClick={() => setSelectedPlan('12month')}
              className={`bg-[#F2FAF7] rounded-2xl p-5 sm:p-6 flex flex-col justify-between border-2 transition-all cursor-pointer relative ${selectedPlan === '12month'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl scale-[1.02]'
                : 'border-emerald-400/60 hover:border-emerald-500 shadow-md'
                }`}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                BEST VALUE • SAVE 45%
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">12 Months</span>
                  {selectedPlan === '12month' && <CheckCircle2 size={18} className="text-emerald-600" />}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">Annual VIP</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-emerald-700">₹4,999</span>
                  <span className="text-xs text-slate-500 font-medium"> / 12 Months</span>
                  <p className="text-[11px] font-bold text-emerald-600 mt-0.5">₹416/mo (Best Price)</p>
                </div>

                <div className="border-t border-emerald-100 pt-4 mb-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-emerald-600 shrink-0" />
                    <span>Everything in 6M Pro Plan</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-emerald-600 shrink-0" />
                    <span>Multi-User Agency Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-emerald-600 shrink-0" />
                    <span>Commission & Business Tracker</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                    <Check size={15} className="text-emerald-600 shrink-0" />
                    <span>Custom Agency Branding</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedPlan('12month'); }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${selectedPlan === '12month'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
              >
                {selectedPlan === '12month' ? 'Selected Annual' : 'Select Annual Plan'}
              </button>
            </div>

          </div>
        </div>

        {/* Clean Action Footer */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Encrypted Payment • Cancel Anytime</span>
          </div>

          <div className="flex items-center gap-3">
          
            <button
              type="button"
              onClick={handleProceed}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#2E3192] hover:bg-[#232569] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Continue with Selected Plan'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
